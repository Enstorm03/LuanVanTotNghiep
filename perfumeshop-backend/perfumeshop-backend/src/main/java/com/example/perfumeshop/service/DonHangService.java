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

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(DonHangService.class);

    public static final String TT_CHO_XAC_NHAN = "Đang chờ";
    public static final String TT_DA_XAC_NHAN = "Đã xác nhận";
    public static final String TT_DANG_GIAO = "Đang giao hàng";
    public static final String TT_HOAN_THANH = "Hoàn thành";
    public static final String TT_DA_HUY = "Đã hủy";
    public static final String TT_DA_HOAN_TRA = "Đã hoàn trả";
    public static final String TT_DA_HOAN_TIEN = "Đã hoàn tiền";

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

    @Autowired
    private FEFOService fefoService;

    @Transactional
    public DonHang confirm(Integer id, Integer nhanVienId) {
        DonHang dh = getById(id);
        if (!TT_CHO_XAC_NHAN.equals(dh.getTrangThaiVanHanh())) {
            throw new BusinessException("Chỉ xác nhận đơn ở trạng thái 'Đang chờ'");
        }

        // Đơn online (PayOS): phải đã thanh toán mới được xác nhận
        boolean isOnline = "online".equalsIgnoreCase(dh.getPhuongThucThanhToan());
        if (isOnline && !"Đã thanh toán".equals(dh.getTrangThaiThanhToan())) {
            throw new BusinessException("Đơn thanh toán online chưa được xác nhận thanh toán. Vui lòng chờ khách thanh toán trước.");
        }

        // Trừ kho khi admin xác nhận — áp dụng cho cả COD và online
        List<ChiTietDonHang> items = dh.getChiTietDonHangs();
        if (items != null) {
            for (ChiTietDonHang ct : items) {
                SanPham sp = ct.getSanPham();
                if (sp == null) continue;

                // 1. Trừ soLuongTonKho bảng san_pham
                int updated = sanPhamRepository.decrementStock(sp.getIdSanPham(), ct.getSoLuong());
                if (updated == 0) {
                    throw new BusinessException(
                        "Sản phẩm '" + sp.getTenSanPham() + "' không đủ tồn kho để xác nhận đơn hàng."
                    );
                }

                // 2. Trừ soLuongConLai multi-batch FEFO — lô1 hết thì sang lô2
                try {
                    fefoService.deductFEFOOnConfirm(sp.getIdSanPham(), ct.getSoLuong());
                } catch (Exception e) {
                    // Không block xác nhận nếu batch không đủ (data cũ không có batch)
                    log.warn("FEFO deduct thất bại cho đơn #{} SP #{}: {}",
                        dh.getIdDonHang(), sp.getIdSanPham(), e.getMessage());
                }
            }
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
        // Tự động đánh dấu đã thanh toán khi hoàn thành (khách đã nhận hàng = đã trả tiền COD)
        if (!"Đã thanh toán".equals(dh.getTrangThaiThanhToan())) {
            dh.setTrangThaiThanhToan("Đã thanh toán");
        }
        return donHangRepository.save(dh);
    }

    @Transactional
    public DonHang cancel(Integer id, String lyDo) {
        DonHang dh = getById(id);
        String tt = dh.getTrangThaiVanHanh();
        if (!(TT_CHO_XAC_NHAN.equals(tt) || TT_DA_XAC_NHAN.equals(tt))) {
            throw new BusinessException("Không thể hủy đơn ở trạng thái hiện tại");
        }

        // Hoàn kho chỉ khi kho đã bị trừ:
        if (TT_DA_XAC_NHAN.equals(tt)) {
            restoreInventory(dh);
        }

        dh.setTrangThaiVanHanh(TT_DA_HUY);

        dh.setLyDoHuy(lyDo);
        return donHangRepository.save(dh);
    }

    @Transactional
    public DonHang markRefunded(Integer id) {
        DonHang dh = getById(id);
        if (!TT_DA_HUY.equals(dh.getTrangThaiVanHanh())) {
            throw new BusinessException("Chỉ có thể đánh dấu hoàn tiền cho đơn đã hủy");
        }
        if (!"Đã thanh toán".equals(dh.getTrangThaiThanhToan())) {
            throw new BusinessException("Đơn hàng chưa được thanh toán, không thể hoàn tiền");
        }
        dh.setTrangThaiThanhToan(TT_DA_HOAN_TIEN);
        return donHangRepository.save(dh);
    }

    private void restoreInventory(DonHang dh) {
        List<ChiTietDonHang> items = dh.getChiTietDonHangs();
        if (items == null) return;
        for (ChiTietDonHang item : items) {
            SanPham sp = item.getSanPham();
            if (sp == null) continue;
            // Hoàn tồn kho bảng san_pham
            Integer soLuongTon = sp.getSoLuongTonKho() == null ? 0 : sp.getSoLuongTonKho();
            sp.setSoLuongTonKho(soLuongTon + item.getSoLuong());
            sanPhamRepository.save(sp);
            // Hoàn soLuongConLai bảng chi_tiet_phieu_nhap (FEFO batch)
            if (item.getIdPhieuNhap() != null) {
                try {
                    fefoService.restoreBatchStock(item.getIdPhieuNhap(), sp.getIdSanPham(), item.getSoLuong());
                } catch (Exception e) {
                    // Không block hoàn kho chính nếu batch restore thất bại
                    log.warn("FEFO restore thất bại cho đơn #{} SP #{}: {}",
                        dh.getIdDonHang(), sp.getIdSanPham(), e.getMessage());
                }
            }
        }
    }


    public void delete(Integer id) {
        donHangRepository.deleteById(id);
    }
}