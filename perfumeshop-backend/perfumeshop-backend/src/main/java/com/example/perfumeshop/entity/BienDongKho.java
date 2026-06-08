package com.example.perfumeshop.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

/**
 * Lịch sử biến động tồn kho — mỗi lần kho thay đổi ghi 1 dòng.
 * Loại: NHAP, XUAT_BAN, HOAN_KHO, HUY, XUAT_LOI, DIEU_CHINH
 */
@Entity
@Table(name = "bien_dong_kho")
@Data
public class BienDongKho {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(name = "id_san_pham", nullable = false)
    private Integer idSanPham;

    @Column(name = "ten_san_pham_snapshot")
    private String tenSanPhamSnapshot;

    /**
     * NHAP       = nhập kho từ NCC
     * XUAT_BAN   = xuất bán (khi admin confirm đơn)
     * HOAN_KHO   = hoàn kho (hủy đơn / đổi trả tốt)
     * XUAT_LOI   = xuất trả NCC (hàng lỗi)
     * DIEU_CHINH = kiểm kê điều chỉnh
     */
    @Column(name = "loai", nullable = false, length = 20)
    private String loai;

    /** Dương = tăng kho, Âm = giảm kho */
    @Column(name = "so_luong", nullable = false)
    private Integer soLuong;

    /** Tồn kho sau khi biến động */
    @Column(name = "ton_kho_sau")
    private Integer tonKhoSau;

    @Column(name = "ly_do")
    private String lyDo;

    /** Liên kết đơn hàng nếu có */
    @Column(name = "id_don_hang")
    private Integer idDonHang;

    /** Liên kết phiếu nhập nếu có */
    @Column(name = "id_phieu_nhap")
    private Integer idPhieuNhap;

    @Column(name = "id_nhan_vien")
    private Integer idNhanVien;

    @Column(name = "ngay_tao")
    private LocalDateTime ngayTao;
}
