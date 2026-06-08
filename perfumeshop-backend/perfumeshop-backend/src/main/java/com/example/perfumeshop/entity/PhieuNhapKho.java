package com.example.perfumeshop.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * Phiếu nhập kho chính thức — đã được admin duyệt.
 * Tồn kho đã được cộng vào SanPham khi phiếu này được tạo.
 */
@Entity
@Table(name = "phieu_nhap_kho")
@Data
public class PhieuNhapKho {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_phieu")
    private Integer idPhieu;

    @Column(name = "ma_phieu", unique = true)
    private String maPhieu; // PN + yyMMddHHmm + seq

    @Column(name = "id_nhan_vien")
    private Integer idNhanVien;

    @Column(name = "nha_cung_cap")
    private String nhaCungCap;

    @Column(name = "ngay_nhap")
    private LocalDateTime ngayNhap;

    @Column(name = "ghi_chu", columnDefinition = "TEXT")
    private String ghiChu;

    @OneToMany(mappedBy = "phieuNhap", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ChiTietPhieuNhap> chiTiet = new ArrayList<>();
}
