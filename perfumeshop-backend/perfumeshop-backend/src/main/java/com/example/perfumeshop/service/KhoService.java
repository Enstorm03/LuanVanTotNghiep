package com.example.perfumeshop.service;

import com.example.perfumeshop.entity.*;
import com.example.perfumeshop.exception.BusinessException;
import com.example.perfumeshop.repository.*;
import jakarta.transaction.Transactional;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.apache.poi.ss.usermodel.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;

@Service
public class KhoService {

    @Autowired private SanPhamRepository sanPhamRepository;
    @Autowired private PhieuNhapKhoRepository phieuNhapKhoRepository;
    @Autowired private PhieuNhapTamRepository phieuNhapTamRepository;
    @Autowired private BienDongKhoRepository bienDongKhoRepository;
    @Autowired private BaoGiaNCCRepository baoGiaNCCRepo;

    @Transactional
    public PhieuNhapKho khoXacNhan(Integer idPhieu, List<Map<String, Object>> chiTietList, Integer nhanVienId) {
        PhieuNhapKho po = phieuNhapKhoRepository.findById(idPhieu)
            .orElseThrow(() -> new BusinessException("Phiếu nhập không tồn tại: " + idPhieu));

        if (!"CHO_KHO_KIEM_TRA".equals(po.getTrangThai()))
            throw new BusinessException("Phiếu đang ở trạng thái [" + po.getTrangThai() + "], không thể xác nhận");

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

            if (slThucNhan == null || slThucNhan < 0)
                throw new BusinessException("soLuongThucNhan không hợp lệ");
            if (slLoi < 0 || slLoi > slThucNhan)
                throw new BusinessException("soLuongLoi không hợp lệ");

            ct.setSoLuongThucNhan(slThucNhan);
            ct.setSoLuongLoi(slLoi);
            
            if (item.get("hanSuDung") != null) {
                try {
                    ct.setHanSuDung(LocalDate.parse(item.get("hanSuDung").toString()));
                } catch (Exception ignored) {}
            }
            if (item.get("soLo") != null)
                ct.setSoLo(item.get("soLo").toString().trim());
            
            if (item.get("urlHinhAnhMoi") != null)
                ct.setUrlHinhAnhMoi(item.get("urlHinhAnhMoi").toString().trim());
            if (item.get("ghiChuKho") != null)
                ct.setGhiChuKho(item.get("ghiChuKho").toString().trim());
        }

