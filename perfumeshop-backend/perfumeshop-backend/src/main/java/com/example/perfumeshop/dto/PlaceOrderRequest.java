package com.example.perfumeshop.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class PlaceOrderRequest {

    private Integer idNguoiDung;

    @NotBlank
    private String tenNguoiNhan;

    @NotBlank
    private String soDienThoai;

    @NotBlank
    private String diaChiGiaoHang;

    @NotBlank
    private String phuongThucThanhToan; // COD, Chuyển khoản, Ví điện tử

    private String ghiChu; // Ghi chú của khách (không bắt buộc)

    @NotEmpty
    private List<PlaceOrderItemRequest> items;
    private Boolean allowBackorder;

    private Integer idSuKien; // Campaign ID
    private BigDecimal giamGiaHangLoat; // Discount amount

}
