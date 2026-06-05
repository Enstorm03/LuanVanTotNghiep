package com.example.perfumeshop.controller;

import com.example.perfumeshop.entity.DanhMuc;
import com.example.perfumeshop.exception.BusinessException;
import com.example.perfumeshop.repository.DanhMucRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/danh-muc")
@CrossOrigin(origins = "*")
public class DanhMucController {

    @Autowired
    private DanhMucRepository danhMucRepository;

    @GetMapping
    public List<DanhMuc> getAll() {
        return danhMucRepository.findAll();
    }

    @GetMapping("/{id}")
    public DanhMuc getById(@PathVariable Integer id) {
        return danhMucRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Danh mục không tồn tại"));
    }

    @PostMapping
    public DanhMuc create(@RequestBody DanhMuc danhMuc) {
        if (danhMuc.getTenDanhMuc() == null || danhMuc.getTenDanhMuc().isBlank()) {
            throw new BusinessException("Tên danh mục không được để trống");
        }
        danhMuc.setIdDanhMuc(null); // Đảm bảo là tạo mới
        return danhMucRepository.save(danhMuc);
    }

    @PutMapping("/{id}")
    public DanhMuc update(@PathVariable Integer id, @RequestBody DanhMuc danhMuc) {
        danhMucRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Danh mục không tồn tại"));
        if (danhMuc.getTenDanhMuc() == null || danhMuc.getTenDanhMuc().isBlank()) {
            throw new BusinessException("Tên danh mục không được để trống");
        }
        danhMuc.setIdDanhMuc(id);
        return danhMucRepository.save(danhMuc);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        danhMucRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Danh mục không tồn tại"));
        danhMucRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
