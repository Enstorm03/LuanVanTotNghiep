package com.example.perfumeshop.controller;

import com.example.perfumeshop.entity.SuKien;
import com.example.perfumeshop.service.SuKienService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
public class CampaignController {

    @Autowired
    private SuKienService suKienService;

    // ── PUBLIC ───────────────────────────────────────────────────────────────

    /**
     * Trang chủ gọi để lấy sự kiện đang chạy (banner + sản phẩm).
     * GET /api/public/campaigns/active
     * Trả về object SuKien nếu có, hoặc {} nếu không có sự kiện nào active.
     */
    @GetMapping("/api/public/campaigns/active")
    public ResponseEntity<Map<String, Object>> getActive() {
        Optional<SuKien> opt = suKienService.getActiveCampaign();
        if (opt.isEmpty()) {
            return ResponseEntity.ok(Map.of("active", false));
        }
        SuKien sk = opt.get();
        Map<String, Object> res = new HashMap<>();
        res.put("active", true);
        res.put("idSuKien", sk.getIdSuKien());
        res.put("tenSuKien", sk.getTenSuKien());
        res.put("bannerUrl", sk.getBannerUrl());
        res.put("ngayBatDau", sk.getNgayBatDau());
        res.put("ngayKetThuc", sk.getNgayKetThuc());
        res.put("giamGiaHangLoat", sk.getGiamGiaHangLoat());
        res.put("danhSachSanPham", sk.getDanhSachSanPham());
        return ResponseEntity.ok(res);
    }

    // ── ADMIN ────────────────────────────────────────────────────────────────

    /** GET /api/admin/campaigns — danh sách tất cả chiến dịch */
    @GetMapping("/api/admin/campaigns")
    public ResponseEntity<List<Map<String, Object>>> listAll() {
        List<Map<String, Object>> result = suKienService.listAll().stream().map(sk -> {
            Map<String, Object> m = new HashMap<>();
            m.put("idSuKien",       sk.getIdSuKien());
            m.put("tenSuKien",      sk.getTenSuKien());
            m.put("bannerUrl",      sk.getBannerUrl());
            m.put("ngayBatDau",     sk.getNgayBatDau());
            m.put("ngayKetThuc",    sk.getNgayKetThuc());
            m.put("giamGiaHangLoat",sk.getGiamGiaHangLoat());
            m.put("trangThaiActive",sk.getTrangThaiActive());
            m.put("trangThai",      suKienService.computeStatus(sk));
            m.put("soLuongSanPham", sk.getDanhSachSanPham() != null ? sk.getDanhSachSanPham().size() : 0);
            return m;
        }).toList();
        return ResponseEntity.ok(result);
    }

    /** GET /api/admin/campaigns/{id} — chi tiết + danh sách sản phẩm */
    @GetMapping("/api/admin/campaigns/{id}")
    public ResponseEntity<SuKien> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(suKienService.getById(id));
    }

    /** POST /api/admin/campaigns — tạo chiến dịch mới */
    @PostMapping("/api/admin/campaigns")
    public ResponseEntity<SuKien> create(@RequestBody SuKien input) {
        return ResponseEntity.ok(suKienService.create(input));
    }

    /** PUT /api/admin/campaigns/{id} — cập nhật thông tin */
    @PutMapping("/api/admin/campaigns/{id}")
    public ResponseEntity<SuKien> update(@PathVariable Integer id, @RequestBody SuKien input) {
        return ResponseEntity.ok(suKienService.update(id, input));
    }

    /** DELETE /api/admin/campaigns/{id} */
    @DeleteMapping("/api/admin/campaigns/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        suKienService.delete(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * PUT /api/admin/campaigns/{id}/products
     * Body: [1, 2, 3, ...] — danh sách id sản phẩm muốn gán (replace toàn bộ)
     */
    @PutMapping("/api/admin/campaigns/{id}/products")
    public ResponseEntity<SuKien> setProducts(@PathVariable Integer id,
                                               @RequestBody List<Integer> sanPhamIds) {
        return ResponseEntity.ok(suKienService.setProducts(id, sanPhamIds));
    }
}
