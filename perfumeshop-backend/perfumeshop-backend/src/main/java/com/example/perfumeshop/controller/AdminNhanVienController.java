package com.example.perfumeshop.controller;

import com.example.perfumeshop.dto.CreateNhanVienRequest;
import com.example.perfumeshop.dto.NhanVienResponse;
import com.example.perfumeshop.dto.ResetPasswordRequest;
import com.example.perfumeshop.dto.UpdateNhanVienRoleRequest;
import com.example.perfumeshop.service.AdminUserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/nhan-vien")
public class AdminNhanVienController {

    @Autowired
    private AdminUserService adminUserService;

    @GetMapping
    public ResponseEntity<List<NhanVienResponse>> list() {
        return ResponseEntity.ok(adminUserService.listNhanVien());
    }

    @GetMapping("/{id}")
    public ResponseEntity<NhanVienResponse> get(@PathVariable Integer id) {
        return ResponseEntity.ok(adminUserService.getNhanVien(id));
    }

    @PostMapping
    public ResponseEntity<NhanVienResponse> create(@Valid @RequestBody CreateNhanVienRequest req) {
        return ResponseEntity.ok(adminUserService.createNhanVien(req));
    }

    @PostMapping("/{id}/role")
    public ResponseEntity<NhanVienResponse> updateRole(@PathVariable Integer id,
                                                        @Valid @RequestBody UpdateNhanVienRoleRequest req) {
        return ResponseEntity.ok(adminUserService.updateNhanVienRole(id, req));
    }

    @PostMapping("/{id}/reset-password")
    public ResponseEntity<Void> resetPassword(@PathVariable Integer id,
                                               @Valid @RequestBody ResetPasswordRequest req) {
        adminUserService.resetNhanVienPassword(id, req);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        adminUserService.deleteNhanVien(id);
        return ResponseEntity.noContent().build();
    }
}