        po.setTrangThai("CHO_ADMIN_DUYET");
        return phieuNhapKhoRepository.save(po);
    }

    @Transactional
    public PhieuNhapKho adminDuyetCuoi(Integer idPhieu, Integer nhanVienId) {
        PhieuNhapKho po = phieuNhapKhoRepository.findById(idPhieu)
            .orElseThrow(() -> new BusinessException("Phiếu nhập không tồn tại: " + idPhieu));

        if (!"CHO_ADMIN_DUYET".equals(po.getTrangThai()))
            throw new BusinessException("Phiếu không ở trạng thái CHO_ADMIN_DUYET");

        BigDecimal giaBanChot = po.getGiaBanChot();

        for (ChiTietPhieuNhap ct : po.getChiTiet()) {
            if (ct.getSoLuongThucNhan() == null || ct.getSoLuongThucNhan() <= 0) continue;

            SanPham sp = sanPhamRepository.findById(ct.getIdSanPham()).orElse(null);
            if (sp == null) continue;

            int slLoi = ct.getSoLuongLoi() != null ? ct.getSoLuongLoi() : 0;
            int slHopLe = ct.getSoLuongThucNhan() - slLoi; // chỉ cộng phần hàng tốt

            int tonCu = sp.getSoLuongTonKho() == null ? 0 : sp.getSoLuongTonKho();
            int tonMoi = tonCu + slHopLe;
            sp.setSoLuongTonKho(tonMoi);
            ct.setSoLuongConLai(slHopLe); // số còn lại trong lô = số tốt ban đầu

            // Cộng hàng lỗi vào soLuongHangLoi của SP
            if (slLoi > 0) {
                int loiCu = sp.getSoLuongHangLoi() == null ? 0 : sp.getSoLuongHangLoi();
                sp.setSoLuongHangLoi(loiCu + slLoi);
            }

            if (giaBanChot != null && giaBanChot.compareTo(BigDecimal.ZERO) > 0) {
                sp.setGiaBan(giaBanChot);
            }

            if (ct.getUrlHinhAnhMoi() != null && !ct.getUrlHinhAnhMoi().trim().isEmpty()) {
                sp.setUrlHinhAnh(ct.getUrlHinhAnhMoi().trim());
            }

            sanPhamRepository.save(sp);

            // Ghi biến động: nhập hàng tốt
            if (slHopLe > 0) {
                ghiBienDong(sp.getIdSanPham(), sp.getTenSanPham(),
                    "NHAP", slHopLe, tonMoi,
                    "Nhập từ PO " + po.getMaPhieu() + (ct.getSoLo() != null ? " · Lô " + ct.getSoLo() : ""),
                    null, po.getIdPhieu(), nhanVienId);
            }
            // Ghi biến động: xuất hàng lỗi
            if (slLoi > 0) {
                ghiBienDong(sp.getIdSanPham(), sp.getTenSanPham(),
                    "XUAT_LOI", slLoi, tonMoi,
                    "Hàng lỗi từ PO " + po.getMaPhieu() + (ct.getSoLo() != null ? " · Lô " + ct.getSoLo() : ""),
                    null, po.getIdPhieu(), nhanVienId);
            }
        }

        po.setTrangThai("DA_NHAP");
        return phieuNhapKhoRepository.save(po);
    }

    @Transactional
    public PhieuNhapKho adminTuChoi(Integer idPhieu, String lyDo, Integer nhanVienId) {
        PhieuNhapKho po = phieuNhapKhoRepository.findById(idPhieu)
            .orElseThrow(() -> new BusinessException("Phiếu không tồn tại"));

        if (!"CHO_ADMIN_DUYET".equals(po.getTrangThai()))
            throw new BusinessException("Phiếu không ở trạng thái CHO_ADMIN_DUYET");

        if (lyDo == null || lyDo.trim().isEmpty())
            throw new BusinessException("Lý do từ chối không được để trống");

        po.setTrangThai("BI_TU_CHOI");
        po.setGhiChu((po.getGhiChu() != null ? po.getGhiChu() + "\n" : "") + "⚠ Từ chối: " + lyDo.trim());
        return phieuNhapKhoRepository.save(po);
    }

    @Transactional
    public Map<String, Object> importPreview(MultipartFile file) throws IOException {
        String sessionId = UUID.randomUUID().toString();
        String filename = file.getOriginalFilename() != null ? file.getOriginalFilename().toLowerCase() : "";

        List<PhieuNhapTam> rows;
        if (filename.endsWith(".xlsx") || filename.endsWith(".xls")) {
            rows = parseExcel(file, sessionId);
        } else {
            rows = parseCsv(file, sessionId);
        }

        List<SanPham> allSp = sanPhamRepository.findAll();
        for (PhieuNhapTam row : rows) {
            if ("LOI".equals(row.getTrangThai())) continue;
            if (row.getIdSanPham() != null) {
                boolean exists = allSp.stream().anyMatch(sp -> sp.getIdSanPham().equals(row.getIdSanPham()));
                row.setTrangThai(exists ? "OK" : "LOI");
                if (!exists) row.setLoi("Không tìm thấy ID");
            } else if (row.getTenSanPhamCsv() != null) {
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
                    row.setLoi("Không tìm thấy");
                }
            }
        }

        phieuNhapTamRepository.saveAll(rows);

        long ok = rows.stream().filter(r -> "OK".equals(r.getTrangThai())).count();
        long chuaMap = rows.stream().filter(r -> "CHUA_MAP".equals(r.getTrangThai())).count();
        long loi = rows.stream().filter(r -> "LOI".equals(r.getTrangThai())).count();

        Map<String, Object> result = new HashMap<>();
        result.put("sessionId", sessionId);
        result.put("rows", rows);
        result.put("tongDong", rows.size());
        result.put("ok", ok);
        result.put("chuaMap", chuaMap);
        result.put("loi", loi);
        return result;
    }

    public List<PhieuNhapTam> getPreview(String sessionId) {
        return phieuNhapTamRepository.findByIdSessionOrderByDongSoAsc(sessionId);
    }

    @Transactional
    public PhieuNhapTam updateRow(Integer rowId, Integer idSanPham, Integer soLuong,
                                   BigDecimal giaNhap, String tenSanPhamCsv, String ghiChu,
                                   String hanSuDungStr, String soLo) {
        PhieuNhapTam row = phieuNhapTamRepository.findById(rowId)
            .orElseThrow(() -> new BusinessException("Dòng không tồn tại"));

        if (tenSanPhamCsv != null) row.setTenSanPhamCsv(tenSanPhamCsv);
        if (ghiChu != null) row.setGhiChu(ghiChu);

        if (hanSuDungStr != null) {
            if (hanSuDungStr.isBlank()) {
                row.setHanSuDung(null);
            } else {
                try { row.setHanSuDung(java.time.LocalDate.parse(hanSuDungStr.trim())); }
                catch (Exception ignored) {}
            }
        }
        if (soLo != null) row.setSoLo(soLo.isBlank() ? null : soLo.trim());

        if (idSanPham != null) {
            sanPhamRepository.findById(idSanPham)
                .orElseThrow(() -> new BusinessException("SP không tồn tại"));
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
                if ("LOI".equals(row.getTrangThai()) && row.getIdSanPham() != null) {
                    row.setTrangThai("OK");
                    row.setLoi(null);
                }
            }
        }
        if (giaNhap != null) row.setGiaNhap(giaNhap);

        return phieuNhapTamRepository.save(row);
    }

    @Transactional
    public void deleteRow(Integer rowId) {
        if (!phieuNhapTamRepository.existsById(rowId))
            throw new BusinessException("Dòng không tồn tại");
        phieuNhapTamRepository.deleteById(rowId);
    }

    @Transactional
    public PhieuNhapTam addRow(String sessionId, Map<String, Object> body) {
        if (!phieuNhapTamRepository.existsByIdSession(sessionId))
            throw new BusinessException("Session không tồn tại");

        PhieuNhapTam row = new PhieuNhapTam();
        row.setIdSession(sessionId);
        row.setNgayTao(LocalDateTime.now());
        row.setDongSo(9999);

        String tenSp = body.get("tenSanPhamCsv") != null ? body.get("tenSanPhamCsv").toString() : null;
        row.setTenSanPhamCsv(tenSp);

        if (body.get("ghiChu") != null) row.setGhiChu(body.get("ghiChu").toString());

        if (body.get("giaNhap") != null && !body.get("giaNhap").toString().isBlank())
            row.setGiaNhap(new BigDecimal(body.get("giaNhap").toString()));

        if (body.get("soLuong") == null) {
            row.setTrangThai("LOI");
            row.setLoi("Thiếu số lượng");
            return phieuNhapTamRepository.save(row);
        }
        int sl = Integer.parseInt(body.get("soLuong").toString());
        if (sl <= 0) {
            row.setTrangThai("LOI");
            row.setLoi("Số lượng phải > 0");
            return phieuNhapTamRepository.save(row);
        }
        row.setSoLuong(sl);

        if (body.get("idSanPham") != null && !body.get("idSanPham").toString().isBlank()) {
            Integer idSp = Integer.parseInt(body.get("idSanPham").toString());
            boolean exists = sanPhamRepository.existsById(idSp);
            row.setIdSanPham(idSp);
            row.setTrangThai(exists ? "OK" : "LOI");
            if (!exists) row.setLoi("SP không tồn tại");
        } else {
            row.setTrangThai("CHUA_MAP");
            row.setLoi("Chưa có ID SP");
        }
        return phieuNhapTamRepository.save(row);
    }

    @Transactional
    public PhieuNhapKho confirmImport(String sessionId, Integer nhanVienId,
                                       String nhaCungCap, String ghiChu) {
        List<PhieuNhapTam> rows = phieuNhapTamRepository.findByIdSessionOrderByDongSoAsc(sessionId);
        if (rows.isEmpty()) throw new BusinessException("Session không tồn tại");

        List<PhieuNhapTam> okRows = rows.stream().filter(r -> "OK".equals(r.getTrangThai())).toList();
        if (okRows.isEmpty()) throw new BusinessException("Không có dòng hợp lệ");

        PhieuNhapKho phieu = new PhieuNhapKho();
        phieu.setMaPhieu(generateMaPhieu());
        phieu.setIdNhanVien(nhanVienId);
        phieu.setNhaCungCap(nhaCungCap);
        phieu.setNgayNhap(LocalDateTime.now());
        phieu.setGhiChu(ghiChu);
        phieu.setTrangThai("DA_NHAP");

        List<ChiTietPhieuNhap> chiTiet = new ArrayList<>();
        for (PhieuNhapTam row : okRows) {
            SanPham sp = sanPhamRepository.findById(row.getIdSanPham())
                .orElseThrow(() -> new BusinessException("SP không tồn tại"));

            int tonCu = sp.getSoLuongTonKho() == null ? 0 : sp.getSoLuongTonKho();
            int tonMoi = tonCu + row.getSoLuong();
            sp.setSoLuongTonKho(tonMoi);
            sanPhamRepository.save(sp);

            ChiTietPhieuNhap ct = new ChiTietPhieuNhap();
            ct.setPhieuNhap(phieu);
            ct.setIdSanPham(sp.getIdSanPham());
            ct.setTenSanPhamSnapshot(sp.getTenSanPham());
            ct.setSoLuong(row.getSoLuong());
            ct.setSoLuongThucNhan(row.getSoLuong());
            ct.setSoLuongConLai(row.getSoLuong());
            ct.setSoLuongLoi(0);
            ct.setGiaNhap(row.getGiaNhap());
            ct.setGhiChu(row.getGhiChu());

            // Lấy HSD và số lô trực tiếp từ field, nếu không có thì parse từ ghiChu
            java.time.LocalDate hsd = row.getHanSuDung();
            String soLo = row.getSoLo();
            if ((hsd == null || soLo == null) && row.getGhiChu() != null) {
                for (String part : row.getGhiChu().split("\\|")) {
                    String p = part.trim();
                    if (hsd == null && p.startsWith("HSD:")) {
                        try { hsd = java.time.LocalDate.parse(p.substring(4).trim()); } catch (Exception ignored) {}
                    } else if (soLo == null && p.startsWith("Lô:")) {
                        soLo = p.substring(3).trim();
                    }
                }
            }
            ct.setHanSuDung(hsd);
            ct.setSoLo(soLo);
            chiTiet.add(ct);
        }
        phieu.setChiTiet(chiTiet);
        PhieuNhapKho saved = phieuNhapKhoRepository.save(phieu);

        for (ChiTietPhieuNhap ct : chiTiet) {
            SanPham sp = sanPhamRepository.findById(ct.getIdSanPham()).orElse(null);
            ghiBienDong(ct.getIdSanPham(), ct.getTenSanPhamSnapshot(),
                "NHAP", ct.getSoLuong(),
                sp != null ? sp.getSoLuongTonKho() : null,
                "Nhập kho phiếu " + saved.getMaPhieu(),
                null, saved.getIdPhieu(), nhanVienId);
        }

        phieuNhapTamRepository.deleteByIdSession(sessionId);
        return saved;
    }

    public List<PhieuNhapKho> listPhieuNhap() {
        return phieuNhapKhoRepository.findAllByOrderByNgayNhapDesc();
    }

    public PhieuNhapKho getPhieuNhap(Integer id) {
        return phieuNhapKhoRepository.findById(id)
            .orElseThrow(() -> new BusinessException("Phiếu không tồn tại"));
    }

    public List<BienDongKho> getBienDong(Integer idSanPham) {
        if (idSanPham != null) return bienDongKhoRepository.findByIdSanPhamOrderByNgayTaoDesc(idSanPham);
        return bienDongKhoRepository.findAllByOrderByNgayTaoDesc();
    }

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

    public Map<String, Object> validateHSD(LocalDate hanSuDung) {
        Map<String, Object> result = new HashMap<>();
        result.put("valid", true);
        result.put("warning", false);
        result.put("message", "");

        if (hanSuDung == null) {
            result.put("valid", false);
            result.put("message", "HSD không được trống");
            return result;
        }

        LocalDate today = LocalDate.now();
        if (hanSuDung.isBefore(today)) {
            result.put("valid", false);
            result.put("message", "HSD không được trong quá khứ");
            return result;
        }

        long daysRemaining = ChronoUnit.DAYS.between(today, hanSuDung);
        if (daysRemaining < 180) {
            result.put("warning", true);
            result.put("warningDays", daysRemaining);
            result.put("message", "⚠️ HSD còn " + daysRemaining + " ngày");
        }

        return result;
    }
 // lấy danh sách các lô sắp hết hạn trong 3 tháng tới
    public List<Map<String, Object>> getNearExpiryBatches(int limit) {
        LocalDate today = LocalDate.now();
        LocalDate threshold = today.plusMonths(3);
        // Query trực tiếp các lô còn hàng sắp hết hạn (thay cho findAll + lọc trong Java)
        List<ChiTietPhieuNhap> batches = phieuNhapKhoRepository.findLoSapHetHan(today, threshold);

        return batches.stream()
            .limit(limit)
            .map(ct -> {
                SanPham sp = sanPhamRepository.findById(ct.getIdSanPham()).orElse(null);
                Map<String, Object> m = new HashMap<>();
                m.put("idChiTiet", ct.getId());
                m.put("idSanPham", ct.getIdSanPham());
                m.put("tenSanPham", ct.getTenSanPhamSnapshot());
                m.put("soLo", ct.getSoLo());
                m.put("hanSuDung", ct.getHanSuDung());
                m.put("soLuongConLai", ct.getSoLuongConLai());
                m.put("daysRemaining", ChronoUnit.DAYS.between(LocalDate.now(), ct.getHanSuDung()));
                if (sp != null) m.put("urlHinhAnh", sp.getUrlHinhAnh());
                return m;
            })
            .collect(java.util.stream.Collectors.toList());
    }

    private List<PhieuNhapTam> parseCsv(MultipartFile file, String sessionId) throws IOException {
        List<PhieuNhapTam> rows = new ArrayList<>();
        try (Reader reader = new InputStreamReader(file.getInputStream(), StandardCharsets.UTF_8);
             CSVParser parser = CSVFormat.DEFAULT.builder()
                     .setHeader().setSkipHeaderRecord(true).setTrim(true).build().parse(reader)) {
            int dong = 1;
            for (CSVRecord record : parser) {
                dong++;
                // Support both old format (snake_case) and new format (camelCase) from csvFormatUtils
                String idSp = safeGet(record, "id_san_pham");
                
                String tenSp = safeGet(record, "ten_san_pham");
                if (tenSp == null || tenSp.isEmpty()) {
                    tenSp = safeGet(record, "tenSanPham");  // New format
                }
                
                String soLuong = safeGet(record, "so_luong");
                if (soLuong == null || soLuong.isEmpty()) {
                    soLuong = safeGet(record, "soLuongCoTheCungCap");  // New format
                }
                
                String giaNhap = safeGet(record, "gia_nhap");
                if (giaNhap == null || giaNhap.isEmpty()) {
                    giaNhap = safeGet(record, "giaDeXuat");  // New format (gia de xuat ~ gia nhap)
                }
                
                String ghiChu = safeGet(record, "ghi_chu");
                if (ghiChu == null || ghiChu.isEmpty()) {
                    ghiChu = safeGet(record, "ghiChu");  // New format
                }
                
                // Additional fields from new format
                String hanSuDung = safeGet(record, "hanSuDung");
                if (hanSuDung == null || hanSuDung.isEmpty()) {
                    hanSuDung = safeGet(record, "han_su_dung");  // Old format
                }
                
                String soLo = safeGet(record, "soLo");
                if (soLo == null || soLo.isEmpty()) {
                    soLo = safeGet(record, "so_lo");  // Old format
                }
                
                PhieuNhapTam row = buildRowFromValues(sessionId, dong, idSp, tenSp, soLuong, giaNhap, ghiChu, hanSuDung, soLo);
                rows.add(row);
            }
        }
        return rows;
    }

    private List<PhieuNhapTam> parseExcel(MultipartFile file, String sessionId) throws IOException {
        List<PhieuNhapTam> rows = new ArrayList<>();
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
                PhieuNhapTam tam = buildRowFromValues(sessionId, i + 1,
                    cellStr(row, colMap.getOrDefault("id_san_pham", -1)),
                    cellStr(row, colMap.getOrDefault("ten_san_pham", -1)),
                    cellStr(row, colMap.getOrDefault("so_luong", -1)),
                    cellStr(row, colMap.getOrDefault("gia_nhap", -1)),
                    cellStr(row, colMap.getOrDefault("ghi_chu", -1)),
                    cellStr(row, colMap.getOrDefault("han_su_dung", colMap.getOrDefault("hansudung", -1))),
                    cellStr(row, colMap.getOrDefault("so_lo", colMap.getOrDefault("solo", -1))));
                rows.add(tam);
            }
        }
        return rows;
    }


