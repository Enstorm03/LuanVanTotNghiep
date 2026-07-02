package com.example.perfumeshop.service;

import com.example.perfumeshop.entity.ChiTietDonHang;
import com.example.perfumeshop.entity.DonHang;
import com.example.perfumeshop.entity.NguoiDung;
import com.example.perfumeshop.exception.BusinessException;
import com.example.perfumeshop.repository.DonHangRepository;
import com.example.perfumeshop.repository.NguoiDungRepository;
import jakarta.transaction.Transactional;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import vn.payos.PayOS;
import vn.payos.model.v2.paymentRequests.CreatePaymentLinkRequest;
import vn.payos.model.v2.paymentRequests.CreatePaymentLinkResponse;
import vn.payos.model.v2.paymentRequests.PaymentLink;
import vn.payos.model.v2.paymentRequests.PaymentLinkItem;
import vn.payos.model.webhooks.WebhookData;

import java.util.ArrayList;
import java.util.List;

@Service
public class PaymentService {

    @Autowired
    private PayOS payOS;

    @Autowired
    private DonHangRepository donHangRepository;

    @Autowired
    private NguoiDungRepository nguoiDungRepository;

    @Autowired
    private JavaMailSender javaMailSender;

    @Value("${payos.return-url}")
    private String returnUrl;

    @Value("${payos.cancel-url}")
    private String cancelUrl;

    /**
     * Tạo link thanh toán PayOS cho một đơn hàng.
     * Trả về checkoutUrl để FE redirect khách sang.
     */
    public String createPaymentLink(Integer idDonHang) throws Exception {
        DonHang dh = donHangRepository.findById(idDonHang)
                .orElseThrow(() -> new BusinessException("Đơn hàng không tồn tại"));

        // Kiểm tra đơn chưa thanh toán
        if ("Đã thanh toán".equals(dh.getTrangThaiThanhToan())) {
            throw new BusinessException("Đơn hàng này đã được thanh toán");
        }

        // OrderCode phải là số nguyên dương, dùng idDonHang
        long orderCode = idDonHang.longValue();

        // Tổng tiền theo đơn vị VND
        Long amount = dh.getTongTien().longValue();

        // Mô tả ngắn gọn (tối đa 25 ký tự theo PayOS)
        String description = "Don hang #" + idDonHang;

        // Danh sách sản phẩm
        List<PaymentLinkItem> items = new ArrayList<>();
        if (dh.getChiTietDonHangs() != null) {
            for (ChiTietDonHang ct : dh.getChiTietDonHangs()) {
                String tenSp = ct.getSanPham() != null
                        ? truncate(ct.getSanPham().getTenSanPham(), 50)
                        : "San pham";
                Long gia = ct.getGiaTaiThoiDiemMua() != null
                        ? ct.getGiaTaiThoiDiemMua().longValue() : 0L;
                items.add(PaymentLinkItem.builder()
                        .name(tenSp)
                        .quantity(ct.getSoLuong())
                        .price(gia)
                        .build());
            }
        }

        // Xây dựng request
        CreatePaymentLinkRequest paymentData = CreatePaymentLinkRequest.builder()
                .orderCode(orderCode)
                .amount(amount)
                .description(description)
                .items(items)
                .returnUrl(returnUrl + "?orderId=" + idDonHang)
                .cancelUrl(cancelUrl + "?orderId=" + idDonHang)
                .build();

        CreatePaymentLinkResponse response = payOS.paymentRequests().create(paymentData);
        return response.getCheckoutUrl();
    }

