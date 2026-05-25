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
        dh.setDiaChiGiaoHang(req.getDiaChiGiaoHang());
        dh.setNgayDatHang(LocalDateTime.now());
        dh.setTrangThaiThanhToan("Chưa thanh toán");

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
            ct.setGiaTaiThoiDiemMua(sp.getGiaBan() != null ? sp.getGiaBan() : BigDecimal.ZERO);
            ctList.add(ct);

            tong = tong.add(ct.getGiaTaiThoiDiemMua().multiply(BigDecimal.valueOf(it.getSoLuong())));
        }

        dh.setTongTien(tong);
        dh.setChiTietDonHangs(ctList);

        if (allInStock) {
            // Trường hợp đủ hàng: Trừ kho ngay lập tức
            // JPA sẽ tự kiểm tra @Version khi save sản phẩm
            for (PlaceOrderItemRequest it : req.getItems()) {
                SanPham sp = sanPhamRepository.findById(it.getSanPhamId()).get();
                sp.setSoLuongTonKho(sp.getSoLuongTonKho() - it.getSoLuong());
                sanPhamRepository.save(sp);
            }
            dh.setTrangThaiVanHanh(DonHangService.TT_CHO_XAC_NHAN);
        } else {
            // Trường hợp thiếu hàng: Đặt trạng thái Chờ hàng
            dh.setTrangThaiVanHanh("Chờ hàng");
        }

        return donHangRepository.save(dh);
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
