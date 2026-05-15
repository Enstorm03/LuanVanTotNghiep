package com.example.perfumeshop.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CreateReturnRequest {
    @NotNull
    private Integer idDonHang;
    @NotNull
    private Integer idNguoiDung;
    @NotBlank
    private String lyDo;
}
