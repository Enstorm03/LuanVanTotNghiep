package com.example.perfumeshop.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Nguoi_Dung")
@Data
public class NguoiDung {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_nguoi_dung")
    private Integer idNguoiDung;

    @Column(name = "ten_dang_nhap", nullable = false, unique = true)
    private String tenDangNhap;

    @Column(name = "mat_khau_bam", nullable = false)
    private String matKhauBam;

    @Column(name = "ho_ten", nullable = false)
    private String hoTen;

    @Column(name = "so_dien_thoai")
    private String soDienThoai;

    @Column(name = "dia_chi")
    private String diaChi;
}
