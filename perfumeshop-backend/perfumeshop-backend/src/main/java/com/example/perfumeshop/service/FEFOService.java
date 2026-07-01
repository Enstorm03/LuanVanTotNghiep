package com.example.perfumeshop.service;

import com.example.perfumeshop.entity.ChiTietDonHang;
import com.example.perfumeshop.entity.ChiTietPhieuNhap;
import com.example.perfumeshop.entity.SanPham;
import com.example.perfumeshop.exception.BusinessException;
import com.example.perfumeshop.repository.PhieuNhapKhoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import java.util.List;

/**
 * FEFO (First Expired, First Out) Service
 * Implements 4-step transaction for batch allocation:
 * 1. Find earliest expiring batch with stock
 * 2. Check quantity availability in that batch
 * 3. Allocate from batch and link to order item
 * 4. Update batch inventory (so_luong_con_lai)
 */
@Service
public class FEFOService {

    @Autowired
    private PhieuNhapKhoRepository phieuNhapKhoRepository;

    @Autowired
    private EntityManager entityManager;

    /**
     * Allocate stock to order item using FEFO strategy
     * Step 1-2: Find earliest batch with sufficient stock
     * Step 3-4: Link item to batch and decrement batch inventory
     * 
     * Does NOT throw exception - logs warning instead to prevent transaction rollback
     */
    @Transactional(propagation = org.springframework.transaction.annotation.Propagation.REQUIRES_NEW)
    public void allocateOrderItemFromBatch(ChiTietDonHang chiTietDonHang, Integer idSanPham, Integer soLuongCan) {
        try {
            // Step 1: Find earliest expiring batch for this product
            List<Integer> activeBatches = phieuNhapKhoRepository.findActiveBatchesByProductFEFO(idSanPham);
            
            if (activeBatches == null || activeBatches.isEmpty()) {
                System.out.println("⚠ FEFO: Không có hàng có sẵn cho sản phẩm: " + idSanPham);
                return;
            }

            // Step 2: Allocate from the first (earliest expiring) batch
            Integer selectedBatchId = allocateFromBatch(activeBatches.get(0), soLuongCan);
            if (selectedBatchId == null) {
                System.out.println("⚠ FEFO: Không đủ hàng trong lô soonest-expiring");
                return;
            }

            // Step 3: Link order item to the batch
            chiTietDonHang.setIdPhieuNhap(selectedBatchId);

            // Step 4: Update batch inventory (decrement so_luong_con_lai)
            decrementBatchStock(selectedBatchId, soLuongCan);
            
            System.out.println("✓ FEFO: Cấp phát thành công từ batch " + selectedBatchId);
        } catch (Exception e) {
            System.out.println("⚠ FEFO allocation error (order will proceed without batch): " + e.getMessage());
        }
    }

    /**
     * Attempt to allocate quantity from a specific batch
     * Returns batch ID if successful, null otherwise
     */
    private Integer allocateFromBatch(Integer idPhieuNhap, Integer soLuongCan) {
        String sql = "SELECT SUM(ct.so_luong_con_lai) as tong " +
                     "FROM Chi_Tiet_Phieu_Nhap ct " +
                     "WHERE ct.id_phieu = :idPhieuNhap";
        
        Query q = entityManager.createNativeQuery(sql);
        q.setParameter("idPhieuNhap", idPhieuNhap);
        Object result = q.getSingleResult();
        
        Integer availableQty = result != null ? ((Number) result).intValue() : 0;
        
        if (availableQty >= soLuongCan) {
            return idPhieuNhap;
        }
        
        return null;
    }

    /**
     * Decrement batch inventory (so_luong_con_lai)
     */
    @Transactional
    private void decrementBatchStock(Integer idPhieuNhap, Integer soLuongGiam) {
        String updateSql = "UPDATE Chi_Tiet_Phieu_Nhap " +
                          "SET so_luong_con_lai = so_luong_con_lai - :soLuong " +
                          "WHERE id_phieu = :idPhieuNhap " +
                          "  AND so_luong_con_lai >= :soLuong";
        
        Query updateQ = entityManager.createNativeQuery(updateSql);
        updateQ.setParameter("soLuong", soLuongGiam);
        updateQ.setParameter("idPhieuNhap", idPhieuNhap);
        
        int updated = updateQ.executeUpdate();
        if (updated == 0) {
            throw new BusinessException("Không thể cập nhật lô hàng: không đủ tồn kho");
        }
    }
}