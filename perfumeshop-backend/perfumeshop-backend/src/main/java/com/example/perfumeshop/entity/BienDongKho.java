package com.example.perfumeshop.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;


@Entity
@Table(name = "bien_dong_kho")
@Data
public class BienDongKho {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "id_san_pham", nullable = false)
    private Integer idSanPham;

    @Column(name = "ten_san_pham_snapshot")
    private String tenSanPhamSnapshot;


    @Column(name = "loai", nullable = false, length = 20)
    private String loai;

    @Column(name = "so_luong", nullable = false)
    private Integer soLuong;

    @Column(name = "ton_kho_sau")
    private Integer tonKhoSau;

    @Column(name = "ly_do")
    private String lyDo;

    @Column(name = "id_don_hang")
    private Integer idDonHang;

    @Column(name = "id_phieu_nhap")
    private Integer idPhieuNhap;

    @Column(name = "id_nhan_vien")
    private Integer idNhanVien;

    @Column(name = "ngay_tao")
    private LocalDateTime ngayTao;
}
