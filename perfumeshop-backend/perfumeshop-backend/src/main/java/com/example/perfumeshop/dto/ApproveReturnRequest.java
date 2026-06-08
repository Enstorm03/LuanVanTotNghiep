package com.example.perfumeshop.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ApproveReturnRequest {
    @NotNull
    private Integer nhanVienId;

    /**
     * true  = hàng còn dùng được → hoàn vào kho
     * false = hàng bị hỏng/vỡ   → không hoàn kho (ghi nhận tổn thất)
     * Mặc định true để tương thích với các call cũ không gửi field này.
     */
    private Boolean hoanKho = true;
}
