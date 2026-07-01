package com.example.perfumeshop.controller;

import com.example.perfumeshop.entity.BienDongKho;
import com.example.perfumeshop.entity.PhieuNhapKho;
import com.example.perfumeshop.entity.PhieuNhapTam;
import com.example.perfumeshop.service.KhoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/kho")
@CrossOrigin(origins = "*")
public class KhoController {

    @Autowired
    private KhoService khoService;

    // ── PO Workflow: Kho xác nhận → Admin duyệt ──────────────────────────

    /** GET /api/kho/po-cho-kiem-tra — PO đang chờ kho kiểm tra */
    @GetMapping("/po-cho-kiem-tra")
    public ResponseEntity<List<PhieuNhapKho>> getPoChoKiemTra() {
        return ResponseEntity.ok(khoService.getPoChoKhoKiemTra());
    }

    /** GET /api/kho/po-cho-admin-duyet — PO đang chờ admin duyệt cuối */
    @GetMapping("/po-cho-admin-duyet")
    public ResponseEntity<List<PhieuNhapKho>> getPoChoAdminDuyet() {
        return ResponseEntity.ok(khoService.getPoChoAdminDuyet());
    }

    /**
     * POST /api/kho/po/{id}/kho-xac-nhan
     * Body: { nhanVienId, chiTiet: [{ idChiTiet, soLuongThucNhan, soLuongLoi, urlHinhAnhMoi, ghiChuKho }] }
     */
    @PostMapping("/po/{id}/kho-xac-nhan")
    public ResponseEntity<PhieuNhapKho> khoXacNhan(
            @PathVariable Integer id,
            @RequestBody Map<String, Object> body) {
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> chiTiet = (List<Map<String, Object>>) body.get("chiTiet");
        Integer nhanVienId = body.get("nhanVienId") != null
            ? Integer.parseInt(body.get("nhanVienId").toString()) : null;
        return ResponseEntity.ok(khoService.khoXacNhan(id, chiTiet, nhanVienId));
    }

    /**
     * POST /api/kho/po/{id}/admin-duyet-cuoi
     * Body: { nhanVienId }
     */
    @PostMapping("/po/{id}/admin-duyet-cuoi")
    public ResponseEntity<PhieuNhapKho> adminDuyetCuoi(
            @PathVariable Integer id,
            @RequestBody(required = false) Map<String, Object> body) {
        Integer nhanVienId = (body != null && body.get("nhanVienId") != null)
            ? Integer.parseInt(body.get("nhanVienId").toString()) : null;
        return ResponseEntity.ok(khoService.adminDuyetCuoi(id, nhanVienId));
    }

    /**
     * POST /api/kho/po/{id}/admin-tu-choi
     * Body: { lyDo, nhanVienId }
     */
    @PostMapping("/po/{id}/admin-tu-choi")
    public ResponseEntity<PhieuNhapKho> adminTuChoi(
            @PathVariable Integer id,
            @RequestBody Map<String, Object> body) {
        String lyDo = (String) body.get("lyDo");
        Integer nhanVienId = body.get("nhanVienId") != null
            ? Integer.parseInt(body.get("nhanVienId").toString()) : null;
        return ResponseEntity.ok(khoService.adminTuChoi(id, lyDo, nhanVienId));
    }

    // ── Import CSV/Excel → staging ─────────────────────────────────────────

    /**
     * POST /api/kho/import-preview
     * Form-data: file (CSV hoặc xlsx)
     * Trả về sessionId + danh sách dòng preview
     */
    @PostMapping("/import-preview")
    public ResponseEntity<Map<String, Object>> importPreview(
            @RequestParam("file") MultipartFile file) throws Exception {
        return ResponseEntity.ok(khoService.importPreview(file));
    }

    /** GET /api/kho/import-preview/{sessionId} — lấy lại preview đã upload */
    @GetMapping("/import-preview/{sessionId}")
    public ResponseEntity<List<PhieuNhapTam>> getPreview(@PathVariable String sessionId) {
        return ResponseEntity.ok(khoService.getPreview(sessionId));
    }

    /** PUT /api/kho/import-preview/row/{rowId} — admin sửa tất cả field của dòng */
    @PutMapping("/import-preview/row/{rowId}")
    public ResponseEntity<PhieuNhapTam> updateRow(
            @PathVariable Integer rowId,
            @RequestBody Map<String, Object> body) {
        Integer idSanPham  = body.get("idSanPham")  != null ? Integer.parseInt(body.get("idSanPham").toString())  : null;
        Integer soLuong    = body.get("soLuong")    != null ? Integer.parseInt(body.get("soLuong").toString())    : null;
        BigDecimal giaNhap = body.get("giaNhap")    != null ? new BigDecimal(body.get("giaNhap").toString())      : null;
        String tenSp       = body.get("tenSanPhamCsv") != null ? body.get("tenSanPhamCsv").toString() : null;
        String ghiChu      = body.get("ghiChu")     != null ? body.get("ghiChu").toString()      : null;
        String hanSuDung   = body.get("hanSuDung")  != null ? body.get("hanSuDung").toString()   : null;
        String soLo        = body.get("soLo")       != null ? body.get("soLo").toString()        : null;
        return ResponseEntity.ok(khoService.updateRow(rowId, idSanPham, soLuong, giaNhap, tenSp, ghiChu, hanSuDung, soLo));
    }

