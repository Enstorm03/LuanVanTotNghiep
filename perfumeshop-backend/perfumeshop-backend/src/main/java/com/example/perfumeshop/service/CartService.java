package com.example.perfumeshop.service;

import com.example.perfumeshop.dto.AddCartItemRequest;
import com.example.perfumeshop.dto.CheckoutCartRequest;
import com.example.perfumeshop.dto.UpdateCartItemRequest;
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
import java.util.Iterator;
import java.util.List;

@Service
public class CartService {

    @Autowired
    private DonHangRepository donHangRepository;

    @Autowired
    private SanPhamRepository sanPhamRepository;

    private static final String TT_GIO_HANG = "Giỏ hàng";

    @Transactional
    public DonHang getOrCreateCart(Integer userId) {
        if (userId == null) throw new BusinessException("userId là bắt buộc");
        List<DonHang> carts = donHangRepository.findByIdNguoiDungAndTrangThaiVanHanh(userId, TT_GIO_HANG);
        if (!carts.isEmpty()) return carts.get(0);
        DonHang dh = new DonHang();
        dh.setIdNguoiDung(userId);
        dh.setTrangThaiVanHanh(TT_GIO_HANG);
        dh.setTrangThaiThanhToan("Chưa thanh toán");
        dh.setNgayDatHang(null);
        dh.setTongTien(BigDecimal.ZERO);
        dh.setTienDatCoc(BigDecimal.ZERO);
        dh.setChiTietDonHangs(new ArrayList<>());
        return donHangRepository.save(dh);
    }

    @Transactional
    public DonHang addItem(AddCartItemRequest req) {
        DonHang cart = getOrCreateCart(req.getUserId());
        SanPham sp = sanPhamRepository.findById(req.getSanPhamId())
                .orElseThrow(() -> new BusinessException("Sản phẩm không tồn tại"));
        if (req.getSoLuong() <= 0) throw new BusinessException("Số lượng phải > 0");
        ChiTietDonHang existed = findItem(cart, sp.getIdSanPham());
        if (existed == null) {
            ChiTietDonHang ct = new ChiTietDonHang();
            ct.setDonHang(cart);
            ct.setSanPham(sp);
            ct.setSoLuong(req.getSoLuong());
            ct.setGiaTaiThoiDiemMua(sp.getGiaBan());
            cart.getChiTietDonHangs().add(ct);
        } else {
            existed.setSoLuong(existed.getSoLuong() + req.getSoLuong());
            existed.setGiaTaiThoiDiemMua(sp.getGiaBan());
        }
        recalc(cart);
        return donHangRepository.save(cart);
    }

    @Transactional
    public DonHang updateItem(UpdateCartItemRequest req) {
        DonHang cart = getOrCreateCart(req.getUserId());
        ChiTietDonHang existed = findItem(cart, req.getSanPhamId());
        if (existed == null) throw new BusinessException("Sản phẩm không có trong giỏ");
        if (req.getSoLuong() <= 0) {
            cart.getChiTietDonHangs().remove(existed);
        } else {
            SanPham sp = sanPhamRepository.findById(req.getSanPhamId())
                    .orElseThrow(() -> new BusinessException("Sản phẩm không tồn tại"));
            existed.setSoLuong(req.getSoLuong());
            existed.setGiaTaiThoiDiemMua(sp.getGiaBan());
        }
        recalc(cart);
        return donHangRepository.save(cart);
    }

    @Transactional
    public DonHang removeItem(Integer userId, Integer sanPhamId) {
        DonHang cart = getOrCreateCart(userId);
        ChiTietDonHang existed = findItem(cart, sanPhamId);
        if (existed != null) {
            cart.getChiTietDonHangs().remove(existed);
        }
        recalc(cart);
        return donHangRepository.save(cart);
    }

    @Transactional
    public DonHang clearCart(Integer userId) {
        DonHang cart = getOrCreateCart(userId);
        cart.getChiTietDonHangs().clear();
        recalc(cart);
        return donHangRepository.save(cart);
    }

    @Transactional
    public DonHang checkout(CheckoutCartRequest req) {
        DonHang cart = getOrCreateCart(req.getUserId());
        if (cart.getChiTietDonHangs() == null || cart.getChiTietDonHangs().isEmpty()) {
            throw new BusinessException("Giỏ hàng trống");
        }
        cart.setTenNguoiNhan(req.getTenNguoiNhan());
        cart.setDiaChiGiaoHang(req.getDiaChiGiaoHang());
        cart.setNgayDatHang(LocalDateTime.now());
        boolean allInStock = true;
        for (ChiTietDonHang it : cart.getChiTietDonHangs()) {
            SanPham sp = sanPhamRepository.findById(it.getSanPham().getIdSanPham())
                    .orElseThrow(() -> new BusinessException("Sản phẩm không tồn tại"));
            it.setGiaTaiThoiDiemMua(sp.getGiaBan());
            int ton = sp.getSoLuongTonKho() == null ? 0 : sp.getSoLuongTonKho();
            if (ton < it.getSoLuong()) allInStock = false;
        }
        recalc(cart);
        if (allInStock) {
            cart.setTrangThaiVanHanh(DonHangService.TT_CHO_XAC_NHAN);
            cart.setTrangThaiThanhToan("Chưa thanh toán");
            for (ChiTietDonHang it : cart.getChiTietDonHangs()) {
                SanPham sp = it.getSanPham();
                sp.setSoLuongTonKho((sp.getSoLuongTonKho() == null ? 0 : sp.getSoLuongTonKho()) - it.getSoLuong());
                sanPhamRepository.save(sp);
            }
            cart.setTienDatCoc(BigDecimal.ZERO);
        }
        return donHangRepository.save(cart);
    }

    private ChiTietDonHang findItem(DonHang cart, Integer sanPhamId) {
        if (cart.getChiTietDonHangs() == null) return null;
        for (ChiTietDonHang it : cart.getChiTietDonHangs()) {
            if (it.getSanPham() != null && it.getSanPham().getIdSanPham().equals(sanPhamId)) return it;
        }
        return null;
    }

    private void recalc(DonHang cart) {
        BigDecimal tong = BigDecimal.ZERO;
        if (cart.getChiTietDonHangs() != null) {
            Iterator<ChiTietDonHang> it = cart.getChiTietDonHangs().iterator();
            while (it.hasNext()) {
                ChiTietDonHang c = it.next();
                if (c.getSoLuong() == null || c.getSoLuong() <= 0) { it.remove(); continue; }
                if (c.getGiaTaiThoiDiemMua() == null) c.setGiaTaiThoiDiemMua(BigDecimal.ZERO);
                tong = tong.add(c.getGiaTaiThoiDiemMua().multiply(BigDecimal.valueOf(c.getSoLuong())));
            }
        }
        cart.setTongTien(tong);
    }
}
