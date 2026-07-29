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


//     Xác nhận xuất trả nhà cung cấp một số lượng hàng lỗi.
//     Trừ soLuongHangLoi đi soLuong (tối đa về 0).
    public SanPham xuatHangLoi(Integer id, int soLuong) {
        SanPham sp = sanPhamRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Sản phẩm không tồn tại"));
        if (soLuong <= 0) throw new BusinessException("Số lượng xuất phải > 0");
        int hangLoi = sp.getSoLuongHangLoi() == null ? 0 : sp.getSoLuongHangLoi();
        if (soLuong > hangLoi) throw new BusinessException("Số lượng xuất vượt quá số hàng lỗi hiện có (" + hangLoi + ")");
        sp.setSoLuongHangLoi(hangLoi - soLuong);
        return sanPhamRepository.save(sp);
    }
}