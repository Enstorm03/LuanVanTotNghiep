package com.example.perfumeshop.service;

import com.example.perfumeshop.entity.DanhMuc;
import com.example.perfumeshop.exception.BusinessException;
import com.example.perfumeshop.repository.DanhMucRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DanhMucService {

    @Autowired
    private DanhMucRepository danhMucRepository;

    /**
     * Lấy tất cả danh mục
     */
    public List<DanhMuc> getAll() {
        return danhMucRepository.findAll();
    }

    /**
     * Lấy danh mục theo ID
     */
    public DanhMuc getById(Integer id) {
        return danhMucRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Danh mục không tồn tại"));
    }

    /**
     * Tạo danh mục mới
     */
    public DanhMuc create(DanhMuc danhMuc) {
        if (danhMuc.getTenDanhMuc() == null || danhMuc.getTenDanhMuc().isBlank()) {
            throw new BusinessException("Tên danh mục không được để trống");
        }
        danhMuc.setIdDanhMuc(null); // Đảm bảo là tạo mới
        return danhMucRepository.save(danhMuc);
    }

    /**
     * Cập nhật danh mục
     */
    public DanhMuc update(Integer id, DanhMuc danhMuc) {
        danhMucRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Danh mục không tồn tại"));
        
        if (danhMuc.getTenDanhMuc() == null || danhMuc.getTenDanhMuc().isBlank()) {
            throw new BusinessException("Tên danh mục không được để trống");
        }
        
        danhMuc.setIdDanhMuc(id);
        return danhMucRepository.save(danhMuc);
    }

    /**
     * Xóa danh mục
     */
    public void delete(Integer id) {
        danhMucRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Danh mục không tồn tại"));
        danhMucRepository.deleteById(id);
    }
}