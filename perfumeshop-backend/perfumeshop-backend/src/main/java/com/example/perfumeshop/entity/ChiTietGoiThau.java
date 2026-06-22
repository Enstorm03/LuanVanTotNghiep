package com.example.perfumeshop.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;

/**
 * Chi tiết sản phẩm cần nhập trong một đợt gọi thầu.
 */
@Entity
@Table(name = "chi_tiet_goi_thau")
@Data
public class ChiTietGoiThau {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_chi_tiet")
    private Integer idChiTiet;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_phieu_goi_thau", nullable = false)
    @JsonBackReference("item-phieu")
    private PhieuGoiThau phieuGoiThau;

    @Column(name = "id_san_pham", nullable = false)
    private Integer idSanPham;

    /** Snapshot tên sản phẩm tại thời điểm tạo yêu cầu */
    @Column(name = "ten_san_pham_snapshot")
    private String tenSanPhamSnapshot;

    @Column(name = "so_luong_can_nhap", nullable = false)
    private Integer soLuongCanNhap;

    /** Tồn kho tại thời điểm tạo phiếu — để NCC tham khảo mức độ cần gấp */
    @Column(name = "ton_kho_hien_tai")
    private Integer tonKhoHienTai;

    /** Giá bán hiện tại (snapshot) — để NCC tham khảo mức giá thị trường */
    @Column(name = "gia_ban_hien_tai", precision = 15, scale = 2)
    private BigDecimal giaBanHienTai;

    @Column(name = "ghi_chu")
    private String ghiChu;
}
