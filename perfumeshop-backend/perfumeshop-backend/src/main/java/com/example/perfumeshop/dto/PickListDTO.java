package com.example.perfumeshop.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PickListDTO {
    private Integer idSanPham;
    private String tenSanPham;
    private Integer soLuongCanLay;
    private List<BatchPickItemDTO> batchItems;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class BatchPickItemDTO {
        private Integer idBatch;
        private String soLo;
        private LocalDate hanSuDung;
        private Integer soLuongLay;
        private String ghiChu;
    }
}