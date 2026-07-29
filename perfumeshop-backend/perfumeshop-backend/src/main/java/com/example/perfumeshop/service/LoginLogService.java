package com.example.perfumeshop.service;

import com.example.perfumeshop.entity.LoginLog;
import com.example.perfumeshop.repository.LoginLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class LoginLogService {

    @Autowired
    private LoginLogRepository loginLogRepository;

    private static final DateTimeFormatter DTF = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");


//     Ghi log đăng nhập thành công.

    public void logSuccess(String tenDangNhap, String hoTen, String vaiTro,
                           String ipAddress, String userAgent) {
        LoginLog log = new LoginLog();
        log.setTenDangNhap(tenDangNhap);
        log.setHoTen(hoTen);
        log.setVaiTro(vaiTro);
        log.setTrangThai("SUCCESS");
        log.setIpAddress(ipAddress);
        log.setUserAgent(truncate(userAgent, 500));
        log.setThoiGian(LocalDateTime.now());
        loginLogRepository.save(log);
    }


//     Ghi log đăng nhập thất bại.

    public void logFailed(String tenDangNhap, String lyDo,
                          String ipAddress, String userAgent) {
        LoginLog log = new LoginLog();
        log.setTenDangNhap(tenDangNhap);
        log.setTrangThai("FAILED");
        log.setLyDoThatBai(truncate(lyDo, 255));
        log.setIpAddress(ipAddress);
        log.setUserAgent(truncate(userAgent, 500));
        log.setThoiGian(LocalDateTime.now());
        loginLogRepository.save(log);
    }


//      Phân trang + tìm kiếm log — dành cho ADMIN / DIRECTOR.

    public Page<LoginLog> search(String tenDangNhap, String vaiTro, String trangThai,
                                  String tuNgayStr, String denNgayStr,
                                  int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        LocalDateTime tuNgay = null;
        LocalDateTime denNgay = null;

        if (tuNgayStr != null && !tuNgayStr.isBlank()) {
            tuNgay = LocalDateTime.parse(tuNgayStr, DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss"))
                                  .withHour(0).withMinute(0).withSecond(0);
        }
        if (denNgayStr != null && !denNgayStr.isBlank()) {
            denNgay = LocalDateTime.parse(denNgayStr, DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss"))
                                   .withHour(23).withMinute(59).withSecond(59);
        }

        // Chuyển chuỗi rỗng thành null để JPQL bỏ qua filter
        String filterTenDN   = (tenDangNhap != null && !tenDangNhap.isBlank()) ? tenDangNhap.trim() : null;
        String filterVaiTro  = (vaiTro      != null && !vaiTro.isBlank())      ? vaiTro.trim()      : null;
        String filterTrangThai = (trangThai != null && !trangThai.isBlank())   ? trangThai.trim()   : null;

        return loginLogRepository.search(filterTenDN, filterVaiTro, filterTrangThai,
                                         tuNgay, denNgay, pageable);
    }

//     Đếm số lần thất bại trong 15 phút gần nhất
    public long countRecentFailures(String tenDangNhap) {
        return loginLogRepository.countFailedAttempts(tenDangNhap,
                LocalDateTime.now().minusMinutes(15));
    }

    private String truncate(String s, int maxLen) {
        if (s == null) return null;
        return s.length() > maxLen ? s.substring(0, maxLen) : s;
    }
}
