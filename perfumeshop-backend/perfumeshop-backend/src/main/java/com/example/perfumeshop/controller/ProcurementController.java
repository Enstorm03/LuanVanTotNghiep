package com.example.perfumeshop.controller;

import com.example.perfumeshop.entity.BaoGiaNCC;
import com.example.perfumeshop.entity.PhieuGoiThau;
import com.example.perfumeshop.entity.SanPham;
import com.example.perfumeshop.entity.SanPhamDeXuat;
import com.example.perfumeshop.service.ProcurementService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/procurement")
@CrossOrigin(origins = "*")
public class ProcurementController {

    @Autowired
    private ProcurementService procurementService;

    // ── PUBLIC / NCC ─────────────────────────────────────────────────────

    /** GET /api/procurement/public — Các phiếu đang mở, NCC xem để chào giá */
    @GetMapping("/public")
    public ResponseEntity<List<PhieuGoiThau>> getDangMo() {
        return ResponseEntity.ok(procurementService.getDanhSachDangMo());
    }

    /** GET /api/procurement/public/{id} — Chi tiết phiếu (NCC xem) */
    @GetMapping("/public/{id}")
    public ResponseEntity<PhieuGoiThau> getChiTietPublic(@PathVariable Integer id) {
        return ResponseEntity.ok(procurementService.getById(id));
    }

    /**
     * POST /api/procurement/{id}/bao-gia — NCC gửi báo giá
     * Body: { tenNCC, lienHeNCC, giaNhapDeXuat, ghiChu }
     */
    @PostMapping("/{id}/bao-gia")
    public ResponseEntity<BaoGiaNCC> guiBaoGia(@PathVariable Integer id,
                                                @RequestBody Map<String, Object> body) {
        String tenNCC        = (String) body.get("tenNCC");
        String lienHeNCC     = (String) body.getOrDefault("lienHeNCC", "");
        BigDecimal giaNhap   = new BigDecimal(body.get("giaNhapDeXuat").toString());
        String ghiChu        = (String) body.getOrDefault("ghiChu", "");
        return ResponseEntity.ok(procurementService.guiBaoGia(id, tenNCC, lienHeNCC, giaNhap, ghiChu));
    }

    // ── ADMIN ─────────────────────────────────────────────────────────────

    /** GET /api/procurement — Tất cả phiếu gọi thầu */
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getTatCa() {
        List<Map<String, Object>> result = procurementService.getTatCa().stream().map(p -> {
            Map<String, Object> m = new java.util.LinkedHashMap<>();
            m.put("idPhieuGoiThau", p.getIdPhieuGoiThau());
            m.put("maPhieu",        p.getMaPhieu());
            m.put("trangThai",      p.getTrangThai());
            m.put("ghiChu",         p.getGhiChu());
            m.put("hanChot",        p.getHanChot());
            m.put("ngayTao",        p.getNgayTao());
            m.put("soLuongSanPham", p.getDanhSachSanPham() != null ? p.getDanhSachSanPham().size() : 0);
            return m;
        }).toList();
        return ResponseEntity.ok(result);
    }

    /** GET /api/procurement/{id} — Chi tiết phiếu (admin) */
    @GetMapping("/{id}")
    public ResponseEntity<PhieuGoiThau> getChiTiet(@PathVariable Integer id) {
        return ResponseEntity.ok(procurementService.getById(id));
    }

    /**
     * GET /api/procurement/sap-het-kho?nguong=5
     * Danh sách SP sắp hết, hiển thị trong modal tạo phiếu
     */
    @GetMapping("/sap-het-kho")
    public ResponseEntity<List<Map<String, Object>>> getSapHetKho(
            @RequestParam(defaultValue = "5") int nguong) {
        return ResponseEntity.ok(procurementService.getDanhSachSapHetKho(nguong));
    }

    /**
     * POST /api/procurement/tao-phieu — Admin tạo phiếu gọi thầu
     * Body: { idNhanVien, ghiChu, hanChot, danhSachSanPham: [{ idSanPham, soLuongCanNhap, ghiChu }] }
     */
    @PostMapping("/tao-phieu")
    public ResponseEntity<PhieuGoiThau> taoPhieu(@RequestBody Map<String, Object> body) {
        Integer idNhanVien = body.get("idNhanVien") != null
            ? Integer.parseInt(body.get("idNhanVien").toString()) : 1;
        String ghiChu = (String) body.getOrDefault("ghiChu", "");
        LocalDate hanChot = body.get("hanChot") != null
            ? LocalDate.parse(body.get("hanChot").toString()) : null;
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> danhSach = (List<Map<String, Object>>) body.get("danhSachSanPham");
        return ResponseEntity.ok(procurementService.taoPhieuGoiThau(idNhanVien, ghiChu, hanChot, danhSach));
    }

    /** GET /api/procurement/{id}/bao-gia — Tất cả báo giá của 1 phiếu */
    @GetMapping("/{id}/bao-gia")
    public ResponseEntity<List<BaoGiaNCC>> getDanhSachBaoGia(@PathVariable Integer id) {
        return ResponseEntity.ok(procurementService.getDanhSachBaoGia(id));
    }