    /**
     * Xử lý webhook từ PayOS sau khi khách thanh toán xong.
     * Cập nhật trạng thái thanh toán hoặc hủy đơn nếu thất bại.
     */
    @Transactional
    public void handleWebhook(WebhookData data) {
        Long orderCode = data.getOrderCode();
        if (orderCode == null) return;

        Integer idDonHang = orderCode.intValue();
        DonHang dh = donHangRepository.findById(idDonHang).orElse(null);
        if (dh == null) return;

        String code = data.getCode(); // "00" = thành công
        if ("00".equals(code)) {
            // Thanh toán thành công
            dh.setTrangThaiThanhToan("Đã thanh toán");
            donHangRepository.save(dh);
            
            // Gửi email thông báo thanh toán thành công
            sendPaymentSuccessNotification(dh);
        } else {
            // Thanh toán thất bại / hủy → tự động hủy đơn nếu chưa xử lý
            String tt = dh.getTrangThaiVanHanh();
            boolean coTheHuy = DonHangService.TT_CHO_XAC_NHAN.equals(tt)
                    || DonHangService.TT_DA_XAC_NHAN.equals(tt);
            if (coTheHuy) {
                // Kho chỉ bị trừ khi admin confirm (TT_DA_XAC_NHAN).
                // Đơn đang TT_CHO_XAC_NHAN → chưa trừ kho → không cần hoàn.
                boolean daGiamKho = DonHangService.TT_DA_XAC_NHAN.equals(tt);
                if (daGiamKho && dh.getChiTietDonHangs() != null) {
                    for (var item : dh.getChiTietDonHangs()) {
                        var sp = item.getSanPham();
                        if (sp == null) continue;
                        int ton = sp.getSoLuongTonKho() == null ? 0 : sp.getSoLuongTonKho();
                        sp.setSoLuongTonKho(ton + item.getSoLuong());
                    }
                }
                dh.setTrangThaiVanHanh(DonHangService.TT_DA_HUY);
                dh.setLyDoHuy("Thanh toán PayOS không thành công (code: " + code + ")");
                donHangRepository.save(dh);
                
                // Gửi email thông báo hủy đơn
                sendOrderCancelledNotification(dh);
            }
        }
    }

    /**
     * Kiểm tra trạng thái thanh toán của đơn hàng qua PayOS API.
     */
    @Transactional
    public String checkPaymentStatus(Integer idDonHang) throws Exception {
        PaymentLink paymentInfo = payOS.paymentRequests().get(idDonHang.longValue());
        String status = paymentInfo.getStatus().name(); // PAID, PENDING, CANCELLED, EXPIRED

        DonHang dh = donHangRepository.findById(idDonHang).orElse(null);
        if (dh == null) return status;

        if ("PAID".equals(status)) {
            // Webhook có thể không bắn được, nên check & update dự phòng
            if (!"Đã thanh toán".equals(dh.getTrangThaiThanhToan())) {
                dh.setTrangThaiThanhToan("Đã thanh toán");
                donHangRepository.save(dh);
                
                // Gửi email thông báo thanh toán thành công
                sendPaymentSuccessNotification(dh);
            }
        } else if ("CANCELLED".equals(status)) {
            String tt = dh.getTrangThaiVanHanh();
            boolean coTheHuy = DonHangService.TT_CHO_XAC_NHAN.equals(tt)
                    || DonHangService.TT_DA_XAC_NHAN.equals(tt);

            if (coTheHuy) {
                // Chỉ hoàn kho nếu đơn đã qua confirm (kho đã bị trừ)
                boolean daGiamKho = DonHangService.TT_DA_XAC_NHAN.equals(tt);
                if (daGiamKho && dh.getChiTietDonHangs() != null) {
                    for (var item : dh.getChiTietDonHangs()) {
                        var sp = item.getSanPham();
                        if (sp == null) continue;
                        int ton = sp.getSoLuongTonKho() == null ? 0 : sp.getSoLuongTonKho();
                        sp.setSoLuongTonKho(ton + item.getSoLuong());
                    }
                }
                dh.setTrangThaiVanHanh(DonHangService.TT_DA_HUY);
                dh.setLyDoHuy("Khách hàng chủ động hủy thanh toán PayOS");
                donHangRepository.save(dh);
                
                // Gửi email thông báo hủy đơn
                sendOrderCancelledNotification(dh);
            }
        }

        return status;
    }

