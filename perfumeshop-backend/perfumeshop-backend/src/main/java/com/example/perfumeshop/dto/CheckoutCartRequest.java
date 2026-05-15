package com.example.perfumeshop.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CheckoutCartRequest {
    @NotNull
    private Integer userId;
    @NotEmpty
    private String tenNguoiNhan;
    @NotEmpty
    private String diaChiGiaoHang;
}
