package com.example.perfumeshop.entity;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonBackReference;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "San_Pham")
@Data
public class SanPham {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_san_pham")
    private Integer idSanPham;

    @Column(name = "ten_san_pham")
    private String tenSanPham;

    @Column(name = "mo_ta")
    private String moTa;

    @Column(name = "url_hinh_anh")
    private String urlHinhAnh;

    @Column(name = "gia_ban")
    private BigDecimal giaBan;

    @Column(name = "dung_tich_ml")
    private Integer dungTichMl;

    @Column(name = "nong_do")
    private Integer nongDo;

    @Column(name = "so_luong_ton_kho")
    private Integer soLuongTonKho;

    /** Phần trăm giảm giá (0–100). Null = không giảm giá. */
    @Column(name = "phan_tram_giam")
    private Integer phanTramGiam;

    /** Thời điểm bắt đầu áp dụng giảm giá. */
    @Column(name = "ngay_bat_dau_giam")
    private LocalDateTime ngayBatDauGiam;

    /** Thời điểm kết thúc giảm giá. */
    @Column(name = "ngay_ket_thuc_giam")
    private LocalDateTime ngayKetThucGiam;

    @ManyToOne
    @JoinColumn(name = "id_danh_muc")
    @JsonBackReference
    private DanhMuc danhMuc;

    @ManyToOne
    @JoinColumn(name = "id_thuong_hieu")
    private ThuongHieu thuongHieu;

    /**
     * Trả về giá hiện tại sau khi áp dụng giảm giá (nếu đang trong thời gian khuyến mãi).
     * Field này KHÔNG lưu vào DB (@Transient), được tính động mỗi lần trả về.
     */
    @Transient
    public BigDecimal getGiaHienTai() {
        if (giaBan == null) return BigDecimal.ZERO;
        if (!isAngGiamGia()) return giaBan;
        // giaBan * (100 - phanTramGiam) / 100
        BigDecimal multiplier = BigDecimal.valueOf(100 - phanTramGiam).divide(BigDecimal.valueOf(100));
        return giaBan.multiply(multiplier).setScale(0, java.math.RoundingMode.HALF_UP);
    }

    /**
     * Kiểm tra sản phẩm có đang trong thời gian giảm giá không.
     */
    @Transient
    public boolean isAngGiamGia() {
        if (phanTramGiam == null || phanTramGiam <= 0) return false;
        LocalDateTime now = LocalDateTime.now();
        if (ngayBatDauGiam != null && now.isBefore(ngayBatDauGiam)) return false;
        if (ngayKetThucGiam != null && now.isAfter(ngayKetThucGiam)) return false;
        return true;
    }
}