    /**
     * Gửi email thông báo thanh toán thành công
     */
    private void sendPaymentSuccessNotification(DonHang dh) {
        if (dh.getIdNguoiDung() == null) return;
        
        NguoiDung user = nguoiDungRepository.findById(dh.getIdNguoiDung()).orElse(null);
        if (user == null || user.getEmail() == null) return;
        
        try {
            sendPaymentSuccessEmail(
                    user.getEmail(),
                    user.getHoTen(),
                    dh.getIdDonHang(),
                    dh.getTongTien(),
                    dh.getDiaChiGiaoHang(),
                    dh.getTenNguoiNhan(),
                    dh.getSoDienThoai()
            );
        } catch (Exception e) {
            System.err.println("Lỗi gửi email thanh toán: " + e.getMessage());
        }
    }

    /**
     * Gửi email thông báo hủy đơn hàng
     */
    private void sendOrderCancelledNotification(DonHang dh) {
        if (dh.getIdNguoiDung() == null) return;
        
        NguoiDung user = nguoiDungRepository.findById(dh.getIdNguoiDung()).orElse(null);
        if (user == null || user.getEmail() == null) return;
        
        try {
            sendOrderCancelledEmail(
                    user.getEmail(),
                    user.getHoTen(),
                    dh.getIdDonHang(),
                    dh.getLyDoHuy()
            );
        } catch (Exception e) {
            System.err.println("Lỗi gửi email hủy đơn: " + e.getMessage());
        }
    }

    private void sendPaymentSuccessEmail(String email, String hoTen, Integer idDonHang, 
            java.math.BigDecimal tongTien, String diaChiGiaoHang, String tenNguoiNhan, 
            String soDienThoai) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        
        helper.setTo(email);
        helper.setSubject("Thanh toán thành công - Perfume Shop");
        helper.setFrom("tuyen88931600@gmail.com");
        
        String htmlContent = buildPaymentSuccessTemplate(hoTen, idDonHang, tongTien, 
                diaChiGiaoHang, tenNguoiNhan, soDienThoai);
        helper.setText(htmlContent, true);
        
