package com.example.perfumeshop.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank
    private String tenDangNhap;
    @NotBlank
    private String matKhau;
    // customer | employee
    @NotBlank
    private String loai;
}
