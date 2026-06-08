package com.example.perfumeshop.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Bảng staging — lưu dữ liệu tạm sau khi parse CSV/Excel.
 * Admin preview, sửa lỗi, rồi duyệt → xóa bảng này và cộng vào kho chính.
 */
@Entity
@Table(name = "phieu_nhap_tam")
@Data
public class PhieuNhapTam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    /** UUID nhóm các dòng của cùng 1 lần upload */
    @Column(name = "id_session", nullable = false, length = 100)
    private String idSession;

    /** Tên SP lấy từ file CSV (chưa map) */
    @Column(name = "ten_san_pham_csv")
    private String tenSanPhamCsv;

    /** null nếu chưa map được hoặc SP không tồn tại */
    @Column(name = "id_san_pham")
    private Integer idSanPham;

    @Column(name = "so_luong")
    private Integer soLuong;

    @Column(name = "gia_nhap", precision = 15, scale = 2)
    private BigDecimal giaNhap;

    @Column(name = "ghi_chu")
    private String ghiChu;

    /**
     * OK       = dòng hợp lệ, sẵn sàng duyệt
     * CHUA_MAP = chưa tìm được id_san_pham tương ứng
     * LOI      = dữ liệu thiếu / sai format
     */
    @Column(name = "trang_thai", length = 20)
    private String trangThai;

    /** Mô tả lỗi nếu trangThai = LOI */
    @Column(name = "loi")
    private String loi;

    @Column(name = "dong_so")
    private Integer dongSo; // số dòng trong file gốc (để hiển thị)

    @Column(name = "ngay_tao")
    private LocalDateTime ngayTao;
}
