package com.example.perfumeshop.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NearExpiryBatchDTO {
    private Integer id;
    private Integer idSanPham;
    private String tenSanPham;
    private String soLo;
    private LocalDate hanSuDung;
    private Integer soLuongConLai;
    private BigDecimal giaNhap;
    
    // Constructor from Object[]
    public NearExpiryBatchDTO(Object[] data) {
        this.id = ((Number) data[0]).intValue();
        this.idSanPham = ((Number) data[1]).intValue();
        this.tenSanPham = (String) data[2];
        this.soLo = (String) data[3];
        this.hanSuDung = (LocalDate) data[4];
        this.soLuongConLai = ((Number) data[5]).intValue();
        this.giaNhap = (BigDecimal) data[6];
    }
}