package com.example.perfumeshop.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateCartItemRequest {
    @NotNull
    private Integer userId;
    @NotNull
    private Integer sanPhamId;
    @NotNull
    @Min(0)
    private Integer soLuong; // 0 = remove
}
