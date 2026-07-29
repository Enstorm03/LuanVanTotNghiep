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

    @Column(name = "ten_dang_nhap", nullable = false, length = 100)
    private String tenDangNhap;

    @Column(name = "ho_ten", length = 200)
    private String hoTen;

    @Column(name = "vai_tro", length = 50)
    private String vaiTro;

    @Column(name = "trang_thai", nullable = false, length = 20)
    private String trangThai;

    @Column(name = "ly_do_that_bai", length = 255)
    private String lyDoThatBai;

    @Column(name = "ip_address", length = 50)
    private String ipAddress;

    @Column(name = "user_agent", length = 500)
    private String userAgent;

    @Column(name = "thoi_gian", nullable = false)
    private LocalDateTime thoiGian;

    @PrePersist
    protected void onCreate() {
        if (thoiGian == null) {
            thoiGian = LocalDateTime.now();
        }
    }
}
