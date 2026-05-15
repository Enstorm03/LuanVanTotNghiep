package com.example.perfumeshop.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class CancelDonRequest {
    @NotBlank
    private String lyDo;
}
