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
import com.example.perfumeshop.service.EmailVerificationService;
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

    @Autowired
    private EmailVerificationService emailVerificationService;

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
                // Kiểm tra email đã xác thực chưa
                if (kh.getIsVerified() != null && !kh.getIsVerified()) {
                    throw new BusinessException("Vui lòng xác thực email trước khi đăng nhập. Kiểm tra hộp thư của bạn.");
                }
                
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
        
        // Gửi email xác thực
        try {
            NguoiDung user = nguoiDungRepository.findByTenDangNhap(req.getTenDangNhap()).orElse(null);
            if (user != null && user.getEmail() != null) {
                emailVerificationService.sendVerificationEmail(user.getIdNguoiDung(), user.getEmail(), user.getHoTen());
            }
        } catch (Exception e) {
            // Verification email failure should not block registration
        }
        
        return ResponseEntity.ok(created);
    }

    /**
     * Verify email với token từ link trong email
     * GET /api/auth/verify-email?token=xxx
     */
     @GetMapping("/verify-email")
     public ResponseEntity<Map<String, Object>> verifyEmail(@RequestParam String token) {
         try {
             Map<String, Object> result = emailVerificationService.verifyEmailWithDetails(token);
             
             if ("success".equals(result.get("status"))) {
                 return ResponseEntity.ok(Map.of(
                     "success", true,
                     "message", "Email đã được xác thực thành công!",
                     "email", result.get("email"),
                     "idNguoiDung", result.get("idNguoiDung")
                 ));
            } else if ("already_verified".equals(result.get("status"))) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("status", "already_verified");
                response.put("message", result.get("message") != null ? result.get("message") : "Email đã được xác thực trước đó");
                
                // Only add email if it exists
                if (result.get("email") != null) {
                    response.put("email", result.get("email"));
                }
                
                return ResponseEntity.ok(response);
             } else {
                 return ResponseEntity.badRequest().body(Map.of(
                     "success", false,
                     "message", "Token không hợp lệ hoặc đã hết hạn"
                 ));
             }
         } catch (Exception e) {
             return ResponseEntity.badRequest().body(Map.of(
                 "success", false,
                 "message", e.getMessage()
             ));
         }
     }

    /**
     * Resend verification email
     * POST /api/auth/resend-verification-email
     * Body: { "email": "user@example.com" }
     */
    @PostMapping("/resend-verification-email")
    public ResponseEntity<Map<String, Object>> resendVerificationEmail(@RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            if (email == null || email.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Email không được để trống"
                ));
            }
            
            NguoiDung user = nguoiDungRepository.findByEmail(email).orElse(null);
            if (user == null) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Email không tồn tại"
                ));
            }
            
            try {
                emailVerificationService.resendVerificationEmail(user.getIdNguoiDung(), email, user.getHoTen());
            } catch (BusinessException be) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", be.getMessage()
                ));
            }
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Email xác thực đã được gửi lại. Vui lòng kiểm tra hộp thư."
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }

    /**
     * Check verification status
     * GET /api/auth/verification-status/{userId}
     */
    @GetMapping("/verification-status/{userId}")
    public ResponseEntity<Map<String, Object>> getVerificationStatus(@PathVariable Integer userId) {
        try {
            NguoiDung user = nguoiDungRepository.findById(userId).orElse(null);
            if (user == null) {
                return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "User không tồn tại"
                ));
            }
            
            boolean isVerified = emailVerificationService.isUserVerified(userId);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "isVerified", isVerified,
                "email", user.getEmail()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", e.getMessage()
            ));
        }
    }
}
