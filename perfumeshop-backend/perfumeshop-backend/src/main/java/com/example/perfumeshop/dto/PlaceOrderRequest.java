package com.example.perfumeshop.dto;

import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class PlaceOrderRequest {

    private Integer idNguoiDung;

    @NotEmpty
    private String tenNguoiNhan;

    @NotEmpty
    private String diaChiGiaoHang;

    @NotEmpty
    private List<PlaceOrderItemRequest> items;
    private Boolean allowBackorder;



}