        javaMailSender.send(message);
    }

    private void sendOrderCancelledEmail(String email, String hoTen, Integer idDonHang, 
            String lyDoHuy) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        
        helper.setTo(email);
        helper.setSubject("Đơn hàng đã bị hủy - Perfume Shop");
        helper.setFrom("tuyen88931600@gmail.com");
        
        String htmlContent = buildOrderCancelledTemplate(hoTen, idDonHang, lyDoHuy);
        helper.setText(htmlContent, true);
        
        javaMailSender.send(message);
    }

    private String buildPaymentSuccessTemplate(String hoTen, Integer idDonHang, 
            java.math.BigDecimal tongTien, String diaChiGiaoHang, String tenNguoiNhan, 
            String soDienThoai) {
        return "<!DOCTYPE html><html><head><meta charset='UTF-8'><style>" +
                "body{font-family:'Segoe UI',sans-serif;line-height:1.6;color:#333}" +
                ".container{max-width:600px;margin:0 auto;padding:20px;background:#f9f9f9;border-radius:8px}" +
                ".header{background:linear-gradient(135deg,#4caf50,#45a049);color:white;padding:40px 20px;border-radius:8px 8px 0 0;text-align:center}" +
                ".header h1{margin:0;font-size:28px}.content{background:white;padding:30px 20px}" +
                ".section{margin:20px 0}.section-title{color:#4caf50;font-weight:bold;margin-bottom:10px}" +
                ".info-row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee}" +
                ".info-label{font-weight:bold;color:#555}.info-value{color:#333}" +
                ".total{background:#f5f5f5;padding:15px;border-radius:5px;margin-top:15px}" +
                ".total-amount{font-size:20px;font-weight:bold;color:#4caf50}" +
                ".success-badge{display:inline-block;background:#4caf50;color:white;padding:8px 15px;border-radius:20px;font-size:12px;margin-bottom:15px}" +
                ".footer{background:#f0f0f0;padding:15px;text-align:center;font-size:12px;color:#666;border-radius:0 0 8px 8px}" +
                "</style></head><body><div class='container'><div class='header'><h1>✓ Thanh Toán Thành Công!</h1></div>" +
                "<div class='content'><p><span class='success-badge'>Đơn hàng đã được xác nhận</span></p>" +
                "<p>Xin chào <strong>" + hoTen + "</strong>,</p><p>Cảm ơn bạn! Thanh toán của bạn đã được xác nhận.</p>" +
                "<div class='section'><div class='section-title'>Thông tin đơn hàng</div>" +
                "<div class='info-row'><span class='info-label'>Mã đơn:</span><span class='info-value'>#" + idDonHang + "</span></div>" +
                "<div class='info-row'><span class='info-label'>Tổng tiền:</span><span class='info-value'>" + String.format("%,d", tongTien.longValue()) + " VNĐ</span></div></div>" +
                "<div class='section'><div class='section-title'>Địa chỉ giao hàng</div>" +
                "<div class='info-row'><span class='info-label'>Người nhận:</span><span class='info-value'>" + (tenNguoiNhan != null ? tenNguoiNhan : "") + "</span></div>" +
                "<div class='info-row'><span class='info-label'>SĐT:</span><span class='info-value'>" + (soDienThoai != null ? soDienThoai : "") + "</span></div>" +
                "<div class='info-row'><span class='info-label'>Địa chỉ:</span><span class='info-value'>" + (diaChiGiaoHang != null ? diaChiGiaoHang : "") + "</span></div></div>" +
                "<p>Đơn hàng đang được chuẩn bị. Bạn sẽ nhận email cập nhật khi hàng được giao.</p>" +
                "</div><div class='footer'><p>&copy; 2026 Perfume Shop</p></div></div></body></html>";
    }

    private String buildOrderCancelledTemplate(String hoTen, Integer idDonHang, String lyDoHuy) {
        return "<!DOCTYPE html><html><head><meta charset='UTF-8'><style>" +
                "body{font-family:'Segoe UI',sans-serif;line-height:1.6;color:#333}" +
                ".container{max-width:600px;margin:0 auto;padding:20px;background:#f9f9f9;border-radius:8px}" +
                ".header{background:linear-gradient(135deg,#f44336,#e53935);color:white;padding:40px 20px;border-radius:8px 8px 0 0;text-align:center}" +
                ".header h1{margin:0;font-size:28px}.content{background:white;padding:30px 20px}" +
                ".error-badge{display:inline-block;background:#f44336;color:white;padding:8px 15px;border-radius:20px;font-size:12px;margin-bottom:15px}" +
                ".footer{background:#f0f0f0;padding:15px;text-align:center;font-size:12px;color:#666;border-radius:0 0 8px 8px}" +
                "</style></head><body><div class='container'><div class='header'><h1>✗ Đơn Hàng Đã Hủy</h1></div>" +
                "<div class='content'><p><span class='error-badge'>Đơn hàng đã bị hủy</span></p>" +
                "<p>Xin chào <strong>" + hoTen + "</strong>,</p><p>Rất tiếc! Đơn hàng của bạn đã bị hủy.</p>" +
                "<p><strong>Mã đơn:</strong> #" + idDonHang + "</p>" +
                "<p><strong>Lý do:</strong> " + (lyDoHuy != null ? lyDoHuy : "Không rõ") + "</p>" +
                "<p>Nếu bạn có câu hỏi, vui lòng liên hệ với chúng tôi.</p>" +
                "</div><div class='footer'><p>&copy; 2026 Perfume Shop</p></div></div></body></html>";
    }

    private String truncate(String s, int max) {
        if (s == null) return "";
        return s.length() > max ? s.substring(0, max) : s;
    }
}