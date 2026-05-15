package com.example.perfumeshop.controller;

import com.example.perfumeshop.dto.LoginRequest;
import com.example.perfumeshop.entity.NguoiDung;
import com.example.perfumeshop.entity.NhanVien;
import com.example.perfumeshop.exception.BusinessException;
import com.example.perfumeshop.repository.NguoiDungRepository;
import com.example.perfumeshop.repository.NhanVienRepository;
import com.example.perfumeshop.dto.CreateKhachHangRequest;
import com.example.perfumeshop.service.AdminUserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.HexFormat;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private NguoiDungRepository nguoiDungRepository;

    @Autowired
    private NhanVienRepository nhanVienRepository;

    @Autowired
    private AdminUserService adminUserService;

    // File: AuthController.java
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginRequest req) {
        Map<String, Object> body = new HashMap<>();
        String username = req.getTenDangNhap();
        String hashedPassword = hash(req.getMatKhau());

        // Bước 1: Thử tìm trong bảng Nhân viên (Admin/Staff)
        var nvOpt = nhanVienRepository.findByTenDangNhap(username);
        if (nvOpt.isPresent()) {
            NhanVien nv = nvOpt.get();
            if (nv.getMatKhauBam().equals(hashedPassword)) {
                body.put("success", true);
                body.put("type", "employee");
                body.put("userId", nv.getIdNhanVien());
                body.put("displayName", nv.getHoTen());
                body.put("role", nv.getVaiTro()); // Chứa ADMIN hoặc STAFF
                return ResponseEntity.ok(body);
            }
        }

        // Bước 2: Nếu không thấy trong Nhân viên, thử tìm trong bảng Người dùng (Khách hàng)
        var khOpt = nguoiDungRepository.findByTenDangNhap(username);
        if (khOpt.isPresent()) {
            NguoiDung kh = khOpt.get();
            if (kh.getMatKhauBam().equals(hashedPassword)) {
                body.put("success", true);
                body.put("type", "customer");
                body.put("userId", kh.getIdNguoiDung());
                body.put("displayName", kh.getHoTen());
                return ResponseEntity.ok(body);
            }
        }

        // Bước 3: Nếu cả hai đều không khớp
        throw new BusinessException("Sai tài khoản hoặc mật khẩu");
    }

    private String hash(String raw) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] digest = md.digest(raw.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }

    @PostMapping("/register-customer")
    public ResponseEntity<NguoiDung> registerCustomer(@Valid @RequestBody CreateKhachHangRequest req) {
        // Tái sử dụng logic tạo khách hàng từ AdminUserService (đã kiểm tra trùng username)
        NguoiDung created = adminUserService.createKhachHang(req);
        return ResponseEntity.ok(created);
    }
}
