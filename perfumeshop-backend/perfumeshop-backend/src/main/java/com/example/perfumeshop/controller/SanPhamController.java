package com.example.perfumeshop.controller;

import com.example.perfumeshop.dto.PagedResponse;
import com.example.perfumeshop.entity.SanPham;
import com.example.perfumeshop.service.ProductCatalogService;
import com.example.perfumeshop.service.SanPhamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/san-pham")
public class SanPhamController {

    @Autowired
    private SanPhamService sanPhamService;

    @Autowired
    private ProductCatalogService catalogService;

    @GetMapping
    public List<SanPham> getAll() {
        return sanPhamService.getAllSanPhams();
    }

    @GetMapping("/{id}")
    public SanPham getDetail(@PathVariable Integer id) {
        return sanPhamService.getSanPhamById(id);
    }

    @GetMapping("/{id}/related")
    public List<SanPham> getRelated(@PathVariable Integer id,
                                    @RequestParam(value = "limit", defaultValue = "4") int limit) {
        return catalogService.getRelatedProducts(id, limit);
    }

    @PostMapping
    public SanPham create(@RequestBody SanPham sanPham) {
        return sanPhamService.saveSanPham(sanPham);
    }

    @PutMapping("/{id}")
    public SanPham update(@PathVariable Integer id, @RequestBody SanPham sanPham) {
        return sanPhamService.updateSanPham(id, sanPham);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id) {
        sanPhamService.deleteSanPham(id);
    }


//     Danh sách sản phẩm có hàng lỗi đang chờ trả nhà cung cấp.
//      GET /api/san-pham/hang-loi

    @GetMapping("/hang-loi")
    public List<SanPham> getHangLoi() {
        return sanPhamService.getAllSanPhams().stream()
                .filter(sp -> sp.getSoLuongHangLoi() != null && sp.getSoLuongHangLoi() > 0)
                .collect(java.util.stream.Collectors.toList());
    }


//      Xác nhận đã xuất trả nhà cung cấp — reset soLuongHangLoi về 0.
//      POST /api/san-pham/{id}/xuat-hang-loi
//      Body: { "soLuong": 5 }  (số lượng đã xuất, <= soLuongHangLoi)

    @PostMapping("/{id}/xuat-hang-loi")
    public SanPham xuatHangLoi(@PathVariable Integer id,
                                @RequestBody java.util.Map<String, Integer> body) {
        return sanPhamService.xuatHangLoi(id, body.getOrDefault("soLuong", 0));
    }
}