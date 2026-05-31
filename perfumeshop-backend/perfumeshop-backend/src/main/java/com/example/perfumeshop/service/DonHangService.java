package com.example.perfumeshop.service;

import com.example.perfumeshop.dto.ChiTietDonHangDto;
import com.example.perfumeshop.dto.DonHangHistoryDto;
import com.example.perfumeshop.dto.PagedResponse;
import com.example.perfumeshop.entity.ChiTietDonHang;
import com.example.perfumeshop.entity.DonHang;
import com.example.perfumeshop.entity.SanPham;
import com.example.perfumeshop.exception.BusinessException;
import com.example.perfumeshop.repository.DonHangRepository;
import com.example.perfumeshop.repository.SanPhamRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class DonHangService {

    public static final String TT_CHO_XAC_NHAN = "Đang chờ";
    public static final String TT_DA_XAC_NHAN = "Đã xác nhận";
    public static final String TT_DANG_GIAO = "Đang giao hàng";
    public static final String TT_HOAN_THANH = "Hoàn thành";
    public static final String TT_DA_HUY = "Đã hủy";
    public static final String TT_DA_HOAN_TRA = "Đã hoàn trả";

    @Autowired
    private DonHangRepository donHangRepository;

    @Autowired
    private SanPhamRepository sanPhamRepository;

    public List<DonHang> listByTrangThai(String trangThai) {
        if (trangThai == null || trangThai.isBlank()) return donHangRepository.findAll();
        return donHangRepository.findByTrangThaiVanHanh(trangThai);
    }

    public List<DonHang> historyByUser(Integer userId, String trangThai) {
        if (userId == null) throw new BusinessException("userId không được trống");
        if (trangThai == null || trangThai.isBlank()) {
            // mặc định: loại trừ Giỏ hàng
            return donHangRepository.findByIdNguoiDungAndTrangThaiVanHanhNot(userId, "Giỏ hàng");
        }
        return donHangRepository.findByIdNguoiDungAndTrangThaiVanHanh(userId, trangThai);
    }

    public List<DonHangHistoryDto> historyDtoByUser(Integer userId, String trangThai) {
        List<DonHang> orders = historyByUser(userId, trangThai);
        return orders.stream().map(this::toHistoryDto).collect(Collectors.toList());
    }

    public DonHangHistoryDto toHistoryDto(DonHang dh) {
        DonHangHistoryDto dto = new DonHangHistoryDto();
        dto.setIdDonHang(dh.getIdDonHang());
        dto.setTrangThaiVanHanh(dh.getTrangThaiVanHanh());
        dto.setTrangThaiThanhToan(dh.getTrangThaiThanhToan());
        dto.setTongTien(dh.getTongTien());

        dto.setTenNguoiNhan(dh.getTenNguoiNhan());
        dto.setSoDienThoai(dh.getSoDienThoai());
        dto.setDiaChiGiaoHang(dh.getDiaChiGiaoHang());
        dto.setPhuongThucThanhToan(dh.getPhuongThucThanhToan());
        dto.setNgayDatHang(dh.getNgayDatHang());
        dto.setNgayHoanThanh(dh.getNgayHoanThanh());
        dto.setMaVanDon(dh.getMaVanDon());

        List<ChiTietDonHang> items = dh.getChiTietDonHangs();
        List<ChiTietDonHangDto> itemDtos = new ArrayList<>();
        if (items != null) {
            for (ChiTietDonHang ct : items) {
                ChiTietDonHangDto it = new ChiTietDonHangDto();
                SanPham sp = ct.getSanPham(); // có thể null nếu sản phẩm bị xóa
                it.setSanPhamId(sp != null ? sp.getIdSanPham() : null);
                it.setTenSanPham(sp != null ? sp.getTenSanPham() : "(Sản phẩm đã không còn)");
                it.setUrlHinhAnh(sp != null ? sp.getUrlHinhAnh() : null);
                it.setSoLuong(ct.getSoLuong());
                it.setGiaTaiThoiDiemMua(ct.getGiaTaiThoiDiemMua());
                itemDtos.add(it);
            }
        }
        dto.setChiTiet(itemDtos);
        return dto;
    }


    public PagedResponse<DonHang> listWithPage(String trangThai, String search, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<DonHang> result = donHangRepository.searchWithPage(trangThai, search, pageable);
        PagedResponse<DonHang> resp = new PagedResponse<>();
        resp.setContent(result.getContent());
        resp.setPage(result.getNumber());
        resp.setSize(result.getSize());
        resp.setTotalElements(result.getTotalElements());
        resp.setTotalPages(result.getTotalPages());
        resp.setLast(result.isLast());
        return resp;
    }

    public DonHang getById(Integer id) {
        return donHangRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Đơn hàng không tồn tại"));
    }

    @Transactional
    public DonHang confirm(Integer id, Integer nhanVienId) {
        DonHang dh = getById(id);
        if (!(TT_CHO_XAC_NHAN.equals(dh.getTrangThaiVanHanh()) )) {
            throw new BusinessException("Chỉ xác nhận đơn ở trạng thái 'Đang chờ' hoặc 'Chờ hàng'");
        }
        dh.setIdNhanVien(nhanVienId);
        dh.setTrangThaiVanHanh(TT_DA_XAC_NHAN);
        return donHangRepository.save(dh);
    }

    @Transactional
    public DonHang shipOrder(Integer id) {
        DonHang dh = getById(id);
        if (!TT_DA_XAC_NHAN.equals(dh.getTrangThaiVanHanh())) {
            throw new BusinessException("Chỉ chuyển 'Đang giao hàng' từ trạng thái 'Đã xác nhận'");
        }
        dh.setTrangThaiVanHanh(TT_DANG_GIAO);
        return donHangRepository.save(dh);
    }

    @Transactional
    public DonHang updateTracking(Integer id, String maVanDon) {
        DonHang dh = getById(id);
        if (!TT_DANG_GIAO.equals(dh.getTrangThaiVanHanh())) {
            throw new BusinessException("Chỉ cập nhật mã vận đơn khi đơn đang ở trạng thái 'Đang giao hàng'");
        }
        dh.setMaVanDon(maVanDon);
        return donHangRepository.save(dh);
    }

    @Transactional
    public DonHang complete(Integer id) {
        DonHang dh = getById(id);
        if (!TT_DANG_GIAO.equals(dh.getTrangThaiVanHanh())) {
            throw new BusinessException("Chỉ hoàn thành đơn từ trạng thái 'Đang giao hàng'");
        }
        dh.setTrangThaiVanHanh(TT_HOAN_THANH);
        dh.setNgayHoanThanh(LocalDateTime.now());
        return donHangRepository.save(dh);
    }

    @Transactional
    public DonHang cancel(Integer id, String lyDo) {
        DonHang dh = getById(id);
        String tt = dh.getTrangThaiVanHanh();
        if (!(TT_CHO_XAC_NHAN.equals(tt) || TT_DA_XAC_NHAN.equals(tt))) {
            throw new BusinessException("Không thể hủy đơn ở trạng thái hiện tại");
        }
        // Hoàn kho theo quy tắc
        if (TT_CHO_XAC_NHAN.equals(tt) || TT_DA_XAC_NHAN.equals(tt)) {

            restoreInventory(dh);
        }
        dh.setTrangThaiVanHanh(TT_DA_HUY);
        dh.setLyDoHuy(lyDo);
        return donHangRepository.save(dh);
    }

    private void restoreInventory(DonHang dh) {
        List<ChiTietDonHang> items = dh.getChiTietDonHangs();
        if (items == null) return;
        for (ChiTietDonHang item : items) {
            SanPham sp = item.getSanPham();
            if (sp == null) continue;
            Integer soLuongTon = sp.getSoLuongTonKho() == null ? 0 : sp.getSoLuongTonKho();
            sp.setSoLuongTonKho(soLuongTon + item.getSoLuong());
            sanPhamRepository.save(sp);
        }
    }

                
}