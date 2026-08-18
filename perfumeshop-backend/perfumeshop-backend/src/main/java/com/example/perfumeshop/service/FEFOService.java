package com.example.perfumeshop.service;

import com.example.perfumeshop.dto.PickListDTO;
import com.example.perfumeshop.entity.ChiTietDonHang;
import com.example.perfumeshop.exception.BusinessException;
import com.example.perfumeshop.repository.PhieuNhapKhoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


// FEFO (First Expired, First Out) Service

// Khi đặt hàng gắn idPhieuNhap lô cận-date nhất (traceability), chưa trừ kho.
//  Khi admin xác nhận multi-batch deduct:
//  Lô 1 (HSD sớm nhất) có 36sp, mua 37sp → trừ hết 36, sang lô 2 trừ thêm 1, lô 2 còn 49.

@Service
public class FEFOService {

    @Autowired
    private PhieuNhapKhoRepository phieuNhapKhoRepository;

    @Autowired
    private EntityManager entityManager;

    // ── Giai đoạn 1: Đặt hàng — gắn lô cận-date nhất ──────────────────────


//      Chạy trong cùng transaction với placeOrder.
//      Chỉ gán idPhieuNhap (traceability), chưa trừ soLuongConLai.

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


//     Trừ soLuongConLai theo FEFO multi-batch.
//     Ví dụ: mua 37sp, lô1=36 → trừ hết 36, lô2=50  trừ thêm 1, lô2 còn 49.
//     Ném BusinessException nếu tổng các lô không đủ.

    public void deductFEFOOnConfirm(Integer idSanPham, Integer soLuongCan) {
        // Lấy từng dòng lô của ĐÚNG sản phẩm này, sắp theo HSD sớm nhất (FEFO)
        // ✅ CHỈ LẤY LÔ CHƯA HẾT HẠN (han_su_dung > CURDATE())
        String selectSql = "SELECT ct.id, ct.so_luong_con_lai, ct.han_su_dung " +
                           "FROM Chi_Tiet_Phieu_Nhap ct " +
                           "WHERE ct.id_san_pham = :idSanPham " +
                           "  AND ct.so_luong_con_lai > 0 " +
                           "  AND (ct.han_su_dung IS NULL OR ct.han_su_dung > CURDATE()) " +  // ✅ Không bán hàng hết hạn
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
            java.sql.Date hsdSql = (java.sql.Date) r[2];
            LocalDate hanSuDung = hsdSql != null ? hsdSql.toLocalDate() : null;
            
            if (available <= 0) continue;
            
            // ✅ Double-check: Không bán lô đã hết hạn
            if (hanSuDung != null && hanSuDung.isBefore(LocalDate.now())) {
                continue; // Skip lô hết hạn
            }

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


//      Hoàn soLuongConLai về lô được gán lúc đặt hàng.
//     Chỉ hoàn vào dòng lô của ĐÚNG sản phẩm (1 PO có thể chứa nhiều sản phẩm).

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

    // ── Generate Pick List cho đơn hàng ────────────────────────────────────


    public List<PickListDTO> generatePickList(Integer idDonHang) {
        // Query lấy thông tin chi tiết từng sản phẩm trong đơn và lô hàng FEFO
        // ✅ CHỈ LẤY LÔ CHƯA HẾT HẠN
        String sql = 
            "SELECT " +
            "  sp.ten_san_pham, " +
            "  sp.id_san_pham, " +
            "  ctdh.so_luong, " +
            "  ct.so_lo, " +
            "  ct.han_su_dung, " +
            "  ct.id AS id_batch, " +
            "  ct.so_luong_con_lai " +
            "FROM Chi_Tiet_Don_Hang ctdh " +
            "JOIN San_Pham sp ON ctdh.id_san_pham = sp.id_san_pham " +
            "LEFT JOIN Chi_Tiet_Phieu_Nhap ct ON ct.id_san_pham = sp.id_san_pham " +
            "WHERE ctdh.id_don_hang = :idDonHang " +
            "  AND ct.so_luong_con_lai >= 0 " +
            "  AND (ct.han_su_dung IS NULL OR ct.han_su_dung > CURDATE()) " +  // ✅ Không lấy lô hết hạn
            "ORDER BY sp.id_san_pham, ct.han_su_dung ASC, ct.id ASC";
        
        Query query = entityManager.createNativeQuery(sql);
        query.setParameter("idDonHang", idDonHang);
        
        @SuppressWarnings("unchecked")
        List<Object[]> rows = query.getResultList();
        
        if (rows == null || rows.isEmpty()) {
            return new ArrayList<>();
        }
        
        // Group by sản phẩm và tính toán phân bổ theo FEFO
        Map<Integer, PickListDTO> pickListMap = new HashMap<>();
        Map<Integer, Integer> remainingMap = new HashMap<>(); // Số lượng còn cần lấy cho mỗi SP
        
        for (Object[] row : rows) {
            String tenSanPham = (String) row[0];
            Integer idSanPham = ((Number) row[1]).intValue();
            Integer soLuongDat = ((Number) row[2]).intValue();
            String soLo = (String) row[3];
            java.sql.Date hanSuDungSql = (java.sql.Date) row[4];
            LocalDate hanSuDung = hanSuDungSql != null ? hanSuDungSql.toLocalDate() : null;
            Integer idBatch = row[5] != null ? ((Number) row[5]).intValue() : null;
            Integer soLuongConLai = row[6] != null ? ((Number) row[6]).intValue() : 0;
            
            // Khởi tạo pick list item nếu chưa có
            if (!pickListMap.containsKey(idSanPham)) {
                PickListDTO pickItem = new PickListDTO();
                pickItem.setIdSanPham(idSanPham);
                pickItem.setTenSanPham(tenSanPham);
                pickItem.setSoLuongCanLay(soLuongDat);
                pickItem.setBatchItems(new ArrayList<>());
                pickListMap.put(idSanPham, pickItem);
                remainingMap.put(idSanPham, soLuongDat);
            }
            
            PickListDTO pickItem = pickListMap.get(idSanPham);
            int remaining = remainingMap.get(idSanPham);
            
            // Chỉ thêm batch item nếu còn cần lấy và có thông tin lô
            if (remaining > 0 && soLo != null && idBatch != null) {
                // Tính số lượng lấy từ lô này (min của remaining và soLuongConLai + đã lấy)
                int soLuongLay = Math.min(remaining, soLuongConLai + soLuongDat);
                
                PickListDTO.BatchPickItemDTO batchItem = new PickListDTO.BatchPickItemDTO();
                batchItem.setIdBatch(idBatch);
                batchItem.setSoLo(soLo);
                batchItem.setHanSuDung(hanSuDung);
                batchItem.setSoLuongLay(soLuongLay);
                batchItem.setGhiChu("FEFO: Lấy từ lô HSD sớm nhất");
                
                pickItem.getBatchItems().add(batchItem);
                
                // Giảm remaining
                remainingMap.put(idSanPham, remaining - soLuongLay);
            }
        }
        
        return new ArrayList<>(pickListMap.values());
    }
}

