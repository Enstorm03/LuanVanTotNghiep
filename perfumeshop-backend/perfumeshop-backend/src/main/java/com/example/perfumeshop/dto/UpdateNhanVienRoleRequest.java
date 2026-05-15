package com.example.perfumeshop.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateNhanVienRoleRequest {
    @NotBlank
    private String vaiTro;
}
