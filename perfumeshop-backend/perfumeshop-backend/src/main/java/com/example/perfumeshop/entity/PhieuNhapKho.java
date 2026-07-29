package com.example.perfumeshop.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

//  Phiếu nhập kho — luồng từ đấu thầu đi qua 3 bước xác nhận.
//  trangThai: CHO_KHO_KIEM_TRA → CHO_ADMIN_DUYET → DA_NHAP | BI_TU_CHOI
//  Phiếu tạo thủ công từ CSV/Excel gán thẳng DA_NHAP.

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


    @Column(name = "gia_ban_chot", precision = 15, scale = 2)
    private java.math.BigDecimal giaBanChot;


    @Column(name = "trang_thai", nullable = false, length = 30)
    private String trangThai = "DA_NHAP";

    @OneToMany(mappedBy = "phieuNhap", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<ChiTietPhieuNhap> chiTiet = new ArrayList<>();
}
