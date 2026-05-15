package com.example.perfumeshop.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateNhanVienRequest {
    @NotBlank
    private String tenDangNhap;
    @NotBlank
    private String matKhau;
    @NotBlank
    private String hoTen;
    @NotBlank
    private String vaiTro;
}
