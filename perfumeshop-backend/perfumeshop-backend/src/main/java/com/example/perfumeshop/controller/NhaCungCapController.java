package com.example.perfumeshop.controller;

import com.example.perfumeshop.entity.NhaCungCap;
import com.example.perfumeshop.service.NhaCungCapService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/nha-cung-cap")
public class NhaCungCapController {

    @Autowired
    private NhaCungCapService nhaCungCapService;

    // ── Public: Đăng nhập NCC ─────────────────────────────────────────────

    /**
     * POST /api/nha-cung-cap/login
     * Body: { tenDangNhap, matKhau }
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> body) {
        String tenDangNhap = body.get("tenDangNhap");
        String matKhau = body.get("matKhau");
        Map<String, Object> res = nhaCungCapService.login(tenDangNhap, matKhau);
        return ResponseEntity.ok(res);
    }

    // ── Admin: Quản lý NCC ────────────────────────────────────────────────

    @GetMapping
    public ResponseEntity<List<NhaCungCap>> getAll() {
        return ResponseEntity.ok(nhaCungCapService.getAll());
    }

    @PostMapping
    public ResponseEntity<NhaCungCap> create(@RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(nhaCungCapService.create(body));
    }

    @PutMapping("/{id}")
    public ResponseEntity<NhaCungCap> update(@PathVariable Integer id,
                                              @RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(nhaCungCapService.update(id, body));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        nhaCungCapService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
