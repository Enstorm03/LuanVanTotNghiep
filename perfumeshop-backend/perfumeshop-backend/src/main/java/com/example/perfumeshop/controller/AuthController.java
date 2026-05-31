package com.example.perfumeshop.controller;

import com.example.perfumeshop.dto.CreateKhachHangRequest;
import com.example.perfumeshop.dto.LoginRequest;
import com.example.perfumeshop.dto.NguoiDungResponse;
import com.example.perfumeshop.entity.NguoiDung;
import com.example.perfumeshop.entity.NhanVien;
import com.example.perfumeshop.exception.BusinessException;
import com.example.perfumeshop.repository.NguoiDungRepository;
import com.example.perfumeshop.repository.NhanVienRepository;
import com.example.perfumeshop.service.AdminUserService;
import com.example.perfumeshop.service.PasswordService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
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

    @Autowired
    private PasswordService passwordService;

    // Đã xóa PasswordMigrationService

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@Valid @RequestBody LoginRequest req) {
        String username = req.getTenDangNhap();
        String rawPassword = req.getMatKhau();

        // Bước 1: Thử tìm trong bảng Nhân viên (Admin/Staff)
        var nvOpt = nhanVienRepository.findByTenDangNhap(username);
        if (nvOpt.isPresent()) {
            NhanVien nv = nvOpt.get();
            // CHỈ SỬ DỤNG BCRYPT ĐỂ KIỂM TRA MẬT KHẨU
            if (passwordService.matches(rawPassword, nv.getMatKhauBam())) {
                Map<String, Object> body = new HashMap<>();
                body.put("success", true);
                body.put("type", "employee");
                body.put("userId", nv.getIdNhanVien());
                body.put("displayName", nv.getHoTen());
                body.put("role", nv.getVaiTro());
                return ResponseEntity.ok(body);
            }
        }

        // Bước 2: Thử tìm trong bảng Khách hàng
        var khOpt = nguoiDungRepository.findByTenDangNhap(username);
        if (khOpt.isPresent()) {
            NguoiDung kh = khOpt.get();
            // CHỈ SỬ DỤNG BCRYPT ĐỂ KIỂM TRA MẬT KHẨU
            if (passwordService.matches(rawPassword, kh.getMatKhauBam())) {
                Map<String, Object> body = new HashMap<>();
                body.put("success", true);
                body.put("type", "customer");
                body.put("userId", kh.getIdNguoiDung());
                body.put("displayName", kh.getHoTen());
                return ResponseEntity.ok(body);
            }
        }

        // Bước 3: Không khớp (Sai tài khoản hoặc mật khẩu)
        throw new BusinessException("Sai tài khoản hoặc mật khẩu");
    }

    @PostMapping("/register-customer")
    public ResponseEntity<NguoiDungResponse> registerCustomer(@Valid @RequestBody CreateKhachHangRequest req) {
        NguoiDungResponse created = adminUserService.createKhachHang(req);
        return ResponseEntity.ok(created);
    }
}