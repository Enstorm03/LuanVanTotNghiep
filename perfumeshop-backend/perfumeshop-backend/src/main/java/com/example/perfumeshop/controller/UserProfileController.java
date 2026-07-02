package com.example.perfumeshop.controller;

import com.example.perfumeshop.dto.NguoiDungResponse;
import com.example.perfumeshop.entity.NguoiDung;
import com.example.perfumeshop.repository.NguoiDungRepository;
import com.example.perfumeshop.service.AdminUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserProfileController {

    @Autowired
    private NguoiDungRepository nguoiDungRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AdminUserService adminUserService;

    /**
     * Cập nhật thông tin cá nhân của user hiện tại
     */
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody Map<String, Object> request) {
        try {
            // Lấy user ID từ session/token
            Integer userId = getUserIdFromContext();
            if (userId == null) {
                return ResponseEntity.status(401).body(Map.of(
                    "error", "Không tìm thấy user"
                ));
            }

            NguoiDung user = nguoiDungRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

            // Cập nhật các trường
            if (request.containsKey("hoTen")) {
                user.setHoTen((String) request.get("hoTen"));
            }
            if (request.containsKey("soDienThoai")) {
                user.setSoDienThoai((String) request.get("soDienThoai"));
            }
            if (request.containsKey("diaChi")) {
                user.setDiaChi((String) request.get("diaChi"));
            }

            NguoiDung updated = nguoiDungRepository.save(user);
            return ResponseEntity.ok(convertToResponse(updated));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", e.getMessage()
            ));
        }
    }

    /**
     * Thay đổi mật khẩu của user
     */
    @PostMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> request) {
        try {
            // Lấy user ID từ session/token
            Integer userId = getUserIdFromContext();
            if (userId == null) {
                return ResponseEntity.status(401).body(Map.of(
                    "error", "Không tìm thấy user"
                ));
            }

            String matKhauCu = request.get("matKhauCu");
            String matKhauMoi = request.get("matKhauMoi");

            if (matKhauCu == null || matKhauCu.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Vui lòng nhập mật khẩu hiện tại"
                ));
            }

            if (matKhauMoi == null || matKhauMoi.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Vui lòng nhập mật khẩu mới"
                ));
            }

            if (matKhauMoi.length() < 6) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Mật khẩu mới phải có ít nhất 6 ký tự"
                ));
            }

            NguoiDung user = nguoiDungRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

            // Kiểm tra mật khẩu cũ
            if (!passwordEncoder.matches(matKhauCu, user.getMatKhauBam())) {
                return ResponseEntity.badRequest().body(Map.of(
                    "error", "Mật khẩu hiện tại không chính xác"
                ));
            }

            // Cập nhật mật khẩu mới
            user.setMatKhauBam(passwordEncoder.encode(matKhauMoi));
            nguoiDungRepository.save(user);

            return ResponseEntity.ok(Map.of(
                "message", "Thay đổi mật khẩu thành công"
            ));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", e.getMessage()
            ));
        }
    }

    /**
     * Lấy thông tin cá nhân của user hiện tại
     */
    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        try {
            Integer userId = getUserIdFromContext();
            if (userId == null) {
                return ResponseEntity.status(401).body(Map.of(
                    "error", "Không tìm thấy user"
                ));
            }

            NguoiDung user = nguoiDungRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));

            return ResponseEntity.ok(convertToResponse(user));

        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", e.getMessage()
            ));
        }
    }

    @Autowired
    private HttpServletRequest request;

    /**
     * Lấy ID của user từ JWT token trong SecurityContext
     */
    private Integer getUserIdFromContext() {
        try {
            // Ưu tiên lấy từ JWT (SecurityContext)
            var authentication = org.springframework.security.core.context.SecurityContextHolder
                .getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated()
                    && !"anonymousUser".equals(authentication.getPrincipal())) {
                // Username trong JWT chính là tenDangNhap
                String username = authentication.getName();
                return nguoiDungRepository.findByTenDangNhap(username)
                    .map(NguoiDung::getIdNguoiDung)
                    .orElse(null);
            }
            // Fallback: lấy từ header X-User-Id (backward compat)
            String userIdHeader = request.getHeader("X-User-Id");
            if (userIdHeader != null && !userIdHeader.isEmpty()) {
                return Integer.parseInt(userIdHeader);
            }
            return null;
        } catch (Exception e) {
            return null;
        }
    }

    /**
     * Convert NguoiDung entity to response DTO
     */
    private Map<String, Object> convertToResponse(NguoiDung user) {
        Map<String, Object> response = new HashMap<>();
        response.put("id_nguoi_dung", user.getIdNguoiDung());
        response.put("ten_dang_nhap", user.getTenDangNhap());
        response.put("ho_ten", user.getHoTen());
        response.put("so_dien_thoai", user.getSoDienThoai());
        response.put("dia_chi", user.getDiaChi());
        response.put("email", user.getEmail());
        return response;
    }
}