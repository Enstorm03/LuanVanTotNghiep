package com.example.perfumeshop.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;

@Entity
@Table(name = "chi_tiet_phieu_nhap")
@Data
public class ChiTietPhieuNhap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_phieu", nullable = false)
    @JsonBackReference
    private PhieuNhapKho phieuNhap;

    @Column(name = "id_san_pham", nullable = false)
    private Integer idSanPham;

    /** Snapshot tên SP tại thời điểm nhập (phòng khi SP bị xóa sau này) */
    @Column(name = "ten_san_pham_snapshot")
    private String tenSanPhamSnapshot;

    @Column(name = "so_luong", nullable = false)
    private Integer soLuong;

    @Column(name = "gia_nhap", precision = 15, scale = 2)
    private BigDecimal giaNhap;

    @Column(name = "ghi_chu")
    private String ghiChu;

    // ── Fields điền khi kho kiểm hàng ────────────────────────────────────

    /** Số lượng kho thực nhận (có thể khác soLuong đặt hàng) */
    @Column(name = "so_luong_thuc_nhan")
    private Integer soLuongThucNhan;

    /** Số lượng hàng lỗi phát hiện khi nhận */
    @Column(name = "so_luong_loi", columnDefinition = "INT DEFAULT 0")
    private Integer soLuongLoi = 0;

    /** URL ảnh thực tế kho cập nhật (dùng cho sản phẩm mới chưa có ảnh) */
    @Column(name = "url_hinh_anh_moi", length = 2048)
    private String urlHinhAnhMoi;

    /** Ghi chú riêng từ phía kho */
    @Column(name = "ghi_chu_kho", length = 1000)
    private String ghiChuKho;
}
