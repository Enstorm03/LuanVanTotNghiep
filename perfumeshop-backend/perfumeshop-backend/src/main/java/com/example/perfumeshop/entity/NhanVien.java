package com.example.perfumeshop.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "Nhan_Vien")
@Data
public class NhanVien {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_nhan_vien")
    private Integer idNhanVien;

    @Column(name = "ten_dang_nhap", nullable = false, unique = true)
    private String tenDangNhap;

    @Column(name = "mat_khau_bam", nullable = false)
    private String matKhauBam;

    @Column(name = "ho_ten", nullable = false)
    private String hoTen;

    @Column(name = "vai_tro", nullable = false)
    private String vaiTro;
}