    /**
     * POST /api/procurement/{id}/chot-thau/{idBaoGia} — Admin chốt thầu
     * Body: { phanTramBienDo: 20, idNhanVien: 1 }
     */
    @PostMapping("/{id}/chot-thau/{idBaoGia}")
    public ResponseEntity<BaoGiaNCC> chotThau(@PathVariable Integer id,
                                               @PathVariable Integer idBaoGia,
                                               @RequestBody Map<String, Object> body) {
        BigDecimal pct = body.get("phanTramBienDo") != null
            ? new BigDecimal(body.get("phanTramBienDo").toString()) : BigDecimal.ZERO;
        Integer idNhanVien = body.get("idNhanVien") != null
            ? Integer.parseInt(body.get("idNhanVien").toString()) : 1;
        return ResponseEntity.ok(procurementService.chotThau(id, idBaoGia, pct, idNhanVien));
    }

    // ── NCC đề xuất sản phẩm mới ──────────────────────────────────────────

    /**
     * POST /api/procurement/{id}/de-xuat-san-pham — NCC đề xuất SP mới TRONG phiếu gọi thầu
     * Body: { tenNCC, lienHeNCC, tenSanPham, moTa, urlHinhAnh,
     *         giaDeXuat, soLuongCoTheCungCap, dungTichMl, nongDo, ghiChu }
     */
    @PostMapping("/{id}/de-xuat-san-pham")
    public ResponseEntity<SanPhamDeXuat> deXuatSanPham(@PathVariable Integer id,
                                                         @RequestBody Map<String, Object> body) {
        String tenNCC       = (String) body.get("tenNCC");
        String lienHeNCC    = (String) body.getOrDefault("lienHeNCC", "");
        String tenSanPham   = (String) body.get("tenSanPham");
        String moTa         = (String) body.getOrDefault("moTa", "");
        String urlHinhAnh   = (String) body.getOrDefault("urlHinhAnh", "");
        BigDecimal giaDeXuat = body.get("giaDeXuat") != null
            ? new BigDecimal(body.get("giaDeXuat").toString()) : null;
        Integer soLuong     = body.get("soLuongCoTheCungCap") != null
            ? Integer.parseInt(body.get("soLuongCoTheCungCap").toString()) : null;
        Integer dungTichMl  = body.get("dungTichMl") != null
            ? Integer.parseInt(body.get("dungTichMl").toString()) : null;
        Integer nongDo      = body.get("nongDo") != null
            ? Integer.parseInt(body.get("nongDo").toString()) : null;
        String ghiChu       = (String) body.getOrDefault("ghiChu", "");
        return ResponseEntity.ok(procurementService.deXuatSanPham(id, tenNCC, lienHeNCC,
            tenSanPham, moTa, urlHinhAnh, giaDeXuat, soLuong, dungTichMl, nongDo, ghiChu));
    }

    // ── NCC tự đề xuất SP độc lập (KHÔNG cần phiếu gọi thầu) ──────────────

    /**
     * POST /api/procurement/de-xuat-san-pham-doc-lap — NCC tự đề xuất sản phẩm mới
     * Không yêu cầu id phiếu gọi thầu. Body giống hệt như đề xuất có phiếu
     * nhưng không có path variable id.
     */
    @PostMapping("/de-xuat-san-pham-doc-lap")
    public ResponseEntity<SanPhamDeXuat> deXuatSanPhamDocLap(@RequestBody Map<String, Object> body) {
        String tenNCC       = (String) body.get("tenNCC");
        String lienHeNCC    = (String) body.getOrDefault("lienHeNCC", "");
        String tenSanPham   = (String) body.get("tenSanPham");
        String moTa         = (String) body.getOrDefault("moTa", "");
        String urlHinhAnh   = (String) body.getOrDefault("urlHinhAnh", "");
        BigDecimal giaDeXuat = body.get("giaDeXuat") != null
            ? new BigDecimal(body.get("giaDeXuat").toString()) : null;
        Integer soLuong     = body.get("soLuongCoTheCungCap") != null
            ? Integer.parseInt(body.get("soLuongCoTheCungCap").toString()) : null;
        Integer dungTichMl  = body.get("dungTichMl") != null
            ? Integer.parseInt(body.get("dungTichMl").toString()) : null;
        Integer nongDo      = body.get("nongDo") != null
            ? Integer.parseInt(body.get("nongDo").toString()) : null;
        String ghiChu       = (String) body.getOrDefault("ghiChu", "");
        return ResponseEntity.ok(procurementService.deXuatSanPhamDocLap(tenNCC, lienHeNCC,
            tenSanPham, moTa, urlHinhAnh, giaDeXuat, soLuong, dungTichMl, nongDo, ghiChu));
    }

    // ── NCC đề xuất hàng loạt qua Excel/CSV ──────────────────────────────

