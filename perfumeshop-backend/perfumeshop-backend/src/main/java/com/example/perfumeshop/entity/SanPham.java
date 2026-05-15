package com.example.perfumeshop.entity;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonBackReference;
import java.math.BigDecimal;

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

    @ManyToOne
    @JoinColumn(name = "id_danh_muc") // Khóa ngoại trong SQL
    @JsonBackReference
    private DanhMuc danhMuc;

    // Thương hiệu
    @ManyToOne
    @JoinColumn(name = "id_thuong_hieu")
    private ThuongHieu thuongHieu;
}