// lấy dữ liệu từ CSV/Excel và build thành PhieuNhapTam
    private PhieuNhapTam buildRowFromValues(String sessionId, int dong,
            String idSpStr, String tenSp, String slStr, String giaNhapStr, String ghiChu,
            String hanSuDungStr, String soLo) {
        PhieuNhapTam row = new PhieuNhapTam();
        row.setIdSession(sessionId);
        row.setDongSo(dong);
        row.setNgayTao(LocalDateTime.now());
        row.setGhiChu(ghiChu);

        if (idSpStr != null && !idSpStr.isBlank()) {
            try { row.setIdSanPham(Integer.parseInt(idSpStr.trim())); } catch (Exception ignored) {}
        }
        row.setTenSanPhamCsv(tenSp != null ? tenSp.trim() : null);

        if (slStr == null || slStr.isBlank()) {
            row.setTrangThai("LOI"); row.setLoi("Thiếu số lượng"); return row;
        }
        try {
            int sl = (int) Double.parseDouble(slStr.trim());
            if (sl <= 0) { row.setTrangThai("LOI"); row.setLoi("SL > 0"); return row; }
            row.setSoLuong(sl);
        } catch (Exception e) {
            row.setTrangThai("LOI");
            row.setLoi("SL không hợp lệ");
            return row;
        }

        if (giaNhapStr != null && !giaNhapStr.isBlank()) {
            try { row.setGiaNhap(new BigDecimal(giaNhapStr.trim())); } catch (Exception ignored) {}
        }

        // Note: hanSuDung and soLo are parsed from CSV — lưu vào field riêng
        if (hanSuDungStr != null && !hanSuDungStr.isBlank()) {
            try {
                row.setHanSuDung(java.time.LocalDate.parse(hanSuDungStr.trim()));
            } catch (Exception ignored) {
                // format không đúng YYYY-MM-DD, bỏ qua
            }
        }
        if (soLo != null && !soLo.isBlank()) {
            row.setSoLo(soLo.trim());
        }

        row.setTrangThai("CHUA_MAP");
        if (row.getIdSanPham() != null) row.setTrangThai("OK");
        return row;
    }

    private String safeGet(CSVRecord record, String key) {
        try { return record.get(key); } catch (Exception e) { return null; }
    }

    private String cellStr(Row row, Integer colIdx) {
        if (row == null || colIdx == null || colIdx < 0) return null;
        Cell cell = row.getCell(colIdx);
        if (cell == null) return null;
        if (cell.getCellType() == CellType.STRING) return cell.getStringCellValue().trim();
        if (cell.getCellType() == CellType.NUMERIC) {
            if (org.apache.poi.ss.usermodel.DateUtil.isCellDateFormatted(cell)) {
                // Cell là ngày → format về YYYY-MM-DD để parse HSD
                return new java.text.SimpleDateFormat("yyyy-MM-dd").format(cell.getDateCellValue());
            }
            return String.valueOf((long) cell.getNumericCellValue());
        }
        return null;
    }

    private String generateMaPhieu() {
        String prefix = "PN" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd"));
        long count = phieuNhapKhoRepository.countByMaPhieuStartingWith(prefix);
        return prefix + String.format("%04d", count + 1);
    }

    public List<Map<String, Object>> getLoHang(Integer idSanPhamFilter, boolean conHang) {
        List<PhieuNhapKho> allPhieus = phieuNhapKhoRepository.findByTrangThai("DA_NHAP");
        List<Map<String, Object>> result = new ArrayList<>();

        for (PhieuNhapKho phieu : allPhieus) {
            for (ChiTietPhieuNhap ct : phieu.getChiTiet()) {
                if (idSanPhamFilter != null && !idSanPhamFilter.equals(ct.getIdSanPham())) continue;
                if (conHang && (ct.getSoLuongConLai() == null || ct.getSoLuongConLai() <= 0)) continue;

                Map<String, Object> m = new java.util.LinkedHashMap<>();
                m.put("idChiTiet", ct.getId());
                m.put("idSanPham", ct.getIdSanPham());
                m.put("tenSanPham", ct.getTenSanPhamSnapshot());
                m.put("soLo", ct.getSoLo());
                m.put("hanSuDung", ct.getHanSuDung());
                m.put("soLuongNhap", ct.getSoLuongThucNhan() != null ? ct.getSoLuongThucNhan() : ct.getSoLuong());
                m.put("soLuongConLai", ct.getSoLuongConLai() != null ? ct.getSoLuongConLai() : 0);
                m.put("soLuongLoi", ct.getSoLuongLoi() != null ? ct.getSoLuongLoi() : 0);
                m.put("giaNhap", ct.getGiaNhap());
                m.put("maPO", phieu.getMaPhieu());
                m.put("nhaCungCap", phieu.getNhaCungCap());
                m.put("ngayNhap", phieu.getNgayNhap());

                // Trạng thái lô
                if (ct.getHanSuDung() != null) {
                    long days = ChronoUnit.DAYS.between(LocalDate.now(), ct.getHanSuDung());
                    if (days < 0) m.put("hsdStatus", "HET_HAN");
                    else if (days <= 30) m.put("hsdStatus", "SAP_HET_DO");
                    else if (days <= 90) m.put("hsdStatus", "SAP_HET_CAM");
                    else m.put("hsdStatus", "CON_HAN");
                    m.put("daysRemaining", days);
                } else {
                    m.put("hsdStatus", "KHONG_CO");
                    m.put("daysRemaining", null);
                }

                SanPham sp = sanPhamRepository.findById(ct.getIdSanPham()).orElse(null);
                if (sp != null) m.put("urlHinhAnh", sp.getUrlHinhAnh());

                result.add(m);
            }
        }

        // Sắp xếp: theo SP, rồi theo HSD tăng dần (FEFO)
        result.sort((a, b) -> {
            int cmp = String.valueOf(a.get("idSanPham")).compareTo(String.valueOf(b.get("idSanPham")));
            if (cmp != 0) return cmp;
            LocalDate ha = (LocalDate) a.get("hanSuDung");
            LocalDate hb = (LocalDate) b.get("hanSuDung");
            if (ha == null && hb == null) return 0;
            if (ha == null) return 1;
            if (hb == null) return -1;
            return ha.compareTo(hb);
        });

        return result;
    }

    public List<PhieuNhapKho> getPoChoKhoKiemTra() {
        return phieuNhapKhoRepository.findByTrangThai("CHO_KHO_KIEM_TRA");
    }



    public List<PhieuNhapKho> getPoChoAdminDuyet() {
        return phieuNhapKhoRepository.findByTrangThai("CHO_ADMIN_DUYET");
    }

    public List<Map<String, Object>> getSlowMoving(int days, int limit) {
        LocalDate threshold = LocalDate.now().minusDays(days);
        List<SanPham> slowMoving = sanPhamRepository.findAll().stream()
            .filter(sp -> sp.getSoLuongTonKho() != null && sp.getSoLuongTonKho() > 0)
            .sorted((a, b) -> {
                Integer aTon = a.getSoLuongTonKho() != null ? a.getSoLuongTonKho() : 0;
                Integer bTon = b.getSoLuongTonKho() != null ? b.getSoLuongTonKho() : 0;
                return bTon.compareTo(aTon);
            })
            .limit(limit)
            .toList();

        return slowMoving.stream()
            .map(sp -> {
                Map<String, Object> m = new HashMap<>();
                m.put("idSanPham", sp.getIdSanPham());
                m.put("tenSanPham", sp.getTenSanPham());
                m.put("soLuongTon", sp.getSoLuongTonKho());
                m.put("urlHinhAnh", sp.getUrlHinhAnh());
                m.put("giaBan", sp.getGiaBan());
                return m;
            })
            .collect(java.util.stream.Collectors.toList());
    }

}
