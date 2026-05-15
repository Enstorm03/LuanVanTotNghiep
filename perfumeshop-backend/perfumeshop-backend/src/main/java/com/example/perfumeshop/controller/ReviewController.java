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
@CrossOrigin(origins = "*")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<DanhGiaSanPham>> getByProduct(@PathVariable Integer productId) {
        return ResponseEntity.ok(reviewService.getByProduct(productId));
    }

    @PostMapping
    public ResponseEntity<DanhGiaSanPham> create(@Valid @RequestBody CreateReviewRequest req) {
        return ResponseEntity.ok(reviewService.create(req));
    }
}