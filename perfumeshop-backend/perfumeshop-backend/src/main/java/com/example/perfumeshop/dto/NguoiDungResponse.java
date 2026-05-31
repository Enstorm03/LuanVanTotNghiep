package com.example.perfumeshop.dto;

import com.example.perfumeshop.entity.NguoiDung;
import lombok.Data;

/**
 * DTO trả về thông tin khách hàng — KHÔNG chứa matKhauBam.
 */
@Data
public class NguoiDungResponse {

    private Integer idNguoiDung;
    private String tenDangNhap;
    private String hoTen;
    private String soDienThoai;
    private String diaChi;

    public static NguoiDungResponse from(NguoiDung entity) {
        NguoiDungResponse dto = new NguoiDungResponse();
        dto.setIdNguoiDung(entity.getIdNguoiDung());
        dto.setTenDangNhap(entity.getTenDangNhap());
        dto.setHoTen(entity.getHoTen());
        dto.setSoDienThoai(entity.getSoDienThoai());
        dto.setDiaChi(entity.getDiaChi());
        return dto;
    }
}
