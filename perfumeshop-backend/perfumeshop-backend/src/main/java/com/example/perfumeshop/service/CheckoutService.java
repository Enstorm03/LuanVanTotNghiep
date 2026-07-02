package com.example.perfumeshop.service;

import com.example.perfumeshop.dto.PlaceOrderItemRequest;
import com.example.perfumeshop.dto.PlaceOrderRequest;
import com.example.perfumeshop.entity.ChiTietDonHang;
import com.example.perfumeshop.entity.DonHang;
import com.example.perfumeshop.entity.SanPham;
import com.example.perfumeshop.exception.BusinessException;
import com.example.perfumeshop.repository.DonHangRepository;
import com.example.perfumeshop.repository.SanPhamRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class CheckoutService {

    @Autowired
    private SanPhamRepository sanPhamRepository;

    @Autowired
    private DonHangRepository donHangRepository;

    @Autowired
    private FEFOService fefoService;

    // Đặt hàng: tạo đơn và lưu vào DB — KHÔNG trừ kho tại bước này.
    // Kho sẽ được trừ khi admin bấm "Xác nhận đơn hàng", áp dụng cho cả COD lẫn online (PayOS).
    @Transactional
    public DonHang placeOrder(PlaceOrderRequest req) {
        if (req.getItems() == null || req.getItems().isEmpty()) {
            throw new BusinessException("Giỏ hàng trống");
        }

        DonHang dh = new DonHang();
        dh.setIdNguoiDung(req.getIdNguoiDung());
        dh.setTenNguoiNhan(req.getTenNguoiNhan());
        dh.setSoDienThoai(req.getSoDienThoai());
        dh.setDiaChiGiaoHang(req.getDiaChiGiaoHang());
        dh.setPhuongThucThanhToan(req.getPhuongThucThanhToan());
        dh.setGhiChu(req.getGhiChu());
        dh.setNgayDatHang(LocalDateTime.now());
        dh.setIdSuKien(req.getIdSuKien());
        dh.setGiamGiaHangLoat(req.getGiamGiaHangLoat());

        // Xác định trạng thái thanh toán dựa trên phương thức
        if ("COD".equalsIgnoreCase(req.getPhuongThucThanhToan())) {
            dh.setTrangThaiThanhToan("Chưa thanh toán"); // COD: nhận hàng mới thanh toán
        } else {
            dh.setTrangThaiThanhToan("Chờ thanh toán"); // Chuyển khoản/Ví: chờ người dùng chuyển tiền
        }

        boolean allInStock = !Boolean.TRUE.equals(req.getAllowBackorder());
        BigDecimal tong = BigDecimal.ZERO;
        List<ChiTietDonHang> ctList = new ArrayList<>();

        // Chuẩn bị dữ liệu và kiểm tra tồn kho
        for (PlaceOrderItemRequest it : req.getItems()) {
            SanPham sp = sanPhamRepository.findById(it.getSanPhamId())
                    .orElseThrow(() -> new BusinessException("Sản phẩm không tồn tại: " + it.getSanPhamId()));

            if (allInStock && (sp.getSoLuongTonKho() == null || sp.getSoLuongTonKho() < it.getSoLuong())) {
                allInStock = false;
            }

            ChiTietDonHang ct = new ChiTietDonHang();
            ct.setDonHang(dh);
            ct.setSanPham(sp);
            ct.setSoLuong(it.getSoLuong());
            // Dùng giá hiện tại (đã áp dụng giảm giá nếu đang sale)
            ct.setGiaTaiThoiDiemMua(sp.getGiaHienTai());
            
            // FEFO: Allocate from earliest expiring batch
            try {
                fefoService.allocateOrderItemFromBatch(ct, it.getSanPhamId(), it.getSoLuong());
            } catch (BusinessException e) {
                // If FEFO allocation fails, log but don't block order creation
                // Batch allocation can fail if no suitable batches exist yet
            }
            
            ctList.add(ct);

            tong = tong.add(ct.getGiaTaiThoiDiemMua().multiply(BigDecimal.valueOf(it.getSoLuong())));
        }

        // Tính tổng tiền sau giảm giá (nếu có)
        BigDecimal tongTienSauGiam = tong;
        BigDecimal giamGiaPercent = req.getGiamGiaHangLoat();
        if (giamGiaPercent != null && giamGiaPercent.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal discountAmount = tong.multiply(giamGiaPercent).divide(new BigDecimal(100), 2, java.math.RoundingMode.HALF_UP);
            tongTienSauGiam = tong.subtract(discountAmount);
        }
        
        dh.setTongTien(tongTienSauGiam);
        dh.setChiTietDonHangs(ctList);

        // Tự động tạo mã vận đơn
        dh.setMaVanDon(generateMaVanDon());

        // Mọi đơn hàng (cả COD lẫn online) đều KHÔNG trừ kho khi đặt.
        // Kho được trừ khi admin bấm xác nhận — đảm bảo tồn kho chỉ giảm cho đơn thực sự được xử lý.
        if (allInStock) {
            dh.setTrangThaiVanHanh(DonHangService.TT_CHO_XAC_NHAN);
        } else {
            dh.setTrangThaiVanHanh("Chờ hàng");
        }

        DonHang saved = donHangRepository.save(dh);

        // Xóa giỏ hàng sau khi đặt hàng thành công
        // Dùng CartService để xóa giỏ hàng hiện tại
        CartService cartService = applicationContext.getBean(CartService.class);
        try {
            cartService.clearCart(req.getIdNguoiDung());
        } catch (Exception ignored) {
            // Không throw lỗi nếu xóa giỏ thất bại
        }

        return saved;
    }

    // Inject ApplicationContext để lấy CartService bean (tránh circular dependency)
    @Autowired
    private org.springframework.context.ApplicationContext applicationContext;

    private String generateMaVanDon() {
        // Format: ORD + timestamp (yyMMddHHmmss) + 4 ký tự ngẫu nhiên
        String timestamp = java.time.LocalDateTime.now()
                .format(java.time.format.DateTimeFormatter.ofPattern("yyMMddHHmmss"));
        String random = UUID.randomUUID().toString().replace("-", "").substring(0, 4).toUpperCase();
        return "ORD" + timestamp + random;
    }

    // Khách hủy đơn: uỷ quyền sang DonHangService.cancel để áp dụng đúng quy tắc hoàn kho
    @Autowired
    private DonHangService donHangService;

    @Transactional
    public DonHang updatePaymentStatus(Integer donHangId, boolean isPaid) {
        DonHang donHang = donHangRepository.findById(donHangId)
                .orElseThrow(() -> new BusinessException("Đơn hàng không tồn tại"));

        donHang.setTrangThaiThanhToan(isPaid ? "Đã thanh toán" : "Chưa thanh toán");
        return donHangRepository.save(donHang);
    }


    @Transactional
    public DonHang cancelByCustomer(Integer donHangId, String lyDo) {
        return donHangService.cancel(donHangId, lyDo);
    }
}