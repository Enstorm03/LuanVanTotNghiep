package com.example.perfumeshop.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "chi_tiet_phieu_nhap")
@Data
public class ChiTietPhieuNhap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_phieu", nullable = false)
    @JsonBackReference
    private PhieuNhapKho phieuNhap;

    @Column(name = "id_san_pham", nullable = false)
    private Integer idSanPham;

    @Column(name = "ten_san_pham_snapshot")
    private String tenSanPhamSnapshot;

    @Column(name = "so_luong", nullable = false)
    private Integer soLuong;

    @Column(name = "gia_nhap", precision = 15, scale = 2)
    private BigDecimal giaNhap;

    @Column(name = "ghi_chu")
    private String ghiChu;

    // ── Fields điền khi kho kiểm hàng ────────────────────────────────────

    @Column(name = "so_luong_thuc_nhan")
    private Integer soLuongThucNhan;

    @Column(name = "so_luong_loi", columnDefinition = "INT DEFAULT 0")
    private Integer soLuongLoi = 0;

    @Column(name = "url_hinh_anh_moi", length = 2048)
    private String urlHinhAnhMoi;

    @Column(name = "ghi_chu_kho", length = 1000)
    private String ghiChuKho;

    // ── FEFO & Traceability fields ──────────────────────────────────────

    @Column(name = "so_luong_con_lai", columnDefinition = "INT DEFAULT 0")
    private Integer soLuongConLai = 0;

    @Column(name = "han_su_dung")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private java.time.LocalDate hanSuDung;

    @Column(name = "so_lo", length = 100)
    private String soLo;

}
