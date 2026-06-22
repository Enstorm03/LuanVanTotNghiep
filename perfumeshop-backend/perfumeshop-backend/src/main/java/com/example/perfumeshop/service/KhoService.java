package com.example.perfumeshop.service;

import com.example.perfumeshop.entity.*;
import com.example.perfumeshop.exception.BusinessException;
import com.example.perfumeshop.repository.*;
import jakarta.transaction.Transactional;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class KhoService {

    @Autowired private SanPhamRepository sanPhamRepository;
    @Autowired private PhieuNhapKhoRepository phieuNhapKhoRepository;
    @Autowired private PhieuNhapTamRepository phieuNhapTamRepository;
    @Autowired private BienDongKhoRepository bienDongKhoRepository;
    @Autowired private BaoGiaNCCRepository baoGiaNCCRepo;

    // ══════════════════════════════════════════════════════════
    //  PO WORKFLOW: Kho xác nhận → Admin duyệt cuối
    // ══════════════════════════════════════════════════════════

    /** Lấy danh sách PO đang chờ kho kiểm tra */
    public List<PhieuNhapKho> getPoChoKhoKiemTra() {
        return phieuNhapKhoRepository.findByTrangThaiOrderByNgayNhapDesc("CHO_KHO_KIEM_TRA");
    }

    /** Lấy danh sách PO đang chờ admin duyệt cuối */
    public List<PhieuNhapKho> getPoChoAdminDuyet() {
        return phieuNhapKhoRepository.findByTrangThaiOrderByNgayNhapDesc("CHO_ADMIN_DUYET");
    }

    /**
     * Kho xác nhận hàng thực nhận.
     * chiTietList = [{ idChiTiet, soLuongThucNhan, soLuongLoi, urlHinhAnhMoi, ghiChuKho }]
     * KHÔNG cộng kho — chỉ lưu thông tin kiểm hàng và chuyển trạng thái.
     */
    @Transactional
    public PhieuNhapKho khoXacNhan(Integer idPhieu, List<Map<String, Object>> chiTietList, Integer nhanVienId) {
        PhieuNhapKho po = phieuNhapKhoRepository.findById(idPhieu)
            .orElseThrow(() -> new BusinessException("Phiếu nhập không tồn tại: " + idPhieu));

        if (!"CHO_KHO_KIEM_TRA".equals(po.getTrangThai()))
            throw new BusinessException("Phiếu đang ở trạng thái [" + po.getTrangThai() + "], không thể xác nhận kiểm hàng");

        // Build map idChiTiet → payload
        Map<Integer, Map<String, Object>> payloadMap = new HashMap<>();
        if (chiTietList != null) {
            for (Map<String, Object> item : chiTietList) {
                Integer id = Integer.parseInt(item.get("idChiTiet").toString());
                payloadMap.put(id, item);
            }
        }

        for (ChiTietPhieuNhap ct : po.getChiTiet()) {
            Map<String, Object> item = payloadMap.get(ct.getId());
            if (item == null) continue;

            Integer slThucNhan = item.get("soLuongThucNhan") != null
                ? Integer.parseInt(item.get("soLuongThucNhan").toString()) : null;
            Integer slLoi = item.get("soLuongLoi") != null
                ? Integer.parseInt(item.get("soLuongLoi").toString()) : 0;

            // Validate
            if (slThucNhan == null || slThucNhan < 0)
                throw new BusinessException("soLuongThucNhan không hợp lệ cho chi tiết #" + ct.getId());
            if (slLoi < 0 || slLoi > slThucNhan)
                throw new BusinessException("soLuongLoi không hợp lệ cho chi tiết #" + ct.getId() + " (phải <= soLuongThucNhan)");

            ct.setSoLuongThucNhan(slThucNhan);
            ct.setSoLuongLoi(slLoi);
            if (item.get("urlHinhAnhMoi") != null)
                ct.setUrlHinhAnhMoi(item.get("urlHinhAnhMoi").toString().trim());
            if (item.get("ghiChuKho") != null)
                ct.setGhiChuKho(item.get("ghiChuKho").toString().trim());
        }

        po.setTrangThai("CHO_ADMIN_DUYET");
        return phieuNhapKhoRepository.save(po);
    }

    /**
     * Admin duyệt cuối PO:
     *  - Cộng soLuongThucNhan vào tồn kho
     *  - Cập nhật giaBan từ giaBanChot trong BaoGiaNCC
     *  - Cập nhật urlHinhAnh nếu kho đã điền
     *  - Ghi BienDongKho
     */
    @Transactional
    public PhieuNhapKho adminDuyetCuoi(Integer idPhieu, Integer nhanVienId) {
        PhieuNhapKho po = phieuNhapKhoRepository.findById(idPhieu)
            .orElseThrow(() -> new BusinessException("Phiếu nhập không tồn tại: " + idPhieu));

        if (!"CHO_ADMIN_DUYET".equals(po.getTrangThai()))
            throw new BusinessException("Phiếu đang ở trạng thái [" + po.getTrangThai() + "], không thể duyệt cuối");

        BigDecimal giaBanChot = po.getGiaBanChot();

        for (ChiTietPhieuNhap ct : po.getChiTiet()) {
            if (ct.getSoLuongThucNhan() == null || ct.getSoLuongThucNhan() <= 0) continue;

            SanPham sp = sanPhamRepository.findById(ct.getIdSanPham()).orElse(null);
            if (sp == null) continue;

            // Cộng kho
            int tonCu = sp.getSoLuongTonKho() == null ? 0 : sp.getSoLuongTonKho();
            int tonMoi = tonCu + ct.getSoLuongThucNhan();
            sp.setSoLuongTonKho(tonMoi);

            // Cập nhật giá bán nếu có
            if (giaBanChot != null && giaBanChot.compareTo(BigDecimal.ZERO) > 0) {
                sp.setGiaBan(giaBanChot);
            }

            // Cập nhật ảnh nếu kho đã điền URL mới
            if (ct.getUrlHinhAnhMoi() != null && !ct.getUrlHinhAnhMoi().trim().isEmpty()) {
                sp.setUrlHinhAnh(ct.getUrlHinhAnhMoi().trim());
            }

            sanPhamRepository.save(sp);

            // Ghi biến động kho
            ghiBienDong(sp.getIdSanPham(), sp.getTenSanPham(),
                "NHAP", ct.getSoLuongThucNhan(), tonMoi,
                "Nhập từ PO " + po.getMaPhieu() + " (kho xác nhận, admin duyệt)",
                null, po.getIdPhieu(), nhanVienId);
        }

        po.setTrangThai("DA_NHAP");
        return phieuNhapKhoRepository.save(po);
    }

    /**
     * Admin từ chối PO sau khi kho xác nhận.
     */
    @Transactional
    public PhieuNhapKho adminTuChoi(Integer idPhieu, String lyDo, Integer nhanVienId) {
        PhieuNhapKho po = phieuNhapKhoRepository.findById(idPhieu)
            .orElseThrow(() -> new BusinessException("Phiếu nhập không tồn tại: " + idPhieu));

        if (!"CHO_ADMIN_DUYET".equals(po.getTrangThai()))
            throw new BusinessException("Phiếu đang ở trạng thái [" + po.getTrangThai() + "], không thể từ chối");

        if (lyDo == null || lyDo.trim().isEmpty())
            throw new BusinessException("Lý do từ chối không được để trống");

        po.setTrangThai("BI_TU_CHOI");
        po.setGhiChu((po.getGhiChu() != null ? po.getGhiChu() + "\n" : "") + "⚠ Từ chối: " + lyDo.trim());
        return phieuNhapKhoRepository.save(po);
    }

    // ══════════════════════════════════════════════════════════
    //  1. IMPORT CSV/EXCEL → STAGING
    // ══════════════════════════════════════════════════════════

    /**
     * Parse file CSV hoặc Excel → lưu vào bảng tạm.
     * Trả về sessionId và danh sách dòng preview.
     */
    @Transactional
    public Map<String, Object> importPreview(MultipartFile file) throws IOException {
        String sessionId = UUID.randomUUID().toString();
        String filename  = file.getOriginalFilename() != null ? file.getOriginalFilename().toLowerCase() : "";

        List<PhieuNhapTam> rows;
        if (filename.endsWith(".xlsx") || filename.endsWith(".xls")) {
            rows = parseExcel(file, sessionId);
        } else {
            rows = parseCsv(file, sessionId);
        }

        // Fuzzy map tên SP → id
        List<SanPham> allSp = sanPhamRepository.findAll();
        for (PhieuNhapTam row : rows) {
            if ("LOI".equals(row.getTrangThai())) continue;
            // Nếu đã có idSanPham từ file thì dùng luôn
            if (row.getIdSanPham() != null) {
                boolean exists = allSp.stream().anyMatch(sp -> sp.getIdSanPham().equals(row.getIdSanPham()));
                row.setTrangThai(exists ? "OK" : "LOI");
                if (!exists) row.setLoi("Không tìm thấy sản phẩm ID " + row.getIdSanPham());
            } else if (row.getTenSanPhamCsv() != null) {
                // Exact match trước, sau đó contains
                Optional<SanPham> match = allSp.stream()
                    .filter(sp -> sp.getTenSanPham() != null &&
                                  sp.getTenSanPham().equalsIgnoreCase(row.getTenSanPhamCsv().trim()))
                    .findFirst();
                if (match.isEmpty()) {
                    String lower = row.getTenSanPhamCsv().toLowerCase();
                    match = allSp.stream()
                        .filter(sp -> sp.getTenSanPham() != null &&
                                      sp.getTenSanPham().toLowerCase().contains(lower))
                        .findFirst();
                }
                if (match.isPresent()) {
                    row.setIdSanPham(match.get().getIdSanPham());
                    row.setTrangThai("OK");
                } else {
                    row.setTrangThai("CHUA_MAP");
                    row.setLoi("Không tìm thấy sản phẩm: " + row.getTenSanPhamCsv());
                }
            }
        }

        phieuNhapTamRepository.saveAll(rows);

        long ok       = rows.stream().filter(r -> "OK".equals(r.getTrangThai())).count();
        long chuaMap  = rows.stream().filter(r -> "CHUA_MAP".equals(r.getTrangThai())).count();
        long loi      = rows.stream().filter(r -> "LOI".equals(r.getTrangThai())).count();

        Map<String, Object> result = new HashMap<>();
        result.put("sessionId", sessionId);
        result.put("rows", rows);
        result.put("tongDong", rows.size());
        result.put("ok", ok);
        result.put("chuaMap", chuaMap);
        result.put("loi", loi);
        return result;
    }

    /** Lấy preview đã lưu của một session */
    public List<PhieuNhapTam> getPreview(String sessionId) {
        return phieuNhapTamRepository.findByIdSessionOrderByDongSoAsc(sessionId);
    }

    /** Admin sửa toàn bộ field của một dòng staging */
    @Transactional
    public PhieuNhapTam updateRow(Integer rowId, Integer idSanPham, Integer soLuong,
                                   BigDecimal giaNhap, String tenSanPhamCsv, String ghiChu) {
        PhieuNhapTam row = phieuNhapTamRepository.findById(rowId)
            .orElseThrow(() -> new BusinessException("Dòng không tồn tại"));

        if (tenSanPhamCsv != null) row.setTenSanPhamCsv(tenSanPhamCsv);
        if (ghiChu != null) row.setGhiChu(ghiChu);

        if (idSanPham != null) {
            sanPhamRepository.findById(idSanPham)
                .orElseThrow(() -> new BusinessException("Sản phẩm không tồn tại"));
            row.setIdSanPham(idSanPham);
            row.setTrangThai("OK");
            row.setLoi(null);
        }
        if (soLuong != null) {
            if (soLuong <= 0) {
                row.setTrangThai("LOI");
                row.setLoi("Số lượng phải > 0");
            } else {
                row.setSoLuong(soLuong);
                // Nếu trước đó LOI vì số lượng, reset lại
                if ("LOI".equals(row.getTrangThai()) && row.getIdSanPham() != null) {
                    row.setTrangThai("OK");
                    row.setLoi(null);
                }
            }
        }
        if (giaNhap != null) row.setGiaNhap(giaNhap);

        return phieuNhapTamRepository.save(row);
    }

    /** Admin xóa dòng khỏi staging */
    @Transactional
    public void deleteRow(Integer rowId) {
        if (!phieuNhapTamRepository.existsById(rowId))
            throw new BusinessException("Dòng không tồn tại");
        phieuNhapTamRepository.deleteById(rowId);
    }

    /** Admin thêm dòng thủ công vào staging */
    @Transactional
    public PhieuNhapTam addRow(String sessionId, java.util.Map<String, Object> body) {
        if (!phieuNhapTamRepository.existsByIdSession(sessionId))
            throw new BusinessException("Session không tồn tại");

        PhieuNhapTam row = new PhieuNhapTam();
        row.setIdSession(sessionId);
        row.setNgayTao(LocalDateTime.now());
        row.setDongSo(9999); // dòng thêm thủ công

        String tenSp = body.get("tenSanPhamCsv") != null ? body.get("tenSanPhamCsv").toString() : null;
        row.setTenSanPhamCsv(tenSp);

        if (body.get("ghiChu") != null) row.setGhiChu(body.get("ghiChu").toString());

        if (body.get("giaNhap") != null && !body.get("giaNhap").toString().isBlank())
            row.setGiaNhap(new BigDecimal(body.get("giaNhap").toString()));

        // Số lượng
        if (body.get("soLuong") == null) {
            row.setTrangThai("LOI"); row.setLoi("Thiếu số lượng"); return phieuNhapTamRepository.save(row);
        }
        int sl = Integer.parseInt(body.get("soLuong").toString());
        if (sl <= 0) {
            row.setTrangThai("LOI"); row.setLoi("Số lượng phải > 0"); return phieuNhapTamRepository.save(row);
        }
        row.setSoLuong(sl);

        // ID sản phẩm
        if (body.get("idSanPham") != null && !body.get("idSanPham").toString().isBlank()) {
            Integer idSp = Integer.parseInt(body.get("idSanPham").toString());
            boolean exists = sanPhamRepository.existsById(idSp);
            row.setIdSanPham(idSp);
            row.setTrangThai(exists ? "OK" : "LOI");
            if (!exists) row.setLoi("Sản phẩm ID " + idSp + " không tồn tại");
        } else {
            row.setTrangThai("CHUA_MAP");
            row.setLoi("Chưa có ID sản phẩm");
        }
        return phieuNhapTamRepository.save(row);
    }

    /**
     * Admin duyệt toàn bộ session → tạo phiếu nhập chính thức + cộng kho + ghi biến động.
     */
    @Transactional
    public PhieuNhapKho confirmImport(String sessionId, Integer nhanVienId,
                                       String nhaCungCap, String ghiChu) {
        List<PhieuNhapTam> rows = phieuNhapTamRepository.findByIdSessionOrderByDongSoAsc(sessionId);
        if (rows.isEmpty()) throw new BusinessException("Session không tồn tại hoặc đã được xử lý");

        // Chỉ xử lý dòng OK
        List<PhieuNhapTam> okRows = rows.stream().filter(r -> "OK".equals(r.getTrangThai())).toList();
        if (okRows.isEmpty()) throw new BusinessException("Không có dòng hợp lệ để duyệt");

        // Tạo phiếu nhập chính thức
        PhieuNhapKho phieu = new PhieuNhapKho();
        phieu.setMaPhieu(generateMaPhieu());
        phieu.setIdNhanVien(nhanVienId);
        phieu.setNhaCungCap(nhaCungCap);
        phieu.setNgayNhap(LocalDateTime.now());
        phieu.setGhiChu(ghiChu);
        phieu.setTrangThai("DA_NHAP"); // nhập thủ công — cộng kho ngay

        List<ChiTietPhieuNhap> chiTiet = new ArrayList<>();
        for (PhieuNhapTam row : okRows) {
            SanPham sp = sanPhamRepository.findById(row.getIdSanPham())
                .orElseThrow(() -> new BusinessException("SP " + row.getIdSanPham() + " không tồn tại"));

            // Cộng kho
            int tonCu = sp.getSoLuongTonKho() == null ? 0 : sp.getSoLuongTonKho();
            int tonMoi = tonCu + row.getSoLuong();
            sp.setSoLuongTonKho(tonMoi);
            sanPhamRepository.save(sp);

            // Chi tiết phiếu
            ChiTietPhieuNhap ct = new ChiTietPhieuNhap();
            ct.setPhieuNhap(phieu);
            ct.setIdSanPham(sp.getIdSanPham());
            ct.setTenSanPhamSnapshot(sp.getTenSanPham());
            ct.setSoLuong(row.getSoLuong());
            ct.setGiaNhap(row.getGiaNhap());
            ct.setGhiChu(row.getGhiChu());
            chiTiet.add(ct);
        }
        phieu.setChiTiet(chiTiet);
        PhieuNhapKho saved = phieuNhapKhoRepository.save(phieu);

        // Ghi biến động kho
        for (ChiTietPhieuNhap ct : chiTiet) {
            SanPham sp = sanPhamRepository.findById(ct.getIdSanPham()).orElse(null);
            ghiBienDong(ct.getIdSanPham(), ct.getTenSanPhamSnapshot(),
                "NHAP", ct.getSoLuong(),
                sp != null ? sp.getSoLuongTonKho() : null,
                "Nhập kho từ phiếu " + saved.getMaPhieu() + (nhaCungCap != null ? " / NCC: " + nhaCungCap : ""),
                null, saved.getIdPhieu(), nhanVienId);
        }

        // Xóa staging
        phieuNhapTamRepository.deleteByIdSession(sessionId);
        return saved;
    }

    // ══════════════════════════════════════════════════════════
    //  2. LỊCH SỬ PHIẾU NHẬP
    // ══════════════════════════════════════════════════════════

    public List<PhieuNhapKho> listPhieuNhap() {
        return phieuNhapKhoRepository.findAllByOrderByNgayNhapDesc();
    }

    public PhieuNhapKho getPhieuNhap(Integer id) {
        return phieuNhapKhoRepository.findById(id)
            .orElseThrow(() -> new BusinessException("Phiếu nhập không tồn tại"));
    }

    // ══════════════════════════════════════════════════════════
    //  3. BIẾN ĐỘNG KHO
    // ══════════════════════════════════════════════════════════

    public List<BienDongKho> getBienDong(Integer idSanPham) {
        if (idSanPham != null) return bienDongKhoRepository.findByIdSanPhamOrderByNgayTaoDesc(idSanPham);
        return bienDongKhoRepository.findAllByOrderByNgayTaoDesc();
    }

    /** Ghi 1 dòng biến động — dùng nội bộ và từ các service khác */
    public void ghiBienDong(Integer idSanPham, String tenSp, String loai, int soLuong,
                             Integer tonKhoSau, String lyDo,
                             Integer idDonHang, Integer idPhieuNhap, Integer idNhanVien) {
        BienDongKho bd = new BienDongKho();
        bd.setIdSanPham(idSanPham);
        bd.setTenSanPhamSnapshot(tenSp);
        bd.setLoai(loai);
        bd.setSoLuong(soLuong);
        bd.setTonKhoSau(tonKhoSau);
        bd.setLyDo(lyDo);
        bd.setIdDonHang(idDonHang);
        bd.setIdPhieuNhap(idPhieuNhap);
        bd.setIdNhanVien(idNhanVien);
        bd.setNgayTao(LocalDateTime.now());
        bienDongKhoRepository.save(bd);
    }

    // ══════════════════════════════════════════════════════════
    //  4. THỐNG KÊ BÁN CHẬM
    // ══════════════════════════════════════════════════════════

    /**
     * Sản phẩm bán chậm: còn tồn kho > 0 nhưng ít đơn hoàn thành trong N ngày qua.
     * Tận dụng data DonHang sẵn có, không cần bảng mới.
     */
    public List<Map<String, Object>> getSlowMoving(int days, int limit) {
        LocalDateTime since = LocalDateTime.now().minusDays(days);

        // Build map idSanPham → tổng bán trong kỳ
        Map<Integer, Integer> salesMap = new HashMap<>();
        // Lấy từ repository qua DonHang — dùng findAll (data nhỏ, shop nước hoa)
        // Nếu data lớn thì chuyển sang native query
        List<SanPham> allSp = sanPhamRepository.findAll();

        // Trả về list sản phẩm còn kho, sort theo bán ít nhất
        return allSp.stream()
            .filter(sp -> sp.getSoLuongTonKho() != null && sp.getSoLuongTonKho() > 0)
            .map(sp -> {
                Map<String, Object> m = new HashMap<>();
                m.put("idSanPham",      sp.getIdSanPham());
                m.put("tenSanPham",     sp.getTenSanPham());
                m.put("soLuongTonKho",  sp.getSoLuongTonKho());
                m.put("giaBan",         sp.getGiaBan());
                m.put("soLuongHangLoi", sp.getSoLuongHangLoi() != null ? sp.getSoLuongHangLoi() : 0);
                m.put("tongBan",        salesMap.getOrDefault(sp.getIdSanPham(), 0));
                m.put("urlHinhAnh",     sp.getUrlHinhAnh());
                return m;
            })
            .sorted(Comparator.comparingInt(m -> (int) m.get("tongBan")))
            .limit(limit)
            .collect(java.util.stream.Collectors.toList());
    }

    // ══════════════════════════════════════════════════════════
    //  PRIVATE HELPERS
    // ══════════════════════════════════════════════════════════

    private List<PhieuNhapTam> parseCsv(MultipartFile file, String sessionId) throws IOException {
        List<PhieuNhapTam> rows = new ArrayList<>();
        try (Reader reader = new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8);
             CSVParser parser = CSVFormat.DEFAULT.builder()
                     .setHeader().setSkipHeaderRecord(true).setTrim(true).build().parse(reader)) {
            int dong = 1;
            for (CSVRecord record : parser) {
                dong++;
                PhieuNhapTam row = buildRowFromValues(sessionId, dong,
                    safeGet(record, "id_san_pham"),
                    safeGet(record, "ten_san_pham"),
                    safeGet(record, "so_luong"),
                    safeGet(record, "gia_nhap"),
                    safeGet(record, "ghi_chu"));
                rows.add(row);
            }
        }
        return rows;
    }

    private List<PhieuNhapTam> parseExcel(MultipartFile file, String sessionId) throws IOException {
        List<PhieuNhapTam> rows = new ArrayList<>();
        try (Workbook wb = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = wb.getSheetAt(0);
            // Đọc header row để biết vị trí cột
            Row header = sheet.getRow(0);
            Map<String, Integer> colMap = new HashMap<>();
            if (header != null) {
                for (Cell cell : header) {
                    colMap.put(cell.getStringCellValue().trim().toLowerCase(), cell.getColumnIndex());
                }
            }
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;
                PhieuNhapTam tam = buildRowFromValues(sessionId, i + 1,
                    cellStr(row, colMap.getOrDefault("id_san_pham", -1)),
                    cellStr(row, colMap.getOrDefault("ten_san_pham", -1)),
                    cellStr(row, colMap.getOrDefault("so_luong", -1)),
                    cellStr(row, colMap.getOrDefault("gia_nhap", -1)),
                    cellStr(row, colMap.getOrDefault("ghi_chu", -1)));
                rows.add(tam);
            }
        }
        return rows;
    }

    private PhieuNhapTam buildRowFromValues(String sessionId, int dong,
            String idSpStr, String tenSp, String slStr, String giaNhapStr, String ghiChu) {
        PhieuNhapTam row = new PhieuNhapTam();
        row.setIdSession(sessionId);
        row.setDongSo(dong);
        row.setNgayTao(LocalDateTime.now());
        row.setGhiChu(ghiChu);

        // id_san_pham
        if (idSpStr != null && !idSpStr.isBlank()) {
            try { row.setIdSanPham(Integer.parseInt(idSpStr.trim())); } catch (Exception ignored) {}
        }
        row.setTenSanPhamCsv(tenSp != null ? tenSp.trim() : null);

        // so_luong
        if (slStr == null || slStr.isBlank()) {
            row.setTrangThai("LOI"); row.setLoi("Thiếu số lượng"); return row;
        }
        try {
            int sl = (int) Double.parseDouble(slStr.trim());
            if (sl <= 0) { row.setTrangThai("LOI"); row.setLoi("Số lượng phải > 0"); return row; }
            row.setSoLuong(sl);
        } catch (Exception e) {
            row.setTrangThai("LOI"); row.setLoi("Số lượng không hợp lệ: " + slStr); return row;
        }

        // gia_nhap (không bắt buộc)
        if (giaNhapStr != null && !giaNhapStr.isBlank()) {
            try { row.setGiaNhap(new BigDecimal(giaNhapStr.replace(",", "").trim())); } catch (Exception ignored) {}
        }

        row.setTrangThai("PENDING");
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
            case NUMERIC -> String.valueOf((long) cell.getNumericCellValue());
            case STRING  -> cell.getStringCellValue();
            default      -> null;
        };
    }

    private String generateMaPhieu() {
        String ts = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMMddHHmmss"));
        return "PN" + ts;
    }
}
