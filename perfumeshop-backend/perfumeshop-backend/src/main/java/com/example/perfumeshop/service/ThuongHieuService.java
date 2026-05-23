package com.example.perfumeshop.service;


import com.example.perfumeshop.entity.ThuongHieu;
import com.example.perfumeshop.repository.ThuongHieuRepository;

import java.util.List;

public class ThuongHieuService {
    private ThuongHieuRepository thuongHieuRepository;

    // Lấy tất cả
    public List<ThuongHieu> getAllThuongHieus() {
        return thuongHieuRepository.findAll();
    }
    public void themThuongHieu(ThuongHieu thuongHieu) {
        thuongHieuRepository.save(thuongHieu);
    }
    public void suaThuongHieu(ThuongHieu thuongHieu) {
        thuongHieuRepository.save(thuongHieu);
    }
    public void xoaThuongHieu(Integer id) {
        thuongHieuRepository.deleteById(id);
    }
}
