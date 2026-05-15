package com.example.perfumeshop.entity;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "Don_Hang")
@Data
public class DonHang {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_don_hang")
    private Integer idDonHang;

    @Column(name = "id_nguoi_dung")
    private Integer idNguoiDung; // nullable

    @Column(name = "id_nhan_vien")
    private Integer idNhanVien; // nullable, nhân viên xử lý

    @Column(name = "trang_thai_van_hanh")
    private String trangThaiVanHanh; // Đang chờ, Hoàn thành, Đã hủy, Chờ hàng, Đã xác nhận, Đang giao hàng (mở rộng)

    @Column(name = "trang_thai_thanh_toan")
    private String trangThaiThanhToan; // Chờ cọc, Đã cọc, Đã thanh toán

    @Column(name = "tong_tien", precision = 15, scale = 2)
    private BigDecimal tongTien;

    @Column(name = "tien_dat_coc", precision = 15, scale = 2)
    private BigDecimal tienDatCoc;

    @Column(name = "ten_nguoi_nhan")
    private String tenNguoiNhan;

    @Column(name = "dia_chi_giao_hang")
    private String diaChiGiaoHang;

    @Column(name = "ten_khach_vang_lai")
    private String tenKhachVangLai;

    @Column(name = "ngay_dat_hang")
    private LocalDateTime ngayDatHang;

    @Column(name = "ma_van_don")
    private String maVanDon;

    @Column(name = "ly_do_huy")
    private String lyDoHuy;

    @Column(name = "ngay_hoan_thanh")
    private LocalDateTime ngayHoanThanh;

    @OneToMany(mappedBy = "donHang", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<ChiTietDonHang> chiTietDonHangs;
}
