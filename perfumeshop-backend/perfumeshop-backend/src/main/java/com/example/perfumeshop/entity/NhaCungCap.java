package com.example.perfumeshop.entity;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnore;

import java.time.LocalDateTime;

/**
 * Nhà Cung Cấp — có tài khoản đăng nhập vào cổng đấu thầu.
 */
@Entity
@Table(name = "nha_cung_cap")
@Data
public class NhaCungCap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_nha_cung_cap")
    private Integer idNhaCungCap;

    @Column(name = "ten_cong_ty", nullable = false)
    private String tenCongTy;

    @Column(name = "ten_dang_nhap", unique = true, nullable = false)
    private String tenDangNhap;

    @Column(name = "mat_khau_bam", nullable = false)
    @JsonIgnore
    private String matKhauBam;

    @Column(name = "so_dien_thoai")
    private String soDienThoai;

    @Column(name = "email")
    private String email;

    @Column(name = "dia_chi")
    private String diaChi;

    @Column(name = "hoat_dong", nullable = false)
    private Boolean hoatDong = true;

    @Column(name = "ngay_tao")
    private LocalDateTime ngayTao;
}
