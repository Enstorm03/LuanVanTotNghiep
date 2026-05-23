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
    // Hàm lấy giỏ hàng hiện tại hoặc tạo mới nếu chưa có
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
        dh.setChiTietDonHangs(new ArrayList<>());
        return donHangRepository.save(dh);
    }

    @Transactional
    // Hàm thêm một sản phẩm vào giỏ hàng
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
    // Hàm cập nhật số lượng của một mặt hàng trong giỏ
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
    // Hàm xóa hẳn một sản phẩm khỏi giỏ
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
    // Hàm làm trống giỏ hàng
    public DonHang clearCart(Integer userId) {
        DonHang cart = getOrCreateCart(userId);
        cart.getChiTietDonHangs().clear();
        recalc(cart);
        return donHangRepository.save(cart);
    }


    // Hàm phụ trợ ẩn (private): Dùng để dò tìm một sản phẩm xem nó nằm ở đâu trong danh sách của giỏ
    private ChiTietDonHang findItem(DonHang cart, Integer sanPhamId) {
        if (cart.getChiTietDonHangs() == null) return null;
        for (ChiTietDonHang it : cart.getChiTietDonHangs()) {
            if (it.getSanPham() != null && it.getSanPham().getIdSanPham().equals(sanPhamId)) return it;
        }
        return null;
    }
    // Hàm phụ trợ ẩn (private): Dùng để tính toán lại tổng tiền của giỏ hàng và dọn dẹp các món rác
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
