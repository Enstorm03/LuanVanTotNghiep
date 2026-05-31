package com.example.perfumeshop.service;

import com.example.perfumeshop.entity.SanPham;
import com.example.perfumeshop.exception.BusinessException;
import com.example.perfumeshop.repository.SanPhamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SanPhamService {

    @Autowired
    private SanPhamRepository sanPhamRepository;

    // Lấy tất cả sản phẩm
    public List<SanPham> getAllSanPhams() {
        return sanPhamRepository.findAll();
    }

    // Lấy sản phẩm theo ID
    public SanPham getSanPhamById(Integer id) {
        return sanPhamRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Sản phẩm không tồn tại"));
    }

    // Thêm mới hoặc cập nhật sản phẩm
    public SanPham saveSanPham(SanPham sanPham) {

        return sanPhamRepository.save(sanPham);
    }

    // Xóa sản phẩm
    public void deleteSanPham(Integer id) {
        sanPhamRepository.deleteById(id);
    }
    public SanPham updateSanPham(Integer id, SanPham input) {
        SanPham existing = sanPhamRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Sản phẩm không tồn tại"));

        // Cập nhật toàn phần (PUT): copy các field từ input sang existing
        existing.setTenSanPham(input.getTenSanPham());
        existing.setMoTa(input.getMoTa());
        existing.setUrlHinhAnh(input.getUrlHinhAnh());
        existing.setGiaBan(input.getGiaBan());
        existing.setDungTichMl(input.getDungTichMl());
        existing.setNongDo(input.getNongDo());
        existing.setSoLuongTonKho(input.getSoLuongTonKho());
        existing.setDanhMuc(input.getDanhMuc());
        existing.setThuongHieu(input.getThuongHieu());
        existing.setPhanTramGiam(input.getPhanTramGiam());
        existing.setNgayBatDauGiam(input.getNgayBatDauGiam());
        existing.setNgayKetThucGiam(input.getNgayKetThucGiam());

        return sanPhamRepository.save(existing);
    }
}