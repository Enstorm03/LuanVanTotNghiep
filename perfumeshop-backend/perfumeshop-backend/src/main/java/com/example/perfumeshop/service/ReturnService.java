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

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ReturnService {

    private static final int RETURN_WINDOW_DAYS = 7;

    // Trạng thái phiếu đổi trả
    public static final String TT_CHO_DUYET       = "Chờ duyệt";
    public static final String TT_CHO_HOAN_TIEN   = "Chờ hoàn tiền";
    public static final String TT_HOAN_TIEN_TC    = "Hoàn tiền thành công";
    public static final String TT_TU_CHOI         = "Từ chối";

    @Autowired private PhieuDoiTraRepository phieuDoiTraRepository;
    @Autowired private DonHangRepository donHangRepository;
    @Autowired private SanPhamRepository sanPhamRepository;

    public PhieuDoiTra findByOrderAndUser(Integer orderId, Integer userId) {
        List<PhieuDoiTra> list = phieuDoiTraRepository.findByIdDonHangAndIdNguoiDung(orderId, userId);
        return list.isEmpty() ? null : list.get(0);
    }

    public List<PhieuDoiTra> listPending() {
        return phieuDoiTraRepository.findByTrangThai(TT_CHO_DUYET);
    }

    public List<PhieuDoiTra> listAll() {
        return phieuDoiTraRepository.findAll();
    }

    public PhieuDoiTra getById(Integer id) {
        return phieuDoiTraRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Phiếu đổi trả không tồn tại"));
    }

    // ── Bước 0: Khách tạo yêu cầu ──────────────────────────────────────────
    @Transactional
    public PhieuDoiTra create(Integer idDonHang, Integer idNguoiDung, String lyDo) {
        DonHang dh = donHangRepository.findById(idDonHang)
                .orElseThrow(() -> new BusinessException("Đơn hàng không tồn tại"));

        if (!DonHangService.TT_HOAN_THANH.equals(dh.getTrangThaiVanHanh())) {
            throw new BusinessException("Chỉ nhận đổi trả cho đơn hàng đã hoàn thành");
        }

        LocalDateTime ngayHoanThanh = dh.getNgayHoanThanh();
        if (ngayHoanThanh == null) {
            throw new BusinessException("Đơn hàng chưa có ngày hoàn thành");
        }
        long days = Duration.between(ngayHoanThanh, LocalDateTime.now()).toDays();
        if (days > RETURN_WINDOW_DAYS) {
            throw new BusinessException(
                "Đã quá " + RETURN_WINDOW_DAYS + " ngày kể từ ngày hoàn thành. Không thể đổi trả."
            );
        }

        List<PhieuDoiTra> existing = phieuDoiTraRepository.findByIdDonHangAndIdNguoiDung(idDonHang, idNguoiDung);
        if (!existing.isEmpty()) {
            throw new BusinessException("Đơn hàng này đã có yêu cầu đổi trả");
        }

        PhieuDoiTra p = new PhieuDoiTra();
        p.setIdDonHang(idDonHang);
        p.setIdNguoiDung(idNguoiDung);
        p.setLyDo(lyDo);
        p.setTrangThai(TT_CHO_DUYET);
        p.setNgayTao(LocalDateTime.now());
        // Lưu số tiền cần hoàn = tổng tiền đơn hàng
        p.setSoTienHoan(dh.getTongTien());
        return phieuDoiTraRepository.save(p);
    }

    // ── Bước 1: Admin duyệt → hoàn kho, chuyển sang "Chờ hoàn tiền" ────────
    @Transactional
    public PhieuDoiTra approve(Integer idDoiTra, Integer nhanVienId) {
        PhieuDoiTra p = getById(idDoiTra);
        if (!TT_CHO_DUYET.equals(p.getTrangThai())) {
            throw new BusinessException("Phiếu không ở trạng thái 'Chờ duyệt'");
        }

        DonHang dh = donHangRepository.findById(p.getIdDonHang())
                .orElseThrow(() -> new BusinessException("Đơn hàng không tồn tại"));

        // Hoàn kho ngay khi duyệt
        List<ChiTietDonHang> items = dh.getChiTietDonHangs();
        if (items != null) {
            for (ChiTietDonHang item : items) {
                SanPham sp = item.getSanPham();
                if (sp == null) continue;
                int ton = sp.getSoLuongTonKho() == null ? 0 : sp.getSoLuongTonKho();
                sp.setSoLuongTonKho(ton + item.getSoLuong());
                sanPhamRepository.save(sp);
            }
        }

        // Đơn hàng chuyển sang "Chờ hoàn tiền" (chưa phải "Đã hoàn trả")
        dh.setTrangThaiVanHanh("Chờ hoàn tiền");
        donHangRepository.save(dh);

        p.setIdNhanVien(nhanVienId);
        p.setTrangThai(TT_CHO_HOAN_TIEN);
        return phieuDoiTraRepository.save(p);
    }

    // ── Bước 2: Admin xác nhận đã hoàn tiền → hoàn tất ────────────────────
    @Transactional
    public PhieuDoiTra confirmRefund(Integer idDoiTra, Integer nhanVienId) {
        PhieuDoiTra p = getById(idDoiTra);
        if (!TT_CHO_HOAN_TIEN.equals(p.getTrangThai())) {
            throw new BusinessException("Phiếu không ở trạng thái 'Chờ hoàn tiền'");
        }

        DonHang dh = donHangRepository.findById(p.getIdDonHang())
                .orElseThrow(() -> new BusinessException("Đơn hàng không tồn tại"));

        // Đơn hàng chuyển sang "Đã hoàn trả" — hoàn tất toàn bộ quy trình
        dh.setTrangThaiVanHanh(DonHangService.TT_DA_HOAN_TRA);
        donHangRepository.save(dh);

        p.setTrangThai(TT_HOAN_TIEN_TC);
        p.setNgayHoanTien(LocalDateTime.now());
        return phieuDoiTraRepository.save(p);
    }

    // ── Từ chối (chỉ khi đang "Chờ duyệt") ────────────────────────────────
    @Transactional
    public PhieuDoiTra reject(Integer idDoiTra, Integer nhanVienId, String lyDoTuChoi) {
        PhieuDoiTra p = getById(idDoiTra);
        if (!TT_CHO_DUYET.equals(p.getTrangThai())) {
            throw new BusinessException("Phiếu không ở trạng thái 'Chờ duyệt'");
        }
        p.setIdNhanVien(nhanVienId);
        p.setTrangThai(TT_TU_CHOI);
        p.setLyDoTuChoi(lyDoTuChoi);
        return phieuDoiTraRepository.save(p);
    }
}
