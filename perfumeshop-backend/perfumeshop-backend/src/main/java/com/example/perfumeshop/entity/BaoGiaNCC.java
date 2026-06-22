package com.example.perfumeshop.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Báo giá của Nhà Cung Cấp (NCC) cho một đợt gọi thầu.
 */
@Entity
@Table(name = "bao_gia_ncc")
@Data
public class BaoGiaNCC {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_bao_gia")
    private Integer idBaoGia;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_phieu_goi_thau", nullable = false)
    @JsonBackReference("offer-phieu")
    private PhieuGoiThau phieuGoiThau;

    @Column(name = "ten_ncc", nullable = false)
    private String tenNCC;   // Tên Nhà Cung Cấp (nhập tự do)

    @Column(name = "lien_he_ncc")
    private String lienHeNCC; // SĐT / email

    /**
     * Trạng thái:
     *   CHO_DUYET = chờ admin xem xét
     *   TRUNG_THAU = được chọn
     *   ROT_THAU  = bị từ chối
     */
    @Column(name = "trang_thai", nullable = false, length = 20)
    private String trangThai = "CHO_DUYET";

    /** Giá nhập NCC đề xuất (cho toàn lô) */
    @Column(name = "gia_nhap_de_xuat", precision = 15, scale = 2)
    private BigDecimal giaNhapDeXuat;

    /** % biên độ lợi nhuận do admin thiết lập khi chốt thầu */
    @Column(name = "phan_tram_bien_do")
    private BigDecimal phanTramBienDo;

    /** Giá bán ra = giaNhapDeXuat * (1 + phanTramBienDo / 100) */
    @Column(name = "gia_ban_chot", precision = 15, scale = 2)
    private BigDecimal giaBanChot;

    @Column(name = "ghi_chu", columnDefinition = "TEXT")
    private String ghiChu;

    @Column(name = "ngay_tao")
    private LocalDateTime ngayTao;
}
