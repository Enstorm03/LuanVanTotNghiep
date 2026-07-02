package com.example.perfumeshop.controller;

import com.example.perfumeshop.dto.CreateReviewRequest;
import com.example.perfumeshop.entity.DanhGiaSanPham;
import com.example.perfumeshop.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    /** Lấy đánh giá theo sản phẩm (public — hiển thị trên trang chi tiết SP) */
    @GetMapping("/product/{productId}")
    public ResponseEntity<List<DanhGiaSanPham>> getByProduct(@PathVariable Integer productId) {
        return ResponseEntity.ok(reviewService.getByProduct(productId));
    }

    /** Lấy tất cả đánh giá (admin) */
    @GetMapping("/all")
    public ResponseEntity<List<DanhGiaSanPham>> getAll() {
        return ResponseEntity.ok(reviewService.getAll());
    }

    /** Xóa đánh giá (admin) */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        reviewService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping
    public ResponseEntity<DanhGiaSanPham> create(@Valid @RequestBody CreateReviewRequest req) {
        return ResponseEntity.ok(reviewService.create(req));
    }
}