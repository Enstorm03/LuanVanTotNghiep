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

        boolean allInStock = true;
        // Nếu cho phép đặt hàng backorder thì bỏ qua kiểm tra tồn kho
        if (Boolean.TRUE.equals(req.getAllowBackorder())) {
            allInStock = false; // Mặc định xử lý như hết hàng để vào luồng chờ hàng
        } else {
            // Chỉ kiểm tra tồn kho nếu không phải là đơn backorder
            for (PlaceOrderItemRequest it : req.getItems()) {
                SanPham sp = sanPhamRepository.findById(it.getSanPhamId())
                        .orElseThrow(() -> new BusinessException("Sản phẩm không tồn tại: " + it.getSanPhamId()));
                int ton = sp.getSoLuongTonKho() == null ? 0 : sp.getSoLuongTonKho();
                if (ton < it.getSoLuong()) {
                    allInStock = false;
                    break;
                }
            }
        }

        DonHang dh = new DonHang();
        dh.setIdNguoiDung(req.getIdNguoiDung());
        dh.setTenNguoiNhan(req.getTenNguoiNhan());
        dh.setDiaChiGiaoHang(req.getDiaChiGiaoHang());
        dh.setNgayDatHang(LocalDateTime.now());

        BigDecimal tong = BigDecimal.ZERO;
        List<ChiTietDonHang> ctList = new ArrayList<>();

        for (PlaceOrderItemRequest it : req.getItems()) {
            SanPham sp = sanPhamRepository.findById(it.getSanPhamId()).orElseThrow();
            ChiTietDonHang ct = new ChiTietDonHang();
            ct.setDonHang(dh);
            ct.setSanPham(sp);
            ct.setSoLuong(it.getSoLuong());
            // Giá tại thời điểm đặt lấy từ sp.giaBan
            if (sp.getGiaBan() == null) {
                throw new BusinessException("Sản phẩm chưa có giá: " + sp.getTenSanPham());
            }
            ct.setGiaTaiThoiDiemMua(sp.getGiaBan());
            ctList.add(ct);
            tong = tong.add(sp.getGiaBan().multiply(BigDecimal.valueOf(it.getSoLuong())));
        }

        dh.setTongTien(tong);
        dh.setChiTietDonHangs(ctList);

        if (allInStock) {
            // Trừ kho ngay và đặt trạng thái Đang chờ, thanh toán: Chưa thanh toán
            dh.setTrangThaiVanHanh(DonHangService.TT_CHO_XAC_NHAN);
            dh.setTrangThaiThanhToan("Chưa thanh toán");
            for (ChiTietDonHang ct : ctList) {
                SanPham sp = ct.getSanPham();
                sp.setSoLuongTonKho((sp.getSoLuongTonKho() == null ? 0 : sp.getSoLuongTonKho()) - ct.getSoLuong());
                sanPhamRepository.save(sp);
            }
            dh.setTienDatCoc(BigDecimal.ZERO);
        } else {
            // Hàng order/backorder: Chờ hàng, Chờ cọc, cọc = 50%, không trừ kho
            dh.setTrangThaiVanHanh(DonHangService.TT_CHO_HANG);
            dh.setTrangThaiThanhToan("Chờ cọc");
            dh.setTienDatCoc(tong.multiply(new BigDecimal("0.5")));
            
            // Nếu là đơn backorder, lưu thông tin vào lý do
            if (Boolean.TRUE.equals(req.getAllowBackorder())) {
                dh.setLyDoHuy("Đơn hàng đặt trước (backorder)");
            }
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
