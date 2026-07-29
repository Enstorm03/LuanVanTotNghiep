package com.example.perfumeshop.service;


import com.example.perfumeshop.entity.ThuongHieu;
import com.example.perfumeshop.exception.BusinessException;
import com.example.perfumeshop.repository.ThuongHieuRepository;

import java.util.List;

public class ThuongHieuService {
    private ThuongHieuRepository thuongHieuRepository;

    // Lấy tất cả
    public List<ThuongHieu> getAllThuongHieus() {
        return thuongHieuRepository.findAll();
    }
    public void themThuongHieu(ThuongHieu thuongHieu) {

        // kiem tra thuong hieu da ton tai chua
        if (thuongHieuRepository.existsByTenThuongHieu(thuongHieu.getTenThuongHieu())) {
            throw new BusinessException("Thuong hieu da ton tai");
        }
        thuongHieuRepository.save(thuongHieu);
    }
    public void suaThuongHieu(ThuongHieu thuongHieu) {
        thuongHieuRepository.save(thuongHieu);
    }
    public void xoaThuongHieu(Integer id) {
        thuongHieuRepository.deleteById(id);
    }
}
