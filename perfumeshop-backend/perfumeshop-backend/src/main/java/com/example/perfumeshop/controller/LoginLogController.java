package com.example.perfumeshop.controller;

import com.example.perfumeshop.entity.LoginLog;
import com.example.perfumeshop.service.LoginLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/login-logs")
public class LoginLogController {

    @Autowired
    private LoginLogService loginLogService;

    private static final DateTimeFormatter DTF = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");

    /**
     * GET /api/admin/login-logs
     * Xem log đăng nhập — chỉ ADMIN root và DIRECTOR
     *
     * Query params:
     *   tenDangNhap (optional)
     *   vaiTro      (optional)  — ADMIN | DIRECTOR | STORE_MANAGER | ...
     *   trangThai   (optional)  — SUCCESS | FAILED
     *   tuNgay      (optional)  — yyyy-MM-ddTHH:mm:ss
     *   denNgay     (optional)  — yyyy-MM-ddTHH:mm:ss
     *   page        (default 0)
     *   size        (default 20)
     */
    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DIRECTOR')")
    public ResponseEntity<Map<String, Object>> getLogs(
            @RequestParam(required = false) String tenDangNhap,
            @RequestParam(required = false) String vaiTro,
            @RequestParam(required = false) String trangThai,
            @RequestParam(required = false) String tuNgay,
            @RequestParam(required = false) String denNgay,
            @RequestParam(defaultValue = "0")  int page,
            @RequestParam(defaultValue = "20") int size) {

        Page<LoginLog> pageResult = loginLogService.search(
                tenDangNhap, vaiTro, trangThai, tuNgay, denNgay, page, size);

        List<Map<String, Object>> items = pageResult.getContent().stream()
                .map(this::toDto)
                .toList();

        Map<String, Object> response = new HashMap<>();
        response.put("content", items);
        response.put("totalElements", pageResult.getTotalElements());
        response.put("totalPages",    pageResult.getTotalPages());
        response.put("currentPage",   pageResult.getNumber());
        response.put("pageSize",      pageResult.getSize());

        return ResponseEntity.ok(response);
    }

    private Map<String, Object> toDto(LoginLog log) {
        Map<String, Object> dto = new HashMap<>();
        dto.put("id",          log.getId());
        dto.put("tenDangNhap", log.getTenDangNhap());
        dto.put("hoTen",       log.getHoTen());
        dto.put("vaiTro",      log.getVaiTro());
        dto.put("trangThai",   log.getTrangThai());
        dto.put("lyDoThatBai", log.getLyDoThatBai());
        dto.put("ipAddress",   log.getIpAddress());
        dto.put("userAgent",   log.getUserAgent());
        dto.put("thoiGian",    log.getThoiGian() != null ? log.getThoiGian().format(DTF) : null);
        return dto;
    }
}
