package com.example.perfumeshop.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;


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


    @Column(name = "trang_thai", nullable = false, length = 20)
    private String trangThai = "CHO_DUYET";

    @Column(name = "gia_nhap_de_xuat", precision = 15, scale = 2)
    private BigDecimal giaNhapDeXuat;

    @Column(name = "phan_tram_bien_do")
    private BigDecimal phanTramBienDo;

    @Column(name = "gia_ban_chot", precision = 15, scale = 2)
    private BigDecimal giaBanChot;

    @Column(name = "ghi_chu", columnDefinition = "TEXT")
    private String ghiChu;

    @Column(name = "han_su_dung")
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate hanSuDung;

    @Column(name = "so_lo", length = 100)
    private String soLo;

    @Column(name = "ngay_tao")
    private LocalDateTime ngayTao;
}
