package com.example.perfumeshop.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateTrackingRequest {
    @NotBlank
    private String maVanDon;
}
