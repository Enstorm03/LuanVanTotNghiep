package com.example.perfumeshop.service;

import com.example.perfumeshop.entity.SanPham;
import com.example.perfumeshop.entity.SuKien;
import com.example.perfumeshop.exception.BusinessException;
import com.example.perfumeshop.repository.SanPhamRepository;
import com.example.perfumeshop.repository.SuKienRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SuKienService {

    @Autowired
    private SuKienRepository suKienRepository;

    @Autowired
    private SanPhamRepository sanPhamRepository;

    // ── Public API ─────────────────────────────────────────────────────────

    /** Trả về sự kiện đang diễn ra, hoặc null nếu không có. */
    public Optional<SuKien> getActiveCampaign() {
        return suKienRepository.findActiveCampaign();
    }

    // ── Admin CRUD ─────────────────────────────────────────────────────────

    public List<SuKien> listAll() {
        return suKienRepository.findAll();
    }

    public SuKien getById(Integer id) {
        return suKienRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Sự kiện không tồn tại"));
    }

    @Transactional
    public SuKien create(SuKien input) {
        validate(input);
        input.setIdSuKien(null); // đảm bảo tạo mới
        if (input.getTrangThaiActive() == null) input.setTrangThaiActive(true);
        return suKienRepository.save(input);
    }

    @Transactional
    public SuKien update(Integer id, SuKien input) {
        SuKien existing = getById(id);
        validate(input);
        existing.setTenSuKien(input.getTenSuKien());
        existing.setBannerUrl(input.getBannerUrl());
        existing.setNgayBatDau(input.getNgayBatDau());
        existing.setNgayKetThuc(input.getNgayKetThuc());
        existing.setTrangThaiActive(input.getTrangThaiActive() != null ? input.getTrangThaiActive() : true);
        return suKienRepository.save(existing);
    }

    @Transactional
    public void delete(Integer id) {
        getById(id); // check exist
        suKienRepository.deleteById(id);
    }

    /**
     * Gán danh sách sản phẩm vào sự kiện (replace toàn bộ).
     * @param idSuKien  id sự kiện
     * @param sanPhamIds danh sách id sản phẩm muốn gán
     */
    @Transactional
    public SuKien setProducts(Integer idSuKien, List<Integer> sanPhamIds) {
        SuKien sk = getById(idSuKien);
        List<SanPham> products = sanPhamRepository.findAllById(sanPhamIds);
        sk.setDanhSachSanPham(products);
        return suKienRepository.save(sk);
    }

    // ── Helpers ────────────────────────────────────────────────────────────

    /** Tính trạng thái hiển thị: Đang chờ / Đang chạy / Đã kết thúc / Tắt */
    public String computeStatus(SuKien sk) {
        if (!Boolean.TRUE.equals(sk.getTrangThaiActive())) return "Tắt";
        LocalDateTime now = LocalDateTime.now();
        if (sk.getNgayBatDau() != null && now.isBefore(sk.getNgayBatDau())) return "Đang chờ";
        if (sk.getNgayKetThuc() != null && now.isAfter(sk.getNgayKetThuc()))  return "Đã kết thúc";
        return "Đang chạy";
    }

    private void validate(SuKien input) {
        if (input.getTenSuKien() == null || input.getTenSuKien().isBlank()) {
            throw new BusinessException("Tên sự kiện không được để trống");
        }
        if (input.getNgayBatDau() != null && input.getNgayKetThuc() != null
                && input.getNgayKetThuc().isBefore(input.getNgayBatDau())) {
            throw new BusinessException("Ngày kết thúc phải sau ngày bắt đầu");
        }
    }
}
