package com.example.perfumeshop.controller;

import com.example.perfumeshop.dto.*;
import com.example.perfumeshop.entity.DonHang;
import com.example.perfumeshop.service.DonHangService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/don-hang")
@CrossOrigin(origins = "*")
public class DonHangController {

    @Autowired
    private DonHangService donHangService;

    @GetMapping
    public ResponseEntity<?> list(
            @RequestParam(value = "trangThai", required = false) String trangThai,
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        if (search != null || page > 0 || size != 10) {
            return ResponseEntity.ok(donHangService.listWithPage(trangThai, search, page, size));
        }
        return ResponseEntity.ok(donHangService.listByTrangThai(trangThai));
    }

    @GetMapping("/lich-su")
    public ResponseEntity<List<DonHang>> history(@RequestParam("userId") Integer userId,
                                                 @RequestParam(value = "trangThai", required = false) String trangThai) {
        return ResponseEntity.ok(donHangService.historyByUser(userId, trangThai));
    }

    @GetMapping("/lich-su-dto")
    public ResponseEntity<List<DonHangHistoryDto>> historyDto(@RequestParam("userId") Integer userId,
                                                              @RequestParam(value = "trangThai", required = false) String trangThai) {
        return ResponseEntity.ok(donHangService.historyDtoByUser(userId, trangThai));
    }

    @GetMapping("/gio-hang-dto")
    public ResponseEntity<List<DonHangHistoryDto>> cartDto(@RequestParam("userId") Integer userId) {
        return ResponseEntity.ok(donHangService.historyDtoByUser(userId, "Giỏ hàng"));
    }



    @GetMapping("/{id}")
    public ResponseEntity<DonHang> detail(@PathVariable Integer id) {
        return ResponseEntity.ok(donHangService.getById(id));
    }

    @PostMapping("/{id}/xac-nhan")
    public ResponseEntity<DonHang> confirm(@PathVariable Integer id, @Valid @RequestBody ConfirmDonRequest req) {
        return ResponseEntity.ok(donHangService.confirm(id, req.getNhanVienId()));
    }

    @PostMapping("/{id}/giao-hang")
    public ResponseEntity<DonHang> shipOrder(@PathVariable Integer id) {
        return ResponseEntity.ok(donHangService.shipOrder(id));
    }

    @PostMapping("/{id}/cap-nhat-van-don")
    public ResponseEntity<DonHang> updateTracking(@PathVariable Integer id, @Valid @RequestBody UpdateTrackingRequest req) {
        return ResponseEntity.ok(donHangService.updateTracking(id, req.getMaVanDon()));
    }

    @PostMapping("/{id}/hoan-thanh")
    public ResponseEntity<DonHang> complete(@PathVariable Integer id) {
        return ResponseEntity.ok(donHangService.complete(id));
    }

    @PostMapping("/{id}/huy")
    public ResponseEntity<DonHang> cancel(@PathVariable Integer id, @Valid @RequestBody CancelDonRequest req) {
        return ResponseEntity.ok(donHangService.cancel(id, req.getLyDo()));
    }
}