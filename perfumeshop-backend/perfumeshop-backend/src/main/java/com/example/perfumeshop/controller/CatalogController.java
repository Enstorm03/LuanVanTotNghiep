package com.example.perfumeshop.controller;

import com.example.perfumeshop.dto.PagedResponse;
import com.example.perfumeshop.entity.DanhMuc;
import com.example.perfumeshop.entity.SanPham;
import com.example.perfumeshop.entity.ThuongHieu;
import com.example.perfumeshop.service.ProductCatalogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/catalog")
public class CatalogController {

    @Autowired
    private ProductCatalogService catalogService;

    @GetMapping("/san-pham/search")
    public ResponseEntity<PagedResponse<SanPham>> search(
            @RequestParam(value = "kw", required = false) String kw,
            @RequestParam(value = "danhMucId", required = false) Integer danhMucId,
            @RequestParam(value = "thuongHieuId", required = false) Integer thuongHieuId,
            @RequestParam(value = "nongDoMin", required = false) Integer nongDoMin,
            @RequestParam(value = "nongDoMax", required = false) Integer nongDoMax,
            // Giữ nongDo cũ để backward compat (FE cũ gửi nongDo=15 → dùng làm nongDoMin)
            @RequestParam(value = "nongDo", required = false) Integer nongDo,
            @RequestParam(value = "dungTich", required = false) Integer dungTich,
            @RequestParam(value = "minGia", required = false) BigDecimal minGia,
            @RequestParam(value = "maxGia", required = false) BigDecimal maxGia,
            @RequestParam(value = "sortBy", required = false, defaultValue = "idSanPham") String sortBy,
            @RequestParam(value = "sortDir", required = false, defaultValue = "asc") String sortDir,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "20") int size
    ) {
        // Ưu tiên nongDoMin/Max; fallback về nongDo (exact = min, không max)
        Integer resolvedMin = nongDoMin != null ? nongDoMin : nongDo;
        Integer resolvedMax = nongDoMax;
        return ResponseEntity.ok(catalogService.searchWithPage(
                kw, danhMucId, thuongHieuId, resolvedMin, resolvedMax,
                dungTich, minGia, maxGia, sortBy, sortDir, page, size
        ));
    }

    @GetMapping("/danh-muc")
    public ResponseEntity<List<DanhMuc>> danhMuc() {
        return ResponseEntity.ok(catalogService.listDanhMuc());
    }

    @GetMapping("/thuong-hieu")
    public ResponseEntity<List<ThuongHieu>> thuongHieu() {
        return ResponseEntity.ok(catalogService.listThuongHieu());
    }
}