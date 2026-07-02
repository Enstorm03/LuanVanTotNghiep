package com.example.perfumeshop.controller;

import com.example.perfumeshop.dto.CreateKhachHangRequest;
import com.example.perfumeshop.dto.NguoiDungResponse;
import com.example.perfumeshop.dto.ResetPasswordRequest;
import com.example.perfumeshop.dto.UpdateKhachHangRequest;
import com.example.perfumeshop.service.AdminUserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/khach-hang")
public class AdminKhachHangController {

    @Autowired
    private AdminUserService adminUserService;

    @GetMapping
    public ResponseEntity<List<NguoiDungResponse>> list() {
        return ResponseEntity.ok(adminUserService.listKhachHang());
    }

    @GetMapping("/{id}")
    public ResponseEntity<NguoiDungResponse> get(@PathVariable Integer id) {
        return ResponseEntity.ok(adminUserService.getKhachHang(id));
    }

    @PostMapping
    public ResponseEntity<NguoiDungResponse> create(@Valid @RequestBody CreateKhachHangRequest req) {
        return ResponseEntity.ok(adminUserService.createKhachHang(req));
    }

    @PutMapping("/{id}")
    public ResponseEntity<NguoiDungResponse> update(@PathVariable Integer id,
                                                     @Valid @RequestBody UpdateKhachHangRequest req) {
        return ResponseEntity.ok(adminUserService.updateKhachHang(id, req));
    }

    @PostMapping("/{id}/reset-password")
    public ResponseEntity<Void> resetPassword(@PathVariable Integer id,
                                               @Valid @RequestBody ResetPasswordRequest req) {
        adminUserService.resetKhachHangPassword(id, req);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        adminUserService.deleteKhachHang(id);
        return ResponseEntity.noContent().build();
    }
}
