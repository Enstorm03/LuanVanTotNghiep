package com.example.perfumeshop.repository;

import com.example.perfumeshop.entity.PhieuNhapKho;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PhieuNhapKhoRepository extends JpaRepository<PhieuNhapKho, Integer> {
    List<PhieuNhapKho> findAllByOrderByNgayNhapDesc();
    List<PhieuNhapKho> findByTrangThaiOrderByNgayNhapDesc(String trangThai);
    
    // Query to find active batches for a product sorted by expiry date (FEFO)
    // Returns list of batch IDs with available stock, ordered by earliest expiry first
    @Query(value = "SELECT DISTINCT ct.id_phieu FROM chi_tiet_phieu_nhap ct " +
                   "WHERE ct.id_san_pham = :idSanPham AND ct.so_luong_con_lai > 0 " +
                   "ORDER BY ct.han_su_dung ASC", nativeQuery = true)
    List<Integer> findActiveBatchesByProductFEFO(Integer idSanPham);
    
    // Query to get top N near-expiry batches (for dashboard widget)
    @Query(value = "SELECT ct.id, ct.id_san_pham, sp.ten_san_pham, ct.so_lo, ct.han_su_dung, ct.so_luong_con_lai, sp.gia_nhap " +
                   "FROM chi_tiet_phieu_nhap ct " +
                   "JOIN san_pham sp ON ct.id_san_pham = sp.id " +
                   "WHERE ct.so_luong_con_lai > 0 AND ct.han_su_dung > CURDATE() " +
                   "ORDER BY ct.han_su_dung ASC " +
                   "LIMIT :limit", nativeQuery = true)
    List<Object[]> findNearExpiryBatches(Integer limit);
    
    long countByMaPhieuStartingWith(String prefix);
    
    List<PhieuNhapKho> findByTrangThai(String trangThai);
}
