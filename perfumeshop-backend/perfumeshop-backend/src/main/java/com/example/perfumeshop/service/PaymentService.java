package com.example.perfumeshop.service;

import com.example.perfumeshop.entity.ChiTietDonHang;
import com.example.perfumeshop.entity.DonHang;
import com.example.perfumeshop.exception.BusinessException;
import com.example.perfumeshop.repository.DonHangRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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
        } else {
            // Thanh toán thất bại / hủy → tự động hủy đơn nếu chưa xử lý
            String tt = dh.getTrangThaiVanHanh();
            boolean coTheHuy = DonHangService.TT_CHO_XAC_NHAN.equals(tt)
                    || DonHangService.TT_DA_XAC_NHAN.equals(tt);
            if (coTheHuy) {
                // Hoàn kho
                if (dh.getChiTietDonHangs() != null) {
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
            }
        } else if ("CANCELLED".equals(status)) {
            // Vì Webhook không bắn khi Hủy, ta phải tự bắt trạng thái CANCELLED ở đây
            String tt = dh.getTrangThaiVanHanh();
            boolean coTheHuy = DonHangService.TT_CHO_XAC_NHAN.equals(tt)
                    || DonHangService.TT_DA_XAC_NHAN.equals(tt);

            if (coTheHuy) {
                // Hoàn kho
                if (dh.getChiTietDonHangs() != null) {
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
            }
        }

        return status;
    }

    private String truncate(String s, int max) {
        if (s == null) return "";
        return s.length() > max ? s.substring(0, max) : s;
    }
}