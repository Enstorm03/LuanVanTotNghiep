package com.example.perfumeshop.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank(message = "Tên đăng nhập không được để trống")
    private String tenDangNhap;

    @NotBlank(message = "Mật khẩu không được để trống")
    private String matKhau;

    // Bỏ @NotBlank ở đây để Frontend không cần gửi trường này lên
    private String loai;
}
