package com.example.perfumeshop.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "Phieu_Doi_Tra")
@Data
public class PhieuDoiTra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_doi_tra")
    private Integer idDoiTra;

    @Column(name = "id_don_hang", nullable = false)
    private Integer idDonHang;

    @Column(name = "id_nguoi_dung", nullable = false)
    private Integer idNguoiDung;

    @Column(name = "id_nhan_vien")
    private Integer idNhanVien;

    @Column(name = "ly_do")
    private String lyDo;

    @Column(name = "trang_thai")
    private String trangThai; // Chờ duyệt, Đã duyệt, Từ chối

    @Column(name = "ngay_tao")
    private LocalDateTime ngayTao;
}
