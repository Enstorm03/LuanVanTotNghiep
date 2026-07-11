package com.example.perfumeshop.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Entity
@Table(name = "Login_Log")
@Data
public class LoginLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    /** Tên đăng nhập đã thử */
    @Column(name = "ten_dang_nhap", nullable = false, length = 100)
    private String tenDangNhap;

    /** Họ tên hiển thị (null nếu đăng nhập thất bại) */
    @Column(name = "ho_ten", length = 200)
    private String hoTen;

    /** Vai trò: ADMIN, DIRECTOR, STORE_MANAGER, WAREHOUSE_STAFF, SUPPLIER, CUSTOMER */
    @Column(name = "vai_tro", length = 50)
    private String vaiTro;

    /** SUCCESS / FAILED */
    @Column(name = "trang_thai", nullable = false, length = 20)
    private String trangThai;

    /** Lý do thất bại (nếu có) */
    @Column(name = "ly_do_that_bai", length = 255)
    private String lyDoThatBai;

    /** Địa chỉ IP của client */
    @Column(name = "ip_address", length = 50)
    private String ipAddress;

    /** User-Agent của trình duyệt */
    @Column(name = "user_agent", length = 500)
    private String userAgent;

    /** Thời gian đăng nhập */
    @Column(name = "thoi_gian", nullable = false)
    private LocalDateTime thoiGian;

    @PrePersist
    protected void onCreate() {
        if (thoiGian == null) {
            thoiGian = LocalDateTime.now();
        }
    }
}
