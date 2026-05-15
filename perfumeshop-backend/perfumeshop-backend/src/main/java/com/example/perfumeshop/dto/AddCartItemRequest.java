package com.example.perfumeshop.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AddCartItemRequest {
    @NotNull
    private Integer userId;
    @NotNull
    private Integer sanPhamId;
    @NotNull
    @Min(1)
    private Integer soLuong;
}
