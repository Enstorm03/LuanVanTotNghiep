package com.example.perfumeshop.controller;

import com.example.perfumeshop.entity.ThuongHieu;
import com.example.perfumeshop.repository.ThuongHieuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/thuong-hieu")
@CrossOrigin(origins = "*")
public class ThuongHieuController {

    @Autowired
    private ThuongHieuRepository thuongHieuRepository;

    // 1. Lấy tất cả
    @GetMapping
    public List<ThuongHieu> getAllThuongHieus() {
        return thuongHieuRepository.findAll();
    }

    @GetMapping("/{id}")
    public ThuongHieu getThuongHieuById(@PathVariable Integer id) {
        return thuongHieuRepository.findById(id).orElse(null);
    }

    // 3. Thêm mới
    @PostMapping
    public ThuongHieu themThuongHieu(@RequestBody ThuongHieu thuongHieu) {
        return thuongHieuRepository.save(thuongHieu);
    }

    @PutMapping("/{id}")
    public ThuongHieu suaThuongHieu(@PathVariable Integer id, @RequestBody ThuongHieu thuongHieu) {
        thuongHieu.setIdThuongHieu(id);
        return thuongHieuRepository.save(thuongHieu);
    }

    // 5. Xóa
    @DeleteMapping("/{id}")
    public void xoaThuongHieu(@PathVariable Integer id) {
        thuongHieuRepository.deleteById(id);
    }
}