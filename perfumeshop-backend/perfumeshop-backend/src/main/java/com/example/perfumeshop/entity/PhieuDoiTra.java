package com.example.perfumeshop.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "Phieu_Doi_Tra")
@Data
public class PhieuDoiTra {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_doi_tra")
    private Integer idDoiTra;

    @Column(name = "id_don_hang", nullable = false)
    private Integer idDonHang;

    @Column(name = "id_nguoi_dung", nullable = false)
    private Integer idNguoiDung;

    @Column(name = "id_nhan_vien")
    private Integer idNhanVien;

    @Column(name = "ly_do")
    private String lyDo;

    @Column(name = "ly_do_tu_choi")
    private String lyDoTuChoi;

    @Column(name = "ghi_chu_noi_bo")
    private String ghiChuNoiBo;

    @Column(name = "so_tien_hoan")
    private java.math.BigDecimal soTienHoan;

    @Column(name = "ngay_hoan_tien")
    private LocalDateTime ngayHoanTien;

    @Column(name = "trang_thai")
    // Chờ duyệt → Chờ hoàn tiền → Hoàn tiền thành công | Từ chối
    private String trangThai;

    @Column(name = "ngay_tao")
    private LocalDateTime ngayTao;
}