    /**
     * POST /api/procurement/bulk-preview
     * Form-data: file (xlsx/csv), tenNCC, lienHeNCC
     * Trả về sessionId + danh sách preview (validate, chưa commit)
     */
    @PostMapping(value = "/bulk-preview", consumes = "multipart/form-data")
    public ResponseEntity<Map<String, Object>> bulkPreview(
            @RequestParam("file")      MultipartFile file,
            @RequestParam("tenNCC")    String tenNCC,
            @RequestParam(value = "lienHeNCC", defaultValue = "") String lienHeNCC) throws Exception {
        return ResponseEntity.ok(procurementService.bulkDeXuatPreview(file, tenNCC, lienHeNCC));
    }

    /**
     * POST /api/procurement/bulk-confirm
     * Body: { sessionId }
     * Commit các dòng OK → tạo SanPhamDeXuat (PENDING)
     */
    @PostMapping("/bulk-confirm")
    public ResponseEntity<Map<String, Object>> bulkConfirm(@RequestBody Map<String, Object> body) {
        String sessionId = (String) body.get("sessionId");
        return ResponseEntity.ok(procurementService.bulkDeXuatConfirm(sessionId));
    }

    // ── Admin duyệt / từ chối SP đề xuất ──────────────────────────────────

    /** GET /api/procurement/san-pham-de-xuat/cho-duyet — Tất cả SP đề xuất đang chờ */
    @GetMapping("/san-pham-de-xuat/cho-duyet")
    public ResponseEntity<List<SanPhamDeXuat>> getAllChoDuyet() {
        return ResponseEntity.ok(procurementService.getTatCaSanPhamDeXuatChoDuyet());
    }

    /** GET /api/procurement/{id}/san-pham-de-xuat — SP đề xuất của 1 phiếu */
    @GetMapping("/{id}/san-pham-de-xuat")
    public ResponseEntity<List<SanPhamDeXuat>> getDeXuatCuaPhieu(@PathVariable Integer id) {
        return ResponseEntity.ok(procurementService.getDanhSachSanPhamDeXuat(id));
    }

    // ── Admin quản lý đề xuất độc lập ─────────────────────────────────────

    /** GET /api/procurement/de-xuat-doc-lap — Tất cả đề xuất độc lập */
    @GetMapping("/de-xuat-doc-lap")
    public ResponseEntity<List<SanPhamDeXuat>> getAllDeXuatDocLap(
            @RequestParam(required = false) String trangThai) {
        if (trangThai != null && !trangThai.isBlank()) {
            return ResponseEntity.ok(procurementService.getDeXuatDocLapTheoTrangThai(trangThai));
        }
        return ResponseEntity.ok(procurementService.getTatCaDeXuatDocLap());
    }

    /**
     * POST /api/procurement/san-pham-de-xuat/{id}/duyet — Duyệt, tạo SP mới + PO CHO_KHO_KIEM_TRA
     * Body: { idDanhMuc, idThuongHieu, idNhanVien, phanHoi, phanTramBienDo, soLuongNhap }
     */
    @PostMapping("/san-pham-de-xuat/{id}/duyet")
    public ResponseEntity<SanPham> duyetDeXuat(@PathVariable Integer id,
                                                 @RequestBody Map<String, Object> body) {
        Integer idDanhMuc    = body.get("idDanhMuc")    != null ? Integer.parseInt(body.get("idDanhMuc").toString())    : null;
        Integer idThuongHieu = body.get("idThuongHieu") != null ? Integer.parseInt(body.get("idThuongHieu").toString()) : null;
        Integer idNhanVien   = body.get("idNhanVien")   != null ? Integer.parseInt(body.get("idNhanVien").toString())   : 1;
        String  phanHoi      = (String) body.getOrDefault("phanHoi", "");
        java.math.BigDecimal phanTramBienDo = body.get("phanTramBienDo") != null
            ? new java.math.BigDecimal(body.get("phanTramBienDo").toString()) : java.math.BigDecimal.ZERO;
        Integer soLuongNhap  = body.get("soLuongNhap") != null ? Integer.parseInt(body.get("soLuongNhap").toString()) : null;
        return ResponseEntity.ok(procurementService.duyetSanPhamDeXuat(
            id, idDanhMuc, idThuongHieu, idNhanVien, phanHoi, phanTramBienDo, soLuongNhap));
    }

    /**
     * POST /api/procurement/san-pham-de-xuat/{id}/tu-choi — Từ chối
     * Body: { idNhanVien, lyDo }
     */
    @PostMapping("/san-pham-de-xuat/{id}/tu-choi")
    public ResponseEntity<SanPhamDeXuat> tuChoiDeXuat(@PathVariable Integer id,
                                                       @RequestBody Map<String, Object> body) {
        Integer idNhanVien = body.get("idNhanVien") != null
            ? Integer.parseInt(body.get("idNhanVien").toString()) : 1;
        String lyDo        = (String) body.getOrDefault("lyDo", "");
        return ResponseEntity.ok(procurementService.tuChoiSanPhamDeXuat(id, idNhanVien, lyDo));
    }
}
