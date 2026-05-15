package com.example.perfumeshop.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ApproveReturnRequest {
    @NotNull
    private Integer nhanVienId;
}
