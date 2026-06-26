package com.example.perfumeshop.controller;

import com.example.perfumeshop.entity.DanhMuc;
import com.example.perfumeshop.service.DanhMucService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/danh-muc")
@CrossOrigin(origins = "*")
public class DanhMucController {

    @Autowired
    private DanhMucService danhMucService;

    @GetMapping
    public List<DanhMuc> getAll() {
        return danhMucService.getAll();
    }

    @GetMapping("/{id}")
    public DanhMuc getById(@PathVariable Integer id) {
        return danhMucService.getById(id);
    }

    @PostMapping
    public DanhMuc create(@RequestBody DanhMuc danhMuc) {
        return danhMucService.create(danhMuc);
    }

    @PutMapping("/{id}")
    public DanhMuc update(@PathVariable Integer id, @RequestBody DanhMuc danhMuc) {
        return danhMucService.update(id, danhMuc);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        danhMucService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
