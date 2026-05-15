package com.example.perfumeshop.entity;

import jakarta.persistence.*;
import lombok.Data;
import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.hibernate.annotations.NotFound;
import org.hibernate.annotations.NotFoundAction;
import java.math.BigDecimal;

@Entity
@Table(name = "Chi_Tiet_Don_Hang")
@Data
public class ChiTietDonHang {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_chi_tiet_don_hang")
    private Integer idChiTietDonHang;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_don_hang", nullable = false)
    @JsonBackReference
    private DonHang donHang;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_san_pham", nullable = false)
    @NotFound(action = NotFoundAction.IGNORE)
    @JsonIgnore
    private SanPham sanPham;

    @Column(name = "so_luong", nullable = false)
    private Integer soLuong;

    @Column(name = "gia_tai_thoi_diem_mua", precision = 15, scale = 2, nullable = false)
    private BigDecimal giaTaiThoiDiemMua;

    @Transient
    @JsonProperty("tenSanPham")
    public String getTenSanPhamSnapshot() {
        SanPham sp = this.sanPham;
        return sp != null ? sp.getTenSanPham() : "(Sản phẩm đã không còn)";
    }

    @Transient
    @JsonProperty("urlHinhAnh")
    public String getUrlHinhAnhSnapshot() {
        SanPham sp = this.sanPham;
        return sp != null ? sp.getUrlHinhAnh() : null;
    }

    @Transient
    @JsonProperty("sanPhamId")
    public Integer getSanPhamIdSnapshot() {
        SanPham sp = this.sanPham;
        return sp != null ? sp.getIdSanPham() : null;
    }
}
