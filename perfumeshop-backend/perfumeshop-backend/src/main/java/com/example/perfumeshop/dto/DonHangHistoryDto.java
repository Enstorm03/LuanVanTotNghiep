package com.example.perfumeshop.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class DonHangHistoryDto {
    private Integer idDonHang;
    private String trangThaiVanHanh;
    private String trangThaiThanhToan;
    private BigDecimal tongTien;

    private String tenNguoiNhan;
    private String soDienThoai;
    private String diaChiGiaoHang;
    private String phuongThucThanhToan;
    private LocalDateTime ngayDatHang;
    private LocalDateTime ngayHoanThanh;
    private String maVanDon;
    private List<ChiTietDonHangDto> chiTiet;

    public Integer getIdDonHang() { return idDonHang; }
    public void setIdDonHang(Integer idDonHang) { this.idDonHang = idDonHang; }

    public String getTrangThaiVanHanh() { return trangThaiVanHanh; }
    public void setTrangThaiVanHanh(String trangThaiVanHanh) { this.trangThaiVanHanh = trangThaiVanHanh; }

    public String getTrangThaiThanhToan() { return trangThaiThanhToan; }
    public void setTrangThaiThanhToan(String trangThaiThanhToan) { this.trangThaiThanhToan = trangThaiThanhToan; }

    public BigDecimal getTongTien() { return tongTien; }
    public void setTongTien(BigDecimal tongTien) { this.tongTien = tongTien; }



    public String getTenNguoiNhan() { return tenNguoiNhan; }
    public void setTenNguoiNhan(String tenNguoiNhan) { this.tenNguoiNhan = tenNguoiNhan; }

    public String getSoDienThoai() { return soDienThoai; }
    public void setSoDienThoai(String soDienThoai) { this.soDienThoai = soDienThoai; }

    public String getDiaChiGiaoHang() { return diaChiGiaoHang; }
    public void setDiaChiGiaoHang(String diaChiGiaoHang) { this.diaChiGiaoHang = diaChiGiaoHang; }

    public String getPhuongThucThanhToan() { return phuongThucThanhToan; }
    public void setPhuongThucThanhToan(String phuongThucThanhToan) { this.phuongThucThanhToan = phuongThucThanhToan; }

    public LocalDateTime getNgayDatHang() { return ngayDatHang; }
    public void setNgayDatHang(LocalDateTime ngayDatHang) { this.ngayDatHang = ngayDatHang; }

    public LocalDateTime getNgayHoanThanh() { return ngayHoanThanh; }
    public void setNgayHoanThanh(LocalDateTime ngayHoanThanh) { this.ngayHoanThanh = ngayHoanThanh; }

    public String getMaVanDon() { return maVanDon; }
    public void setMaVanDon(String maVanDon) { this.maVanDon = maVanDon; }

    public List<ChiTietDonHangDto> getChiTiet() { return chiTiet; }
    public void setChiTiet(List<ChiTietDonHangDto> chiTiet) { this.chiTiet = chiTiet; }
}
