package com.example.perfumeshop.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "Danh_Gia_San_Pham")
@Data
public class DanhGiaSanPham {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_danh_gia")
    private Integer idDanhGia;

    @Column(name = "id_san_pham", nullable = false)
    private Integer idSanPham;

    @Column(name = "id_nguoi_dung", nullable = false)
    private Integer idNguoiDung;

    @Column(name = "diem_danh_gia")
    private Integer diemDanhGia;

    @Column(name = "binh_luan")
    private String binhLuan;

    @Column(name = "ngay_tao")
    private LocalDateTime ngayTao;
}
