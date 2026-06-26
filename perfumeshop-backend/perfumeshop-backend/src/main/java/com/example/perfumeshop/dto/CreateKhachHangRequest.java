package com.example.perfumeshop.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import lombok.Data;

@Data
public class CreateKhachHangRequest {
    @NotBlank
    private String tenDangNhap;
    @NotBlank
    private String matKhau;
    @NotBlank
    private String hoTen;
    @Email
    private String email;
    private String soDienThoai;
    private String diaChi;
}
