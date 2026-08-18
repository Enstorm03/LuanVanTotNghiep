package com.example.perfumeshop.service;

import com.example.perfumeshop.entity.*;
import com.example.perfumeshop.exception.BusinessException;
import com.example.perfumeshop.repository.*;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.annotation.Propagation;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.apache.poi.ss.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class ProcurementService {

    // Self-proxy: bắt buộc để @Transactional(REQUIRES_NEW) có hiệu lực khi gọi nội bộ
    @Autowired @org.springframework.context.annotation.Lazy
    private ProcurementService self;

    @Autowired private PhieuGoiThauRepository phieuGoiThauRepo;
    @Autowired private BaoGiaNCCRepository baoGiaNCCRepo;
    @Autowired private SanPhamRepository sanPhamRepository;
    @Autowired private PhieuNhapKhoRepository phieuNhapKhoRepository;
    @Autowired private SanPhamDeXuatRepository sanPhamDeXuatRepo;
    @Autowired private KhoService khoService;
    @Autowired private ChiTietDonHangRepository chiTietDonHangRepo;

    // ── Giai đoạn 1: Admin tạo phiếu gọi thầu ─────────────────────────────

//     Lấy sản phẩm sắp hết kho để hiển thị trong modal tạo phiếu
    public List<Map<String, Object>> getDanhSachSapHetKho(int nguong) {
        return sanPhamRepository.findBySoLuongTonKhoLessThanOrderBySoLuongTonKhoAsc(nguong).stream()
            .map(sp -> {
                Map<String, Object> m = new HashMap<>();
                m.put("idSanPham",     sp.getIdSanPham());
                m.put("tenSanPham",    sp.getTenSanPham());
                m.put("soLuongTonKho", sp.getSoLuongTonKho());
                m.put("giaBan",        sp.getGiaBan());
                m.put("giaHienTai",    sp.getGiaHienTai());
                m.put("urlHinhAnh",    sp.getUrlHinhAnh());
                
                // Tính toán biên độ bán (Sales Velocity)
                Map<String, Object> velocity = tinhBienDoBan(sp.getIdSanPham());
                m.putAll(velocity);
                
                return m;
            })
            .toList();
    }
    
    /**
     * Tính toán biên độ bán cho một sản phẩm.
     * Trả về: ngayNhapGanNhat, soNgayBienDo, tongBanRa, tocDoBan, soLuongGoiY
     */
    private Map<String, Object> tinhBienDoBan(Integer idSanPham) {
        Map<String, Object> result = new HashMap<>();
        
        try {
            // D: Tìm ngày nhập kho gần nhất (query trực tiếp thay vì findAll + lọc)
            LocalDateTime ngayNhapGanNhat = phieuNhapKhoRepository.findNgayNhapGanNhatCuaSanPham(idSanPham);
            
            if (ngayNhapGanNhat == null) {
                // Chưa từng nhập hàng
                result.put("ngayNhapGanNhat", null);
                result.put("soNgayBienDo", 0);
                result.put("tongBanRa", 0);
                result.put("tocDoBan", 0.0);
                result.put("soLuongGoiY", null);
                return result;
            }
            
            result.put("ngayNhapGanNhat", ngayNhapGanNhat);
            
            // D: Số ngày từ lần nhập gần nhất đến nay
            long soNgayBienDo = java.time.temporal.ChronoUnit.DAYS.between(
                ngayNhapGanNhat.toLocalDate(), 
                LocalDate.now()
            );
            if (soNgayBienDo <= 0) soNgayBienDo = 1; // Tránh chia cho 0
            result.put("soNgayBienDo", soNgayBienDo);
            
            // S: Tổng số lượng đã bán từ ngày nhập đến nay (chỉ tính đơn Hoàn thành)
            Long daBan = chiTietDonHangRepo.tongSoLuongDaBanTuNgay(
                idSanPham, DonHangService.TT_HOAN_THANH, ngayNhapGanNhat);
            int tongBanRa = daBan != null ? daBan.intValue() : 0;
            result.put("tongBanRa", tongBanRa);
            
            // V: Tốc độ tiêu thụ trung bình (sản phẩm/ngày)
            double tocDoBan = (double) tongBanRa / soNgayBienDo;
            result.put("tocDoBan", Math.round(tocDoBan * 100.0) / 100.0);
            
           
            int T = 30;
            double SS = tocDoBan * 5;
            SanPham sp = sanPhamRepository.findById(idSanPham).orElse(null);
            int I = (sp != null && sp.getSoLuongTonKho() != null) ? sp.getSoLuongTonKho() : 0;
            
            int soLuongGoiY = (int) Math.ceil((tocDoBan * T) + SS - I);
            if (soLuongGoiY < 0) soLuongGoiY = 0;
            result.put("soLuongGoiY", soLuongGoiY);
            
        } catch (Exception e) {
            // Nếu có lỗi, trả về giá trị mặc định
            result.put("ngayNhapGanNhat", null);
            result.put("soNgayBienDo", 0);
            result.put("tongBanRa", 0);
            result.put("tocDoBan", 0.0);
            result.put("soLuongGoiY", null);
        }
        
        return result;
    }

    /**
     * Tạo phiếu gọi thầu mới.
     * danhSachSanPham = [{ idSanPham, soLuongCanNhap, ghiChu }]
     */
    @Transactional
    public PhieuGoiThau taoPhieuGoiThau(Integer idNhanVien, String ghiChu,
                                         LocalDate hanChot,
                                         List<Map<String, Object>> danhSachSanPham) {
        if (danhSachSanPham == null || danhSachSanPham.isEmpty())
            throw new BusinessException("Phải chọn ít nhất 1 sản phẩm");

        PhieuGoiThau phieu = new PhieuGoiThau();
        phieu.setMaPhieu(taoMaPhieu());
        phieu.setTrangThai("OPEN");
        phieu.setGhiChu(ghiChu);
        phieu.setHanChot(hanChot);
        phieu.setIdNhanVienTao(idNhanVien);
        phieu.setNgayTao(LocalDateTime.now());
        phieu.setNgayCapNhat(LocalDateTime.now());

        List<ChiTietGoiThau> chiTiet = new ArrayList<>();
        for (Map<String, Object> item : danhSachSanPham) {
            Integer idSanPham        = Integer.parseInt(item.get("idSanPham").toString());
            Integer soLuongCanNhap   = Integer.parseInt(item.get("soLuongCanNhap").toString());
            if (soLuongCanNhap <= 0) continue;

            SanPham sp = sanPhamRepository.findById(idSanPham)
                .orElseThrow(() -> new BusinessException("SP " + idSanPham + " không tồn tại"));

            ChiTietGoiThau ct = new ChiTietGoiThau();
            ct.setPhieuGoiThau(phieu);
            ct.setIdSanPham(sp.getIdSanPham());
            ct.setTenSanPhamSnapshot(sp.getTenSanPham());
            ct.setSoLuongCanNhap(soLuongCanNhap);
            ct.setTonKhoHienTai(sp.getSoLuongTonKho());
            ct.setGiaBanHienTai(sp.getGiaHienTai());
            ct.setGhiChu(item.get("ghiChu") != null ? item.get("ghiChu").toString() : null);
            chiTiet.add(ct);
        }
        phieu.setDanhSachSanPham(chiTiet);
        return phieuGoiThauRepo.save(phieu);
    }

    // ── Giai đoạn 2: NCC chào giá ──────────────────────────────────────────

    /** Lấy danh sách đợt đang OPEN (public — NCC xem) */
    public List<PhieuGoiThau> getDanhSachDangMo() {
        return phieuGoiThauRepo.findByTrangThaiOrderByNgayTaoDesc("OPEN");
    }

    /** Admin lấy toàn bộ đợt */
    public List<PhieuGoiThau> getTatCa() {
        return phieuGoiThauRepo.findAllByOrderByNgayTaoDesc();
    }

    public PhieuGoiThau getById(Integer id) {
        return phieuGoiThauRepo.findById(id)
            .orElseThrow(() -> new BusinessException("Phiếu gọi thầu không tồn tại"));
    }

    /** NCC gửi báo giá */
    @Transactional
    public BaoGiaNCC guiBaoGia(Integer idPhieu, String tenNCC, String lienHeNCC,
                                BigDecimal giaNhapDeXuat, String ghiChu,
                                String hanSuDungStr, String soLo) {
        PhieuGoiThau phieu = getById(idPhieu);
        if (!"OPEN".equals(phieu.getTrangThai()))
            throw new BusinessException("Đợt gọi thầu này đã đóng");

        BaoGiaNCC baoGia = new BaoGiaNCC();
        baoGia.setPhieuGoiThau(phieu);
        baoGia.setTenNCC(tenNCC);
        baoGia.setLienHeNCC(lienHeNCC);
        baoGia.setGiaNhapDeXuat(giaNhapDeXuat);
        baoGia.setGhiChu(ghiChu);
        if (hanSuDungStr != null && !hanSuDungStr.isBlank()) {
            try { baoGia.setHanSuDung(java.time.LocalDate.parse(hanSuDungStr.trim())); }
            catch (Exception ignored) {}
        }
        if (soLo != null && !soLo.isBlank()) baoGia.setSoLo(soLo.trim());
        baoGia.setTrangThai("CHO_DUYET");
        baoGia.setNgayTao(LocalDateTime.now());
        return baoGiaNCCRepo.save(baoGia);
    }

    /** Admin lấy tất cả báo giá của 1 đợt để so sánh */
    public List<BaoGiaNCC> getDanhSachBaoGia(Integer idPhieu) {
        return baoGiaNCCRepo.findByPhieuGoiThauIdPhieuGoiThauOrderByNgayTaoAsc(idPhieu);
    }

    // ── Giai đoạn 3: Admin chốt thầu ──────────────────────────────────────

    /**
     * Chốt thầu: chọn NCC, thiết lập % biên độ lợi nhuận.
     * Tự động:
     *  - Tính giaBanChot = giaNhap * (1 + pct/100)
     *  - Đánh dấu TRUNG_THAU cho NCC được chọn, ROT_THAU cho các NCC còn lại
     *  - Đóng phiếu → CLOSED
     *  - Sinh phiếu nhập kho với trạng thái CHO_KHO_KIEM_TRA (KHÔNG cộng kho, KHÔNG cập nhật giá)
     */
    @Transactional
    public BaoGiaNCC chotThau(Integer idPhieu, Integer idBaoGia,
                               BigDecimal phanTramBienDo, Integer idNhanVien) {
        PhieuGoiThau phieu = getById(idPhieu);
        if (!"OPEN".equals(phieu.getTrangThai()))
            throw new BusinessException("Đợt gọi thầu đã đóng");

        BaoGiaNCC baoGiaChon = baoGiaNCCRepo.findById(idBaoGia)
            .orElseThrow(() -> new BusinessException("Báo giá không tồn tại"));
        if (!baoGiaChon.getPhieuGoiThau().getIdPhieuGoiThau().equals(idPhieu))
            throw new BusinessException("Báo giá không thuộc phiếu này");

        // Tính giá bán chốt (lưu để dùng khi admin duyệt cuối)
        BigDecimal pct = phanTramBienDo != null ? phanTramBienDo : BigDecimal.ZERO;
        BigDecimal giaBanChot = baoGiaChon.getGiaNhapDeXuat()
            .multiply(BigDecimal.ONE.add(pct.divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP)))
            .setScale(0, RoundingMode.HALF_UP);

        baoGiaChon.setTrangThai("TRUNG_THAU");
        baoGiaChon.setPhanTramBienDo(pct);
        baoGiaChon.setGiaBanChot(giaBanChot);
        baoGiaNCCRepo.save(baoGiaChon);

        // Từ chối tất cả báo giá còn lại
        baoGiaNCCRepo.findByPhieuGoiThauIdPhieuGoiThauAndTrangThaiNot(idPhieu, "TRUNG_THAU")
            .forEach(bg -> { bg.setTrangThai("ROT_THAU"); baoGiaNCCRepo.save(bg); });

        // Đóng phiếu
        phieu.setTrangThai("CLOSED");
        phieu.setNgayCapNhat(LocalDateTime.now());
        phieuGoiThauRepo.save(phieu);

        // Tạo PO với trạng thái CHO_KHO_KIEM_TRA — KHÔNG cộng kho, KHÔNG cập nhật giá
        PhieuNhapKho po = new PhieuNhapKho();
        po.setMaPhieu(taoMaPO());
        po.setNhaCungCap(baoGiaChon.getTenNCC());
        po.setNgayNhap(LocalDateTime.now());
        po.setIdNhanVien(idNhanVien);
        po.setTrangThai("CHO_KHO_KIEM_TRA");
        po.setGiaBanChot(giaBanChot);
        po.setGhiChu("PO từ phiếu gọi thầu " + phieu.getMaPhieu()
            + " | NCC: " + baoGiaChon.getTenNCC()
            + " | Giá nhập: " + baoGiaChon.getGiaNhapDeXuat().toPlainString() + "₫"
            + " | Giá bán dự kiến: " + giaBanChot.toPlainString() + "₫");

        List<ChiTietPhieuNhap> chiTiet = new ArrayList<>();
        for (ChiTietGoiThau ct : phieu.getDanhSachSanPham()) {
            SanPham sp = sanPhamRepository.findById(ct.getIdSanPham()).orElse(null);
            if (sp == null) continue;

            ChiTietPhieuNhap ctNhap = new ChiTietPhieuNhap();
            ctNhap.setPhieuNhap(po);
            ctNhap.setIdSanPham(sp.getIdSanPham());
            ctNhap.setTenSanPhamSnapshot(sp.getTenSanPham());
            ctNhap.setSoLuong(ct.getSoLuongCanNhap());
            ctNhap.setGiaNhap(baoGiaChon.getGiaNhapDeXuat());
            ctNhap.setHanSuDung(baoGiaChon.getHanSuDung());
            ctNhap.setSoLo(baoGiaChon.getSoLo());
            // soLuongThucNhan để null — kho sẽ điền sau
            ctNhap.setSoLuongLoi(0);
            chiTiet.add(ctNhap);
        }
        po.setChiTiet(chiTiet);
        phieuNhapKhoRepository.save(po);

        return baoGiaChon;
    }

    // ── Sản phẩm đề xuất từ NCC ──────────────────────────────────────────

    /**
     * NCC tự đề xuất sản phẩm — KHÔNG cần phiếu gọi thầu.
     * Đây là nghiệp vụ riêng: NCC có thể chủ động gửi đề nghị bán hàng.
     */
    @Transactional
    public SanPhamDeXuat deXuatSanPhamDocLap(String tenNCC, String lienHeNCC,
                                              String tenSanPham, String moTa, String urlHinhAnh,
                                              BigDecimal giaDeXuat, Integer soLuong,
                                              Integer dungTichMl, Integer nongDo, String ghiChu,
                                              String hanSuDung, String soLo) {
        if (tenNCC == null || tenNCC.trim().isEmpty())
            throw new BusinessException("Tên nhà cung cấp không được để trống");
        if (tenSanPham == null || tenSanPham.trim().isEmpty())
            throw new BusinessException("Tên sản phẩm không được để trống");
        if (giaDeXuat == null || giaDeXuat.compareTo(BigDecimal.ZERO) <= 0)
            throw new BusinessException("Giá đề xuất phải lớn hơn 0");

        // Validate HSD không được trong quá khứ
        LocalDate hanSuDungDate = null;
        if (hanSuDung != null && !hanSuDung.isBlank()) {
            try {
                hanSuDungDate = LocalDate.parse(hanSuDung.trim());
                if (hanSuDungDate.isBefore(LocalDate.now()))
                    throw new BusinessException("Hạn sử dụng không được là ngày trong quá khứ");
            } catch (BusinessException e) {
                throw e;
            } catch (Exception ignored) {}
        }

        SanPhamDeXuat dx = new SanPhamDeXuat();
        dx.setPhieuGoiThau(null);
        dx.setTenNCC(tenNCC.trim());
        dx.setLienHeNCC(lienHeNCC);
        dx.setTenSanPham(tenSanPham.trim());
        dx.setMoTa(moTa);
        dx.setUrlHinhAnh(urlHinhAnh);
        dx.setGiaDeXuat(giaDeXuat);
        dx.setSoLuongCoTheCungCap(soLuong);
        dx.setDungTichMl(dungTichMl);
        dx.setNongDo(nongDo);
        dx.setGhiChu(ghiChu);
        dx.setHanSuDung(hanSuDungDate);
        dx.setSoLo(soLo != null && !soLo.isBlank() ? soLo.trim() : null);
        dx.setTrangThai("PENDING");
        dx.setNgayTao(LocalDateTime.now());

        if (tenSanPham != null && !tenSanPham.trim().isEmpty()) {
            List<SanPham> results = sanPhamRepository.findByTenSanPhamIgnoreCase(tenSanPham.trim());
            if (!results.isEmpty()) dx.setIdSanPhamKhop(results.get(0).getIdSanPham());
        }

        return sanPhamDeXuatRepo.save(dx);
    }

    /** Admin xem danh sách sản phẩm đề xuất của một phiếu */
    public List<SanPhamDeXuat> getDanhSachSanPhamDeXuat(Integer idPhieu) {
        return sanPhamDeXuatRepo.findByPhieuGoiThau_IdPhieuGoiThau(idPhieu);
    }

    /** Admin xem tất cả SP đề xuất đang chờ duyệt */
    public List<SanPhamDeXuat> getTatCaSanPhamDeXuatChoDuyet() {
        return sanPhamDeXuatRepo.findByTrangThai("PENDING");
    }

    /** Admin xem tất cả đề xuất độc lập */
    public List<SanPhamDeXuat> getTatCaDeXuatDocLap() {
        List<SanPhamDeXuat> proposals = sanPhamDeXuatRepo.findByPhieuGoiThauIsNullOrderByNgayTaoDesc();
        autoCheckAndUpdateProductMatch(proposals);
        return proposals;
    }

    /** Admin xem đề xuất độc lập theo trạng thái */
    public List<SanPhamDeXuat> getDeXuatDocLapTheoTrangThai(String trangThai) {
        List<SanPhamDeXuat> proposals = sanPhamDeXuatRepo.findByPhieuGoiThauIsNullAndTrangThaiOrderByNgayTaoDesc(trangThai);
        autoCheckAndUpdateProductMatch(proposals);
        return proposals;
    }

    /**
     * Tự động kiểm tra và cập nhật idSanPhamKhop cho tất cả đề xuất.
     * Nếu chưa có idSanPhamKhop nhưng tìm thấy SP trùng tên → set ngay.
     */
    private void autoCheckAndUpdateProductMatch(List<SanPhamDeXuat> proposals) {
        if (proposals == null || proposals.isEmpty()) return;
        
        for (SanPhamDeXuat dx : proposals) {
            if (dx.getIdSanPhamKhop() != null) continue;
            if (dx.getTenSanPham() == null || dx.getTenSanPham().trim().isEmpty()) continue;
            
            String cleanName = dx.getTenSanPham().trim();
            List<SanPham> results = sanPhamRepository.findByTenSanPhamIgnoreCase(cleanName);
            
            if (!results.isEmpty()) {
                SanPham matched = results.get(0);
                dx.setIdSanPhamKhop(matched.getIdSanPham());
                sanPhamDeXuatRepo.save(dx);
            }
        }
    }

    /** Admin duyệt đề xuất → tạo sản phẩm mới + tạo PO CHO_KHO_KIEM_TRA */
    @Transactional
    public SanPham duyetSanPhamDeXuat(Integer idSanPhamDeXuat, Integer idDanhMuc,
                                       Integer idThuongHieu, Integer idNhanVien,
                                       String phanHoi, BigDecimal phanTramBienDo,
                                       Integer soLuongNhap) {
        SanPhamDeXuat dx = sanPhamDeXuatRepo.findById(idSanPhamDeXuat)
            .orElseThrow(() -> new BusinessException("Đề xuất không tồn tại"));
        if (!"PENDING".equals(dx.getTrangThai()))
            throw new BusinessException("Đề xuất này đã được xử lý");

        // Tính giá bán chốt
        BigDecimal pct = phanTramBienDo != null ? phanTramBienDo : BigDecimal.ZERO;
        BigDecimal giaBanChot = dx.getGiaDeXuat() != null
            ? dx.getGiaDeXuat()
                .multiply(BigDecimal.ONE.add(pct.divide(BigDecimal.valueOf(100), 4, RoundingMode.HALF_UP)))
                .setScale(0, RoundingMode.HALF_UP)
            : BigDecimal.ZERO;

        // Kiểm tra xem sản phẩm đã tồn tại chưa (match theo tên)
        // Tìm sản phẩm đã tồn tại trong DB theo tên (không phân biệt hoa/thường)
        SanPham sanPhamKhop = null;
        if (dx.getTenSanPham() != null && !dx.getTenSanPham().trim().isEmpty()) {
            List<SanPham> results = sanPhamRepository.findByTenSanPhamIgnoreCase(dx.getTenSanPham().trim());
            sanPhamKhop = results.isEmpty() ? null : results.get(0);
        }

        SanPham spMoi;
        boolean daTonTai = false;

        if (sanPhamKhop != null) {
            // Sản phẩm đã tồn tại — KHÔNG tạo mới, dùng SP có sẵn
            spMoi = sanPhamKhop;
            daTonTai = true;
            dx.setIdSanPhamKhop(sanPhamKhop.getIdSanPham());
        } else {
            // Tạo sản phẩm mới — soLuongTonKho = 0, kho sẽ cộng sau khi duyệt PO
            SanPham sp = new SanPham();
        sp.setTenSanPham(dx.getTenSanPham());
        sp.setMoTa(dx.getMoTa());
        sp.setUrlHinhAnh(dx.getUrlHinhAnh());
        sp.setGiaBan(giaBanChot);
        sp.setDungTichMl(dx.getDungTichMl());
        sp.setNongDo(dx.getNongDo());
        sp.setSoLuongTonKho(0); // Kho chưa kiểm — chưa cộng
        sp.setSoLuongHangLoi(0);

        if (idDanhMuc != null) {
            DanhMuc dm = new DanhMuc(); dm.setIdDanhMuc(idDanhMuc); sp.setDanhMuc(dm);
        }
        if (idThuongHieu != null) {
            ThuongHieu th = new ThuongHieu(); th.setIdThuongHieu(idThuongHieu); sp.setThuongHieu(th);
        }
            spMoi = sanPhamRepository.save(sp);
        }

        // Tạo PO CHO_KHO_KIEM_TRA — kho sẽ kiểm và admin duyệt cuối mới cộng kho + áp giá
        int slNhap = (soLuongNhap != null && soLuongNhap > 0) ? soLuongNhap
            : (dx.getSoLuongCoTheCungCap() != null ? dx.getSoLuongCoTheCungCap() : 1);

        PhieuNhapKho po = new PhieuNhapKho();
        po.setMaPhieu(taoMaPO());
        po.setNhaCungCap(dx.getTenNCC());
        po.setNgayNhap(LocalDateTime.now());
        po.setIdNhanVien(idNhanVien);
        po.setTrangThai("CHO_KHO_KIEM_TRA");
        po.setGiaBanChot(giaBanChot);
        po.setGhiChu((daTonTai ? "PO nhập thêm SP đã có" : "PO từ đề xuất NCC") + ": " + dx.getTenSanPham()
            + " | NCC: " + dx.getTenNCC()
            + " | Giá nhập: " + (dx.getGiaDeXuat() != null ? dx.getGiaDeXuat().toPlainString() : "?") + "₫"
            + " | Giá bán dự kiến: " + giaBanChot.toPlainString() + "₫"
            + (daTonTai ? " | ⚠ SP đã tồn tại #" + spMoi.getIdSanPham() : ""));

        ChiTietPhieuNhap ct = new ChiTietPhieuNhap();
        ct.setPhieuNhap(po);
        ct.setIdSanPham(spMoi.getIdSanPham());
        ct.setTenSanPhamSnapshot(spMoi.getTenSanPham());
        ct.setSoLuong(slNhap);
        ct.setGiaNhap(dx.getGiaDeXuat());
        ct.setSoLuongLoi(0);

        // Đọc HSD và số lô từ field riêng của đề xuất
        ct.setHanSuDung(dx.getHanSuDung());
        ct.setSoLo(dx.getSoLo());

        po.setChiTiet(List.of(ct));
        phieuNhapKhoRepository.save(po);

        // Cập nhật đề xuất
        dx.setTrangThai("APPROVED");
        dx.setIdSanPhamTaoRa(spMoi.getIdSanPham());
        dx.setPhanHoiAdmin(phanHoi);
        dx.setNgayXuLy(LocalDateTime.now());
        dx.setIdNhanVienXuLy(idNhanVien);
        sanPhamDeXuatRepo.save(dx);

        return spMoi;
    }

    /** Admin từ chối đề xuất sản phẩm */
    @Transactional
    public SanPhamDeXuat tuChoiSanPhamDeXuat(Integer idSanPhamDeXuat, Integer idNhanVien,
                                              String lyDo) {
        SanPhamDeXuat dx = sanPhamDeXuatRepo.findById(idSanPhamDeXuat)
            .orElseThrow(() -> new BusinessException("Đề xuất không tồn tại"));
        if (!"PENDING".equals(dx.getTrangThai()))
            throw new BusinessException("Đề xuất này đã được xử lý");

        dx.setTrangThai("REJECTED");
        dx.setPhanHoiAdmin(lyDo);
        dx.setNgayXuLy(LocalDateTime.now());
        dx.setIdNhanVienXuLy(idNhanVien);
        return sanPhamDeXuatRepo.save(dx);
    }

    /**
     * Duyệt hàng loạt nhiều đề xuất cùng lúc.
     * Mỗi đề xuất được xử lý độc lập trong transaction riêng.
     */
    public Map<String, Object> duyetHangLoat(Integer idNhanVien, List<Map<String, Object>> items) {
        int thanhCong = 0;
        int thatBai = 0;
        List<Map<String, Object>> chiTiet = new ArrayList<>();

        for (Map<String, Object> item : items) {
            try {
                Integer idSanPhamDeXuat = ((Number) item.get("idSanPhamDeXuat")).intValue();
                BigDecimal phanTramBienDo = item.get("phanTramBienDo") != null 
                    ? new BigDecimal(item.get("phanTramBienDo").toString())
                    : new BigDecimal("20");

                Integer idDanhMuc = item.containsKey("idDanhMuc") && item.get("idDanhMuc") != null
                    ? ((Number) item.get("idDanhMuc")).intValue() : null;
                Integer idThuongHieu = item.containsKey("idThuongHieu") && item.get("idThuongHieu") != null
                    ? ((Number) item.get("idThuongHieu")).intValue() : null;
                Integer soLuongNhap = item.containsKey("soLuongNhap") && item.get("soLuongNhap") != null
                    ? ((Number) item.get("soLuongNhap")).intValue() : null;
                String phanHoi = item.containsKey("phanHoi") ? (String) item.get("phanHoi") : "Duyệt hàng loạt";

                // Gọi qua self-proxy để transaction REQUIRES_NEW có hiệu lực
                // (gọi trực tiếp this.duyetDeXuatIndependent sẽ bỏ qua Spring AOP proxy)
                self.duyetDeXuatIndependent(idSanPhamDeXuat, idDanhMuc, idThuongHieu, 
                    idNhanVien, phanHoi, phanTramBienDo, soLuongNhap);
                thanhCong++;

                Map<String, Object> result = new HashMap<>();
                result.put("idSanPhamDeXuat", idSanPhamDeXuat);
                result.put("status", "success");
                chiTiet.add(result);

            } catch (Exception e) {
                thatBai++;
                
                Map<String, Object> result = new HashMap<>();
                result.put("idSanPhamDeXuat", item.get("idSanPhamDeXuat"));
                result.put("status", "error");
                result.put("message", e.getMessage());
                chiTiet.add(result);
            }
        }

        Map<String, Object> response = new HashMap<>();
        response.put("thanhCong", thanhCong);
        response.put("thatBai", thatBai);
        response.put("tong", items.size());
        response.put("chiTiet", chiTiet);
        return response;
    }

    /**
     * Wrapper method để duyệt đề xuất trong transaction riêng biệt.
     * Sử dụng REQUIRES_NEW để mỗi lần gọi tạo transaction mới.
     */
    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public SanPham duyetDeXuatIndependent(Integer idSanPhamDeXuat, Integer idDanhMuc,
                                           Integer idThuongHieu, Integer idNhanVien,
                                           String phanHoi, BigDecimal phanTramBienDo,
                                           Integer soLuongNhap) {
        return duyetSanPhamDeXuat(idSanPhamDeXuat, idDanhMuc, idThuongHieu, 
            idNhanVien, phanHoi, phanTramBienDo, soLuongNhap);
    }

    // ── NCC đề xuất hàng loạt qua Excel/CSV ─────────────────────────────────

    /**
     * Bước 1: NCC upload file → preview danh sách, validate, trả về sessionId.
     * Không commit vào DB chính. Dữ liệu lưu trong Map bộ nhớ theo sessionId.
     */
    private static final long BULK_SESSION_TTL_MS = 30 * 60 * 1000L; // 30 phút

    private static final class BulkSession {
        final List<Map<String, Object>> rows;
        final long createdAt = System.currentTimeMillis();
        BulkSession(List<Map<String, Object>> rows) { this.rows = rows; }
    }

    private static final Map<String, BulkSession> BULK_SESSIONS = new java.util.concurrent.ConcurrentHashMap<>();

    /** Dọn các session quá hạn để tránh rò rỉ bộ nhớ */
    private static void evictExpiredBulkSessions() {
        long now = System.currentTimeMillis();
        BULK_SESSIONS.entrySet().removeIf(e -> now - e.getValue().createdAt > BULK_SESSION_TTL_MS);
    }

    public Map<String, Object> bulkDeXuatPreview(MultipartFile file, String tenNCC, String lienHeNCC) throws IOException {
        evictExpiredBulkSessions();
        String sessionId = UUID.randomUUID().toString();
        String filename  = file.getOriginalFilename() != null ? file.getOriginalFilename().toLowerCase() : "";

        List<Map<String, Object>> rows;
        if (filename.endsWith(".xlsx") || filename.endsWith(".xls")) {
            rows = parseBulkExcel(file, tenNCC, lienHeNCC);
        } else {
            rows = parseBulkCsv(file, tenNCC, lienHeNCC);
        }

        BULK_SESSIONS.put(sessionId, new BulkSession(rows));

        long ok  = rows.stream().filter(r -> "OK".equals(r.get("trangThai"))).count();
        long loi = rows.stream().filter(r -> "LOI".equals(r.get("trangThai"))).count();

        Map<String, Object> result = new HashMap<>();
        result.put("sessionId", sessionId);
        result.put("rows", rows);
        result.put("tongDong", rows.size());
        result.put("ok", ok);
        result.put("loi", loi);
        return result;
    }

    /**
     * Bước 2: NCC xác nhận — commit các dòng OK thành SanPhamDeXuat (PENDING).
     */
    @Transactional
    public Map<String, Object> bulkDeXuatConfirm(String sessionId) {
        evictExpiredBulkSessions();
        BulkSession session = BULK_SESSIONS.remove(sessionId);
        if (session == null) throw new BusinessException("Session không tồn tại hoặc đã hết hạn");
        List<Map<String, Object>> rows = session.rows;

        List<Map<String, Object>> okRows = rows.stream()
            .filter(r -> "OK".equals(r.get("trangThai"))).toList();
        if (okRows.isEmpty()) throw new BusinessException("Không có dòng hợp lệ để gửi");

        List<SanPhamDeXuat> created = new ArrayList<>();
        for (Map<String, Object> row : okRows) {
            SanPhamDeXuat dx = new SanPhamDeXuat();
            dx.setPhieuGoiThau(null);
            dx.setTenNCC(row.get("tenNCC").toString());
            // lienHeNCC có thể là null (key tồn tại nhưng value null) → tránh NPE
            dx.setLienHeNCC(row.get("lienHeNCC") != null ? row.get("lienHeNCC").toString() : null);
            dx.setTenSanPham(row.get("tenSanPham").toString());
            dx.setMoTa(row.get("moTa") != null ? row.get("moTa").toString() : "");
            dx.setUrlHinhAnh(row.getOrDefault("urlHinhAnh", null) != null
                ? row.get("urlHinhAnh").toString() : null);
            dx.setGiaDeXuat(new BigDecimal(row.get("giaDeXuat").toString()));
            dx.setSoLuongCoTheCungCap(row.get("soLuong") != null
                ? Integer.parseInt(row.get("soLuong").toString()) : null);
            dx.setDungTichMl(row.get("dungTichMl") != null
                ? Integer.parseInt(row.get("dungTichMl").toString()) : null);
            dx.setNongDo(row.get("nongDo") != null
                ? Integer.parseInt(row.get("nongDo").toString()) : null);
            dx.setGhiChu(row.getOrDefault("ghiChu", "").toString());
            // Lưu HSD và soLo vào field riêng
            if (row.get("hanSuDung") != null && !row.get("hanSuDung").toString().isBlank()) {
                try {
                    LocalDate hsd = LocalDate.parse(row.get("hanSuDung").toString().trim());
                    dx.setHanSuDung(hsd);
                } catch (Exception ignored) {}
            }
            if (row.get("soLo") != null && !row.get("soLo").toString().isBlank()) {
                dx.setSoLo(row.get("soLo").toString().trim());
            }
            dx.setTrangThai("PENDING");
            dx.setNgayTao(LocalDateTime.now());
            created.add(sanPhamDeXuatRepo.save(dx));
        }

        Map<String, Object> result = new HashMap<>();
        result.put("daTao", created.size());
        result.put("tongDong", rows.size());
        return result;
    }

    // ── Parse helpers ─────────────────────────────────────────────────────

    private List<Map<String, Object>> parseBulkExcel(MultipartFile file, String tenNCC, String lienHeNCC) throws IOException {
        List<Map<String, Object>> rows = new ArrayList<>();
        // WorkbookFactory hỗ trợ cả .xlsx (XSSF) lẫn .xls (HSSF)
        try (Workbook wb = WorkbookFactory.create(file.getInputStream())) {
            Sheet sheet = wb.getSheetAt(0);
            Row header = sheet.getRow(0);
            Map<String, Integer> colMap = new HashMap<>();
            if (header != null) {
                for (Cell cell : header) {
                    if (cell.getCellType() == CellType.STRING) {
                        colMap.put(cell.getStringCellValue().trim().toLowerCase(), cell.getColumnIndex());
                    }
                }
            }
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;
                rows.add(buildBulkRow(i + 1, tenNCC, lienHeNCC,
                    cellStr(row, colMap.getOrDefault("ten_san_pham", 0)),
                    cellStr(row, colMap.getOrDefault("mo_ta", 1)),
                    cellStr(row, colMap.getOrDefault("gia_de_xuat", 2)),
                    cellStr(row, colMap.getOrDefault("so_luong", 3)),
                    cellStr(row, colMap.getOrDefault("dung_tich_ml", 4)),
                    cellStr(row, colMap.getOrDefault("nong_do", 5)),
                    cellStr(row, colMap.getOrDefault("url_hinh_anh", 6)),
                    cellStr(row, colMap.getOrDefault("ghi_chu", 7)),
                    cellStr(row, colMap.getOrDefault("han_su_dung", colMap.getOrDefault("hansuDung", colMap.getOrDefault("hanSuDung", 8)))),
                    cellStr(row, colMap.getOrDefault("so_lo", colMap.getOrDefault("soLo", 9)))));
            }
        }
        return rows;
    }

    private List<Map<String, Object>> parseBulkCsv(MultipartFile file, String tenNCC, String lienHeNCC) throws IOException {
        List<Map<String, Object>> rows = new ArrayList<>();
        // Đọc raw bytes để strip BOM nếu có
        byte[] bytes = file.getInputStream().readAllBytes();
        String content = new String(bytes, StandardCharsets.UTF_8);
        // Strip UTF-8 BOM (\uFEFF) nếu có
        if (content.startsWith("\uFEFF")) {
            content = content.substring(1);
        }
        try (Reader reader = new java.io.StringReader(content);
             CSVParser parser = CSVFormat.DEFAULT.builder()
                 .setHeader().setSkipHeaderRecord(true).setTrim(true).build().parse(reader)) {
            int dong = 1;
            for (CSVRecord record : parser) {
                dong++;
                rows.add(buildBulkRow(dong, tenNCC, lienHeNCC,
                    safeGet(record, "ten_san_pham"),
                    safeGet(record, "mo_ta"),
                    safeGet(record, "gia_de_xuat"),
                    safeGet(record, "so_luong"),
                    safeGet(record, "dung_tich_ml"),
                    safeGet(record, "nong_do"),
                    safeGet(record, "url_hinh_anh"),
                    safeGet(record, "ghi_chu"),
                    safeGet(record, "han_su_dung") != null ? safeGet(record, "han_su_dung") : safeGet(record, "hanSuDung"),
                    safeGet(record, "so_lo") != null ? safeGet(record, "so_lo") : safeGet(record, "soLo")));
            }
        }
        return rows;
    }

    private Map<String, Object> buildBulkRow(int dong, String tenNCC, String lienHeNCC,
            String tenSanPham, String moTa, String giaStr, String slStr,
            String dungTich, String nongDo, String urlHinhAnh, String ghiChu,
            String hanSuDung, String soLo) {
        Map<String, Object> row = new LinkedHashMap<>();
        row.put("dongSo", dong);
        row.put("tenNCC", tenNCC);
        row.put("lienHeNCC", lienHeNCC);
        row.put("moTa", moTa != null ? moTa : "");
        row.put("urlHinhAnh", urlHinhAnh != null && !urlHinhAnh.isBlank() ? urlHinhAnh : null);
        row.put("ghiChu", ghiChu != null ? ghiChu : "");

        // tenSanPham — bắt buộc
        if (tenSanPham == null || tenSanPham.isBlank()) {
            row.put("trangThai", "LOI"); row.put("loi", "Thiếu tên sản phẩm"); return row;
        }
        row.put("tenSanPham", tenSanPham.trim());

        // gia_de_xuat — bắt buộc > 0
        if (giaStr == null || giaStr.isBlank()) {
            row.put("trangThai", "LOI"); row.put("loi", "Thiếu giá đề xuất"); return row;
        }
        try {
            BigDecimal gia = new BigDecimal(giaStr.replace(",", "").trim());
            if (gia.compareTo(BigDecimal.ZERO) <= 0) {
                row.put("trangThai", "LOI"); row.put("loi", "Giá đề xuất phải > 0"); return row;
            }
            row.put("giaDeXuat", gia.toPlainString());
        } catch (Exception e) {
            row.put("trangThai", "LOI"); row.put("loi", "Giá không hợp lệ: " + giaStr); return row;
        }

        // so_luong — bắt buộc
        if (slStr == null || slStr.isBlank()) {
            row.put("trangThai", "LOI"); row.put("loi", "Thiếu số lượng"); return row;
        }
        try {
            int sl = (int) Double.parseDouble(slStr.trim());
            if (sl <= 0) { row.put("trangThai", "LOI"); row.put("loi", "Số lượng phải > 0"); return row; }
            row.put("soLuong", sl);
        } catch (Exception e) {
            row.put("trangThai", "LOI"); row.put("loi", "Số lượng không hợp lệ"); return row;
        }

        // Optional: dung_tich_ml, nong_do
        if (dungTich != null && !dungTich.isBlank()) {
            try { row.put("dungTichMl", (int) Double.parseDouble(dungTich.trim())); } catch (Exception ignored) {}
        }
        if (nongDo != null && !nongDo.isBlank()) {
            try { row.put("nongDo", (int) Double.parseDouble(nongDo.trim())); } catch (Exception ignored) {}
        }

        // Optional: han_su_dung, so_lo
        if (hanSuDung != null && !hanSuDung.isBlank()) {
            row.put("hanSuDung", hanSuDung.trim());
        }
        if (soLo != null && !soLo.isBlank()) {
            row.put("soLo", soLo.trim());
        }

        row.put("trangThai", "OK");
        return row;
    }

    private String safeGet(CSVRecord r, String col) {
        try { return r.get(col); } catch (Exception e) { return null; }
    }

    private String cellStr(Row row, int colIdx) {
        if (colIdx < 0 || row == null) return null;
        Cell cell = row.getCell(colIdx);
        if (cell == null) return null;
        return switch (cell.getCellType()) {
            case NUMERIC -> {
                if (org.apache.poi.ss.usermodel.DateUtil.isCellDateFormatted(cell)) {
                    // Cell là ngày → format về YYYY-MM-DD
                    java.util.Date d = cell.getDateCellValue();
                    yield new java.text.SimpleDateFormat("yyyy-MM-dd").format(d);
                }
                yield String.valueOf((long) cell.getNumericCellValue());
            }
            case STRING  -> cell.getStringCellValue();
            default      -> null;
        };
    }

    /** NCC đề xuất sản phẩm mới — trong 1 đợt gọi thầu */
    @Transactional
    public SanPhamDeXuat deXuatSanPham(Integer idPhieu, String tenNCC, String lienHeNCC,
                                       String tenSanPham, String moTa, String urlHinhAnh,
                                       BigDecimal giaDeXuat, Integer soLuong,
                                       Integer dungTichMl, Integer nongDo, String ghiChu) {
        PhieuGoiThau phieu = getById(idPhieu);
        if (!"OPEN".equals(phieu.getTrangThai()))
            throw new BusinessException("Đợt gọi thầu này đã đóng, không thể đề xuất");

        SanPhamDeXuat dx = new SanPhamDeXuat();
        dx.setPhieuGoiThau(phieu);
        dx.setTenNCC(tenNCC);
        dx.setLienHeNCC(lienHeNCC);
        dx.setTenSanPham(tenSanPham);
        dx.setMoTa(moTa);
        dx.setUrlHinhAnh(urlHinhAnh);
        dx.setGiaDeXuat(giaDeXuat);
        dx.setSoLuongCoTheCungCap(soLuong);
        dx.setDungTichMl(dungTichMl);
        dx.setNongDo(nongDo);
        dx.setGhiChu(ghiChu);
        dx.setTrangThai("PENDING");
        dx.setNgayTao(LocalDateTime.now());
        return sanPhamDeXuatRepo.save(dx);
    }

    // ── Helpers ────────────────────────────────────────────────────────────

    private String taoMaPhieu() {
        String dt = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd-HHmm"));
        return "GT-" + dt; // GT = Gọi Thầu
    }

    private String taoMaPO() {
        String ts = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMMddHHmmss"));
        // Thêm 4 ký tự random để tránh trùng khi tạo nhiều PO cùng lúc
        String random = UUID.randomUUID().toString().substring(0, 4).toUpperCase();
        return "PO" + ts + "-" + random;
    }
}