    /** DELETE /api/kho/import-preview/row/{rowId} — xóa dòng khỏi staging */
    @DeleteMapping("/import-preview/row/{rowId}")
    public ResponseEntity<Void> deleteRow(@PathVariable Integer rowId) {
        khoService.deleteRow(rowId);
        return ResponseEntity.noContent().build();
    }

    /** POST /api/kho/import-preview/{sessionId}/row — thêm dòng thủ công */
    @PostMapping("/import-preview/{sessionId}/row")
    public ResponseEntity<PhieuNhapTam> addRow(@PathVariable String sessionId,
                                                @RequestBody Map<String, Object> body) {
        return ResponseEntity.ok(khoService.addRow(sessionId, body));
    }

    /**
     * POST /api/kho/import-confirm
     * Body: { sessionId, nhanVienId, nhaCungCap, ghiChu }
     * Duyệt → cộng kho + tạo phiếu chính thức + xóa staging
     */
    @PostMapping("/import-confirm")
    public ResponseEntity<PhieuNhapKho> confirmImport(@RequestBody Map<String, Object> body) {
        String sessionId   = (String) body.get("sessionId");
        Integer nhanVienId = body.get("nhanVienId") != null ? Integer.parseInt(body.get("nhanVienId").toString()) : null;
        String nhaCungCap  = (String) body.get("nhaCungCap");
        String ghiChu      = (String) body.get("ghiChu");
        return ResponseEntity.ok(khoService.confirmImport(sessionId, nhanVienId, nhaCungCap, ghiChu));
    }

    // ── Lịch sử phiếu nhập ────────────────────────────────────────────────

    @GetMapping("/phieu-nhap")
    public ResponseEntity<List<PhieuNhapKho>> listPhieuNhap() {
        return ResponseEntity.ok(khoService.listPhieuNhap());
    }

    @GetMapping("/phieu-nhap/{id}")
    public ResponseEntity<PhieuNhapKho> getPhieuNhap(@PathVariable Integer id) {
        return ResponseEntity.ok(khoService.getPhieuNhap(id));
    }

    // ── Biến động kho ─────────────────────────────────────────────────────

    /** GET /api/kho/bien-dong?idSanPham=1 — lịch sử 1 SP; bỏ param → tất cả */
    @GetMapping("/bien-dong")
    public ResponseEntity<List<BienDongKho>> getBienDong(
            @RequestParam(value = "idSanPham", required = false) Integer idSanPham) {
        return ResponseEntity.ok(khoService.getBienDong(idSanPham));
    }

    // ── Thống kê bán chậm ─────────────────────────────────────────────────

    /** GET /api/kho/ban-cham?days=30&limit=20 */
    @GetMapping("/ban-cham")
    public ResponseEntity<List<Map<String, Object>>> getBanCham(
            @RequestParam(value = "days",  defaultValue = "30")  int days,
            @RequestParam(value = "limit", defaultValue = "20")  int limit) {
        return ResponseEntity.ok(khoService.getSlowMoving(days, limit));
    }

    // ── Cảnh báo cận Date ──────────────────────────────────────────────────

    /** GET /api/kho/cang-het-han?limit=10 — Top N lô sắp hết hạn */
    @GetMapping("/cang-het-han")
    public ResponseEntity<List<Map<String, Object>>> getNearExpiryBatches(
            @RequestParam(value = "limit", defaultValue = "10")  int limit) {
        return ResponseEntity.ok(khoService.getNearExpiryBatches(limit));
    }

    /** GET /api/kho/near-expiry?limit=10 — Alias for getNearExpiryBatches */
    @GetMapping("/near-expiry")
    public ResponseEntity<List<Map<String, Object>>> getNearExpiryBatches2(
            @RequestParam(value = "limit", defaultValue = "10")  int limit) {
        return ResponseEntity.ok(khoService.getNearExpiryBatches(limit));
    }

    /** POST /api/kho/validate-hsd — Kiểm tra HSD hợp lệ */
    @PostMapping("/validate-hsd")
    public ResponseEntity<Map<String, Object>> validateHSD(@RequestBody Map<String, Object> body) {
        String hsdStr = (String) body.get("hanSuDung");
        java.time.LocalDate hsd = hsdStr != null ? java.time.LocalDate.parse(hsdStr) : null;
        return ResponseEntity.ok(khoService.validateHSD(hsd));
    }

    /**
     * GET /api/kho/lo-hang — Toàn bộ lô hàng, group theo sản phẩm
     * Optional: ?idSanPham=1 để lọc 1 SP, ?conHang=true chỉ lấy lô còn tồn
     */
    @GetMapping("/lo-hang")
    public ResponseEntity<List<Map<String, Object>>> getLoHang(
            @RequestParam(value = "idSanPham", required = false) Integer idSanPham,
            @RequestParam(value = "conHang",   defaultValue = "false") boolean conHang) {
        return ResponseEntity.ok(khoService.getLoHang(idSanPham, conHang));
    }
}
