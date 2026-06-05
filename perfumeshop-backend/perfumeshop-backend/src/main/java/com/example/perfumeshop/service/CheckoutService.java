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

    // Đặt hàng online: nếu tất cả đều còn hàng -> "Đang chờ" và trừ kho; nếu có món hết hàng -> "Chờ hàng" và tính cọc 50%, không trừ kho
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
            ctList.add(ct);

            tong = tong.add(ct.getGiaTaiThoiDiemMua().multiply(BigDecimal.valueOf(it.getSoLuong())));
        }

        dh.setTongTien(tong);
        dh.setChiTietDonHangs(ctList);

        // Tự động tạo mã vận đơn
        dh.setMaVanDon(generateMaVanDon());

        if (allInStock) {
            // Trường hợp đủ hàng: Trừ kho atomic — tránh race condition khi nhiều đơn đặt cùng lúc
            for (ChiTietDonHang ct : ctList) {
                SanPham sp = ct.getSanPham();
                int updated = sanPhamRepository.decrementStock(sp.getIdSanPham(), ct.getSoLuong());
                if (updated == 0) {
                    // Sản phẩm vừa bị người khác mua hết trong khoảng thời gian kiểm tra
                    throw new BusinessException(
                        "Sản phẩm '" + sp.getTenSanPham() + "' vừa hết hàng. Vui lòng thử lại."
                    );
                }
            }
            dh.setTrangThaiVanHanh(DonHangService.TT_CHO_XAC_NHAN);
        } else {
            // Trường hợp thiếu hàng: Đặt trạng thái Chờ hàng
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
