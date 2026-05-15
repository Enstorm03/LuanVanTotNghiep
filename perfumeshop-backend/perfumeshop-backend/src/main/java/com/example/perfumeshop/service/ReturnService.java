package com.example.perfumeshop.service;

import com.example.perfumeshop.entity.ChiTietDonHang;
import com.example.perfumeshop.entity.DonHang;
import com.example.perfumeshop.entity.PhieuDoiTra;
import com.example.perfumeshop.entity.SanPham;
import com.example.perfumeshop.exception.BusinessException;
import com.example.perfumeshop.repository.DonHangRepository;
import com.example.perfumeshop.repository.PhieuDoiTraRepository;
import com.example.perfumeshop.repository.SanPhamRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReturnService {

    @Autowired
    private PhieuDoiTraRepository phieuDoiTraRepository;

    @Autowired
    private DonHangRepository donHangRepository;

    @Autowired
    private SanPhamRepository sanPhamRepository;

    public PhieuDoiTra findByOrderAndUser(Integer orderId, Integer userId) {
        List<PhieuDoiTra> list = phieuDoiTraRepository.findByIdDonHangAndIdNguoiDung(orderId, userId);
        return list.isEmpty() ? null : list.get(0);
    }

    public List<PhieuDoiTra> listPending() {
        return phieuDoiTraRepository.findByTrangThai("Chờ duyệt");
    }

    public PhieuDoiTra getById(Integer id) {
        return phieuDoiTraRepository.findById(id).orElseThrow(() -> new BusinessException("Phiếu đổi trả không tồn tại"));
    }

    @Transactional
    public PhieuDoiTra create(Integer idDonHang, Integer idNguoiDung, String lyDo) {
        DonHang dh = donHangRepository.findById(idDonHang)
                .orElseThrow(() -> new BusinessException("Đơn hàng không tồn tại"));
        // Chỉ nhận đổi trả trong 7 ngày và đơn đã hoàn thành
        if (dh.getNgayDatHang() == null) {
            throw new BusinessException("Đơn hàng thiếu thời gian đặt hàng");
        }
        long days = Duration.between(dh.getNgayDatHang(), LocalDateTime.now()).toDays();
        if (days > 7) {
            throw new BusinessException("Chỉ nhận đổi trả trong 7 ngày kể từ ngày đặt hàng");
        }
        if (!DonHangService.TT_HOAN_THANH.equals(dh.getTrangThaiVanHanh())) {
            throw new BusinessException("Chỉ nhận đổi trả cho đơn đã hoàn thành");
        }
        PhieuDoiTra p = new PhieuDoiTra();
        p.setIdDonHang(idDonHang);
        p.setIdNguoiDung(idNguoiDung);
        p.setLyDo(lyDo);
        p.setTrangThai("Chờ duyệt");
        p.setNgayTao(LocalDateTime.now());
        return phieuDoiTraRepository.save(p);
    }

    @Transactional
    public PhieuDoiTra approve(Integer idDoiTra, Integer nhanVienId) {
        PhieuDoiTra p = getById(idDoiTra);
        if (!"Chờ duyệt".equals(p.getTrangThai())) {
            throw new BusinessException("Phiếu không ở trạng thái chờ duyệt");
        }
        DonHang dh = donHangRepository.findById(p.getIdDonHang())
                .orElseThrow(() -> new BusinessException("Đơn hàng không tồn tại"));
        // Hoàn kho tất cả item của đơn
        List<ChiTietDonHang> items = dh.getChiTietDonHangs();
        if (items != null) {
            for (ChiTietDonHang item : items) {
                SanPham sp = item.getSanPham();
                if (sp == null) continue;
                Integer ton = sp.getSoLuongTonKho() == null ? 0 : sp.getSoLuongTonKho();
                sp.setSoLuongTonKho(ton + item.getSoLuong());
                sanPhamRepository.save(sp);
            }
        }
        // Cập nhật trạng thái đơn hàng thành Đã hủy

        dh.setTrangThaiVanHanh(DonHangService.TT_DA_HUY);
        donHangRepository.save(dh);
        
        p.setIdNhanVien(nhanVienId);
        p.setTrangThai("Đã duyệt");
        return phieuDoiTraRepository.save(p);
    }

    @Transactional
    public PhieuDoiTra reject(Integer idDoiTra, Integer nhanVienId) {
        PhieuDoiTra p = getById(idDoiTra);
        if (!"Chờ duyệt".equals(p.getTrangThai())) {
            throw new BusinessException("Phiếu không ở trạng thái chờ duyệt");
        }
        p.setIdNhanVien(nhanVienId);
        p.setTrangThai("Từ chối");
        return phieuDoiTraRepository.save(p);
    }
    public List<PhieuDoiTra> listAll() {
        return phieuDoiTraRepository.findAll();
    }
}
