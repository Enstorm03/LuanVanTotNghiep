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
@CrossOrigin(origins = "*")
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
}