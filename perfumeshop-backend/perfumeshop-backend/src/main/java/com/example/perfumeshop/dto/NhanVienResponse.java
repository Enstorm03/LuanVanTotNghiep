package com.example.perfumeshop.dto;

import com.example.perfumeshop.entity.NhanVien;
import lombok.Data;

/**
 * DTO trả về thông tin nhân viên — KHÔNG chứa matKhauBam.
 */
@Data
public class NhanVienResponse {

    private Integer idNhanVien;
    private String tenDangNhap;
    private String hoTen;
    private String vaiTro;

    public static NhanVienResponse from(NhanVien entity) {
        NhanVienResponse dto = new NhanVienResponse();
        dto.setIdNhanVien(entity.getIdNhanVien());
        dto.setTenDangNhap(entity.getTenDangNhap());
        dto.setHoTen(entity.getHoTen());
        dto.setVaiTro(entity.getVaiTro());
        return dto;
    }
}
