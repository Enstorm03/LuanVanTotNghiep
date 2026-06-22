package com.example.perfumeshop.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Phiếu Gọi Thầu — Admin tạo khi cần nhập hàng, NCC vào chào giá cạnh tranh.
 * Tên bảng DB giữ tiếng Anh để tương thích với các hệ thống bên ngoài.
 */
@Entity
@Table(name = "phieu_goi_thau")
@Data
public class PhieuGoiThau {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_phieu_goi_thau")
    private Integer idPhieuGoiThau;

    /** Mã phiếu, VD: PRQ-20260617-001 */
    @Column(name = "ma_phieu", unique = true)
    private String maPhieu;

    /** OPEN = đang nhận báo giá | CLOSED = đã chốt thầu */
    @Column(name = "trang_thai", nullable = false, length = 20)
    private String trangThai = "OPEN";

    @Column(name = "ghi_chu", columnDefinition = "TEXT")
    private String ghiChu;

    @Column(name = "han_chot")
    private LocalDate hanChot;

    @Column(name = "id_nhan_vien_tao")
    private Integer idNhanVienTao;

    @Column(name = "ngay_tao")
    private LocalDateTime ngayTao;

    @Column(name = "ngay_cap_nhat")
    private LocalDateTime ngayCapNhat;

    @OneToMany(mappedBy = "phieuGoiThau", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference("item-phieu")
    private List<ChiTietGoiThau> danhSachSanPham = new ArrayList<>();

    @OneToMany(mappedBy = "phieuGoiThau", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference("offer-phieu")
    private List<BaoGiaNCC> danhSachBaoGia = new ArrayList<>();

    @OneToMany(mappedBy = "phieuGoiThau", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference("proposed-product-phieu")
    private List<SanPhamDeXuat> danhSachSanPhamDeXuat = new ArrayList<>();
}