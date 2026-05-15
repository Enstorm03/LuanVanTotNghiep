package com.example.perfumeshop.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateReviewRequest {
    @NotNull
    private Integer idNguoiDung;

    @NotNull
    private Integer idSanPham;

    @NotNull
    @Min(1)
    @Max(5)
    private Integer diemDanhGia;

    private String binhLuan;
}
