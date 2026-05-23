package com.example.perfumeshop.dto;

import lombok.Data;
import java.util.List;

@Data
public class PagedResponse<T> {
    private List<T> content; // Dữ liệu thực tế của trang hiện tại
    private int page; // Số trang hiện tại
    private int size; // Số lượng phần tử mỗi trang
    private long totalElements; // Tổng số lượng item trong DB
    private int totalPages; // Tổng số trang có thể có
    private boolean last; // Đánh dấu xem đã là trang cuối chưa
}