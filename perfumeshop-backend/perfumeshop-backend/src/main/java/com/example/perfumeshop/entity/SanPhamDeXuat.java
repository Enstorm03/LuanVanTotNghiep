package com.example.perfumeshop.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Sản phẩm do Nhà Cung Cấp (NCC) đề xuất.
 * Có thể liên kết với một đợt gọi thầu (nếu đề xuất trong phiếu)
 * hoặc đứng độc lập (NCC tự đề xuất không cần phiếu).
 */
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

    /** Tên Nhà Cung Cấp đề xuất */
    @Column(name = "ten_ncc", nullable = false)
    private String tenNCC;

    /** Liên hệ NCC */
    @Column(name = "lien_he_ncc")
    private String lienHeNCC;

    /** Tên sản phẩm đề xuất */
    @Column(name = "ten_san_pham", nullable = false)
    private String tenSanPham;

    /** Mô tả sản phẩm */
    @Column(name = "mo_ta", columnDefinition = "TEXT")
    private String moTa;

    /** URL hình ảnh sản phẩm */
    @Column(name = "url_hinh_anh")
    private String urlHinhAnh;

    /** Giá đề xuất (giá nhập) */
    @Column(name = "gia_de_xuat", precision = 15, scale = 2)
    private BigDecimal giaDeXuat;

    /** Số lượng có thể cung cấp */
    @Column(name = "so_luong_co_the_cung_cap")
    private Integer soLuongCoTheCungCap;

    /** Dung tích (ml) */
    @Column(name = "dung_tich_ml")
    private Integer dungTichMl;

    /** Nồng độ tinh dầu */
    @Column(name = "nong_do")
    private Integer nongDo;

    /**
     * Trạng thái:
     *   PENDING   = chờ duyệt
     *   APPROVED  = đã duyệt (đã tạo sản phẩm mới)
     *   REJECTED  = bị từ chối
     */
    @Column(name = "trang_thai", nullable = false, length = 20)
    private String trangThai = "PENDING";

    /** ID của sản phẩm đã được tạo sau khi duyệt (nếu có) */
    @Column(name = "id_san_pham_tao_ra")
    private Integer idSanPhamTaoRa;

    /** Ghi chú thêm từ NCC */
    @Column(name = "ghi_chu", columnDefinition = "TEXT")
    private String ghiChu;

    /** Phản hồi từ admin (lý do từ chối hoặc ghi chú duyệt) */
    @Column(name = "phan_hoi_admin", columnDefinition = "TEXT")
    private String phanHoiAdmin;

    @Column(name = "ngay_tao")
    private LocalDateTime ngayTao;

    @Column(name = "ngay_xu_ly")
    private LocalDateTime ngayXuLy;

    @Column(name = "id_nhan_vien_xu_ly")
    private Integer idNhanVienXuLy;
}