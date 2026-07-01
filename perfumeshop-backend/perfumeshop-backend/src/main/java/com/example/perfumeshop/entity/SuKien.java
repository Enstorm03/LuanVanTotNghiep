package com.example.perfumeshop.entity;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "su_kien")
@Data
public class SuKien {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_su_kien")
    private Integer idSuKien;

    @Column(name = "ten_su_kien", nullable = false)
    private String tenSuKien;

    @Column(name = "banner_url", columnDefinition = "TEXT")
    private String bannerUrl;

    @Column(name = "ngay_bat_dau")
    private LocalDateTime ngayBatDau;

    @Column(name = "ngay_ket_thuc")
    private LocalDateTime ngayKetThuc;

    /** Công tắc bật/tắt khẩn cấp — false để ẩn sự kiện ngay lập tức */
    @Column(name = "trang_thai_active", nullable = false)
    private Boolean trangThaiActive = true;

    /** Giảm giá hàng loạt cho tất cả sản phẩm trong chiến dịch (%) */
    @Column(name = "giam_gia_hang_loat", columnDefinition = "DECIMAL(5, 2) DEFAULT 0")
    private Double giamGiaHangLoat = 0.0;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
        name = "su_kien_san_pham",
        joinColumns = @JoinColumn(name = "id_su_kien"),
        inverseJoinColumns = @JoinColumn(name = "id_san_pham")
    )
    @JsonIgnoreProperties({"danhMuc", "thuongHieu", "chiTietDonHangs"})
    private List<SanPham> danhSachSanPham = new ArrayList<>();
}
