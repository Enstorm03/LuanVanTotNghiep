package com.example.perfumeshop.service;

import com.example.perfumeshop.entity.ChiTietDonHang;
import com.example.perfumeshop.exception.BusinessException;
import com.example.perfumeshop.repository.PhieuNhapKhoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import java.util.List;

/**
 * FEFO (First Expired, First Out) Service
 *
 * Khi đặt hàng  → gắn idPhieuNhap lô cận-date nhất (traceability), chưa trừ kho.
 * Khi admin xác nhận → multi-batch deduct:
 *   Lô 1 (HSD sớm nhất) có 36sp, mua 37sp → trừ hết 36, sang lô 2 trừ thêm 1, lô 2 còn 49.
 */
@Service
public class FEFOService {

    @Autowired
    private PhieuNhapKhoRepository phieuNhapKhoRepository;

    @Autowired
    private EntityManager entityManager;

    // ── Giai đoạn 1: Đặt hàng — gắn lô cận-date nhất ──────────────────────

    /**
     * Chạy trong cùng transaction với placeOrder.
     * Chỉ gán idPhieuNhap (traceability), chưa trừ soLuongConLai.
     */
    public void allocateOrderItemFromBatch(ChiTietDonHang chiTietDonHang,
                                           Integer idSanPham, Integer soLuongCan) {
        try {
            List<Integer> batches = phieuNhapKhoRepository.findActiveBatchesByProductFEFO(idSanPham);
            if (batches == null || batches.isEmpty()) return;
            // Gắn lô cận-date nhất để traceability
            chiTietDonHang.setIdPhieuNhap(batches.get(0));
        } catch (Exception ignored) {}
    }

    // ── Giai đoạn 2: Admin xác nhận — multi-batch FEFO deduct ──────────────

    /**
     * Trừ soLuongConLai theo FEFO multi-batch.
     * Ví dụ: mua 37sp, lô1=36 → trừ hết 36, lô2=50 → trừ thêm 1, lô2 còn 49.
     * Ném BusinessException nếu tổng các lô không đủ.
     */
    public void deductFEFOOnConfirm(Integer idSanPham, Integer soLuongCan) {
        // Lấy từng dòng lô của ĐÚNG sản phẩm này, sắp theo HSD sớm nhất (FEFO)
        String selectSql = "SELECT ct.id, ct.so_luong_con_lai " +
                           "FROM Chi_Tiet_Phieu_Nhap ct " +
                           "WHERE ct.id_san_pham = :idSanPham AND ct.so_luong_con_lai > 0 " +
                           "ORDER BY ct.han_su_dung ASC, ct.id ASC";
        Query sq = entityManager.createNativeQuery(selectSql);
        sq.setParameter("idSanPham", idSanPham);
        @SuppressWarnings("unchecked")
        List<Object[]> rows = sq.getResultList();
        if (rows == null || rows.isEmpty()) {
            throw new BusinessException("Không tìm thấy lô hàng cho sản phẩm #" + idSanPham);
        }

        int remaining = soLuongCan;
        for (Object[] r : rows) {
            if (remaining <= 0) break;

            Number rowId = (Number) r[0];
            int available = r[1] != null ? ((Number) r[1]).intValue() : 0;
            if (available <= 0) continue;

            // Lấy tối đa từ dòng lô này, không vượt quá remaining
            int deduct = Math.min(available, remaining);

            String updateSql = "UPDATE Chi_Tiet_Phieu_Nhap " +
                               "SET so_luong_con_lai = so_luong_con_lai - :deduct " +
                               "WHERE id = :rowId " +
                               "  AND so_luong_con_lai >= :deduct";
            Query uq = entityManager.createNativeQuery(updateSql);
            uq.setParameter("deduct", deduct);
            uq.setParameter("rowId", rowId);
            int updated = uq.executeUpdate();
            if (updated > 0) {
                remaining -= deduct;
            }
        }

        if (remaining > 0) {
            throw new BusinessException(
                "Không đủ tồn kho lô hàng cho sản phẩm #" + idSanPham +
                " (còn thiếu " + remaining + " sp)");
        }
    }

    // ── Hoàn kho khi hủy đơn ───────────────────────────────────────────────

    /**
     * Hoàn soLuongConLai về lô được gán lúc đặt hàng.
     * Chỉ hoàn vào dòng lô của ĐÚNG sản phẩm (1 PO có thể chứa nhiều sản phẩm).
     */
    public void restoreBatchStock(Integer idPhieuNhap, Integer idSanPham, Integer soLuongHoan) {
        if (idPhieuNhap == null || idSanPham == null || soLuongHoan == null || soLuongHoan <= 0) return;
        // Tìm 1 dòng chi tiết đúng PO + đúng sản phẩm để hoàn
        String selectSql = "SELECT ct.id FROM Chi_Tiet_Phieu_Nhap ct " +
                           "WHERE ct.id_phieu = :idPhieuNhap AND ct.id_san_pham = :idSanPham " +
                           "ORDER BY ct.id ASC";
        Query sq = entityManager.createNativeQuery(selectSql);
        sq.setParameter("idPhieuNhap", idPhieuNhap);
        sq.setParameter("idSanPham", idSanPham);
        @SuppressWarnings("unchecked")
        List<Object> ids = sq.getResultList();
        if (ids == null || ids.isEmpty()) return;

        String sql = "UPDATE Chi_Tiet_Phieu_Nhap " +
                     "SET so_luong_con_lai = so_luong_con_lai + :soLuong " +
                     "WHERE id = :rowId";
        Query q = entityManager.createNativeQuery(sql);
        q.setParameter("soLuong", soLuongHoan);
        q.setParameter("rowId", ids.get(0));
        q.executeUpdate();
    }
}
