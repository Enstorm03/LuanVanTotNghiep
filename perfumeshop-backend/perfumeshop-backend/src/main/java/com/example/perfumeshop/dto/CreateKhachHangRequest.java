package com.example.perfumeshop.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateKhachHangRequest {
    @NotBlank
    private String tenDangNhap;
    @NotBlank
    private String matKhau;
    @NotBlank
    private String hoTen;
    private String soDienThoai;
    private String diaChi;
}
