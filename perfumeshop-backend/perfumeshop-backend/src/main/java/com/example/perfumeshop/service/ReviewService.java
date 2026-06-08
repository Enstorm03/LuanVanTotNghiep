package com.example.perfumeshop.service;

import com.example.perfumeshop.dto.CreateReviewRequest;
import com.example.perfumeshop.entity.ChiTietDonHang;
import com.example.perfumeshop.entity.DanhGiaSanPham;
import com.example.perfumeshop.entity.DonHang;
import com.example.perfumeshop.entity.SanPham;
import com.example.perfumeshop.exception.BusinessException;
import com.example.perfumeshop.repository.DanhGiaSanPhamRepository;
import com.example.perfumeshop.repository.DonHangRepository;
import com.example.perfumeshop.repository.SanPhamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ReviewService {

    @Autowired
    private DonHangRepository donHangRepository;

    @Autowired
    private DanhGiaSanPhamRepository danhGiaSanPhamRepository;

    @Autowired
    private SanPhamRepository sanPhamRepository;

    /** Lấy tất cả sản phẩm dưới dạng map id → tên để fill nhanh */
    private Map<Integer, String> buildProductNameMap() {
        return sanPhamRepository.findAll().stream()
                .collect(Collectors.toMap(
                        SanPham::getIdSanPham,
                        sp -> sp.getTenSanPham() != null ? sp.getTenSanPham() : "(Sản phẩm không còn)",
                        (a, b) -> a
                ));
    }

    private void fillTenSanPham(List<DanhGiaSanPham> list) {
        if (list.isEmpty()) return;
        Map<Integer, String> nameMap = buildProductNameMap();
        list.forEach(r -> r.setTenSanPham(nameMap.getOrDefault(r.getIdSanPham(), "(Sản phẩm không còn)")));
    }

    public List<DanhGiaSanPham> getByProduct(Integer productId) {
        List<DanhGiaSanPham> list = danhGiaSanPhamRepository.findByIdSanPham(productId);
        fillTenSanPham(list);
        return list;
    }

    public List<DanhGiaSanPham> getAll() {
        List<DanhGiaSanPham> list = danhGiaSanPhamRepository.findAll();
        fillTenSanPham(list);
        return list;
    }

    public void delete(Integer id) {
        if (!danhGiaSanPhamRepository.existsById(id)) {
            throw new BusinessException("Đánh giá không tồn tại");
        }
        danhGiaSanPhamRepository.deleteById(id);
    }

    public DanhGiaSanPham create(CreateReviewRequest req) {
        // Chỉ cho đánh giá nếu user có ít nhất một đơn "Hoàn thành" chứa sản phẩm này
        List<DonHang> dones = donHangRepository.findByIdNguoiDungAndTrangThaiVanHanh(
                req.getIdNguoiDung(), DonHangService.TT_HOAN_THANH);
        boolean purchased = false;
        for (DonHang dh : dones) {
            if (dh.getChiTietDonHangs() == null) continue;
            for (ChiTietDonHang ct : dh.getChiTietDonHangs()) {
                if (ct.getSanPham() != null && ct.getSanPham().getIdSanPham().equals(req.getIdSanPham())) {
                    purchased = true;
                    break;
                }
            }
            if (purchased) break;
        }
        if (!purchased) {
            throw new BusinessException("Chỉ được đánh giá sau khi đã mua và hoàn thành đơn hàng");
        }

        // Chặn duplicate: mỗi user chỉ review 1 lần cho mỗi sản phẩm
        if (danhGiaSanPhamRepository.existsByIdNguoiDungAndIdSanPham(req.getIdNguoiDung(), req.getIdSanPham())) {
            throw new BusinessException("Bạn đã đánh giá sản phẩm này rồi");
        }

        DanhGiaSanPham dg = new DanhGiaSanPham();
        dg.setIdNguoiDung(req.getIdNguoiDung());
        dg.setIdSanPham(req.getIdSanPham());
        dg.setDiemDanhGia(req.getDiemDanhGia());
        dg.setBinhLuan(req.getBinhLuan());
        dg.setNgayTao(LocalDateTime.now());
        return danhGiaSanPhamRepository.save(dg);
    }
}