package com.example.perfumeshop.controller;

import com.example.perfumeshop.entity.NhaCungCap;
import com.example.perfumeshop.exception.BusinessException;
import com.example.perfumeshop.repository.NhaCungCapRepository;
import com.example.perfumeshop.service.PasswordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/nha-cung-cap")
@CrossOrigin(origins = "*")
public class NhaCungCapController {

    @Autowired private NhaCungCapRepository repo;
    @Autowired private PasswordService passwordService;

    // ── Public: Đăng nhập NCC ─────────────────────────────────────────────

    /**
     * POST /api/nha-cung-cap/login
     * Body: { tenDangNhap, matKhau }
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> body) {
        String tenDangNhap = body.get("tenDangNhap");
        String matKhau     = body.get("matKhau");

        NhaCungCap ncc = repo.findByTenDangNhap(tenDangNhap)
            .orElseThrow(() -> new BusinessException("Sai tài khoản hoặc mật khẩu"));

        if (!Boolean.TRUE.equals(ncc.getHoatDong()))
            throw new BusinessException("Tài khoản đã bị khóa");

        if (!passwordService.matches(matKhau, ncc.getMatKhauBam()))
            throw new BusinessException("Sai tài khoản hoặc mật khẩu");

        Map<String, Object> res = new HashMap<>();
        res.put("idNhaCungCap", ncc.getIdNhaCungCap());
        res.put("tenCongTy",    ncc.getTenCongTy());
        res.put("tenDangNhap",  ncc.getTenDangNhap());
        res.put("email",        ncc.getEmail());
        res.put("soDienThoai",  ncc.getSoDienThoai());
        res.put("type",         "supplier");
        return ResponseEntity.ok(res);
    }

    // ── Admin: Quản lý NCC ────────────────────────────────────────────────

    @GetMapping
    public ResponseEntity<List<NhaCungCap>> getAll() {
        return ResponseEntity.ok(repo.findAllByOrderByTenCongTyAsc());
    }

    @PostMapping
    public ResponseEntity<NhaCungCap> create(@RequestBody Map<String, Object> body) {
        String tenDangNhap = (String) body.get("tenDangNhap");
        repo.findByTenDangNhap(tenDangNhap)
            .ifPresent(x -> { throw new BusinessException("Tên đăng nhập đã tồn tại"); });

        NhaCungCap ncc = new NhaCungCap();
        ncc.setTenCongTy((String) body.get("tenCongTy"));
        ncc.setTenDangNhap(tenDangNhap);
        ncc.setMatKhauBam(passwordService.encode((String) body.get("matKhau")));
        ncc.setSoDienThoai((String) body.getOrDefault("soDienThoai", ""));
        ncc.setEmail((String) body.getOrDefault("email", ""));
        ncc.setDiaChi((String) body.getOrDefault("diaChi", ""));
        ncc.setHoatDong(true);
        ncc.setNgayTao(LocalDateTime.now());
        return ResponseEntity.ok(repo.save(ncc));
    }

    @PutMapping("/{id}")
    public ResponseEntity<NhaCungCap> update(@PathVariable Integer id,
                                              @RequestBody Map<String, Object> body) {
        NhaCungCap ncc = repo.findById(id)
            .orElseThrow(() -> new BusinessException("NCC không tồn tại"));
        if (body.get("tenCongTy")    != null) ncc.setTenCongTy((String) body.get("tenCongTy"));
        if (body.get("soDienThoai")  != null) ncc.setSoDienThoai((String) body.get("soDienThoai"));
        if (body.get("email")        != null) ncc.setEmail((String) body.get("email"));
        if (body.get("diaChi")       != null) ncc.setDiaChi((String) body.get("diaChi"));
        if (body.get("hoatDong")     != null) ncc.setHoatDong(Boolean.parseBoolean(body.get("hoatDong").toString()));
        if (body.get("matKhau") != null && !body.get("matKhau").toString().isBlank())
            ncc.setMatKhauBam(passwordService.encode((String) body.get("matKhau")));
        return ResponseEntity.ok(repo.save(ncc));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        repo.findById(id).orElseThrow(() -> new BusinessException("NCC không tồn tại"));
        repo.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
