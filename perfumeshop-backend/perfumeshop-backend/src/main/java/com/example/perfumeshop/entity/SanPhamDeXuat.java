package com.example.perfumeshop.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

//  Sản phẩm do Nhà Cung Cấp (NCC) đề xuất.
//  Có thể liên kết với một đợt gọi thầu (nếu đề xuất trong phiếu)
//  hoặc đứng độc lập (NCC tự đề xuất không cần phiếu).

@Entity
@Table(name = "san_pham_de_xuat")
@Data
public class SanPhamDeXuat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_san_pham_de_xuat")
    private Integer idSanPhamDeXuat;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_phieu_goi_thau", nullable = true)
    @JsonBackReference("proposed-product-phieu")
    private PhieuGoiThau phieuGoiThau;


    @Column(name = "ten_ncc", nullable = false)
    private String tenNCC;


    @Column(name = "lien_he_ncc")
    private String lienHeNCC;


    @Column(name = "ten_san_pham", nullable = false)
    private String tenSanPham;


    @Column(name = "mo_ta", columnDefinition = "TEXT")
    private String moTa;


    @Column(name = "url_hinh_anh")
    private String urlHinhAnh;


    @Column(name = "gia_de_xuat", precision = 15, scale = 2)
    private BigDecimal giaDeXuat;


    @Column(name = "so_luong_co_the_cung_cap")
    private Integer soLuongCoTheCungCap;


    @Column(name = "dung_tich_ml")
    private Integer dungTichMl;


    @Column(name = "nong_do")
    private Integer nongDo;


    @Column(name = "trang_thai", nullable = false, length = 20)
    private String trangThai = "PENDING";


    @Column(name = "id_san_pham_tao_ra")
    private Integer idSanPhamTaoRa;


    @Column(name = "id_san_pham_khop")
    private Integer idSanPhamKhop;


    @Column(name = "ghi_chu", columnDefinition = "TEXT")
    private String ghiChu;


    @Column(name = "han_su_dung")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate hanSuDung;


    @Column(name = "so_lo", length = 100)
    private String soLo;


    @Column(name = "phan_hoi_admin", columnDefinition = "TEXT")
    private String phanHoiAdmin;

    @Column(name = "ngay_tao")
    private LocalDateTime ngayTao;

    @Column(name = "ngay_xu_ly")
    private LocalDateTime ngayXuLy;

    @Column(name = "id_nhan_vien_xu_ly")
    private Integer idNhanVienXuLy;
}