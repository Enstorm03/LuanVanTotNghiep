package com.example.perfumeshop.dto;

import java.math.BigDecimal;

public class ChiTietDonHangDto {
    private Integer sanPhamId;
    private String tenSanPham;
    private String urlHinhAnh;
    private Integer soLuong;
    private BigDecimal giaTaiThoiDiemMua;

    public Integer getSanPhamId() { return sanPhamId; }
    public void setSanPhamId(Integer sanPhamId) { this.sanPhamId = sanPhamId; }

    public String getTenSanPham() { return tenSanPham; }
    public void setTenSanPham(String tenSanPham) { this.tenSanPham = tenSanPham; }

    public String getUrlHinhAnh() { return urlHinhAnh; }
    public void setUrlHinhAnh(String urlHinhAnh) { this.urlHinhAnh = urlHinhAnh; }

    public Integer getSoLuong() { return soLuong; }
    public void setSoLuong(Integer soLuong) { this.soLuong = soLuong; }

    public BigDecimal getGiaTaiThoiDiemMua() { return giaTaiThoiDiemMua; }
    public void setGiaTaiThoiDiemMua(BigDecimal giaTaiThoiDiemMua) { this.giaTaiThoiDiemMua = giaTaiThoiDiemMua; }
}
