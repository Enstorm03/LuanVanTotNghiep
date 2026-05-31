package com.example.perfumeshop.service;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * Tập trung toàn bộ logic mã hóa và kiểm tra mật khẩu.
 * Dùng BCrypt với strength=12 — an toàn, có salt tự động, chống rainbow table.
 */
@Service
public class PasswordService {

    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    /**
     * Mã hóa mật khẩu thô thành BCrypt hash.
     * Mỗi lần gọi tạo ra một salt ngẫu nhiên khác nhau.
     */
    public String encode(String rawPassword) {
        return encoder.encode(rawPassword);
    }

    /**
     * Kiểm tra mật khẩu thô có khớp với hash đã lưu không.
     * Tự động xử lý salt bên trong BCrypt.
     */
    public boolean matches(String rawPassword, String encodedPassword) {
        return encoder.matches(rawPassword, encodedPassword);
    }
}
