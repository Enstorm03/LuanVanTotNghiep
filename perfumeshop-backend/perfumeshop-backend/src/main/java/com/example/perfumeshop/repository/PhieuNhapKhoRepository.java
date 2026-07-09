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

    /** Ngày nhập kho gần nhất của 1 sản phẩm (thay cho findAll + lọc trong Java) */
    @Query("SELECT MAX(ct.phieuNhap.ngayNhap) FROM ChiTietPhieuNhap ct WHERE ct.idSanPham = :idSanPham")
    java.time.LocalDateTime findNgayNhapGanNhatCuaSanPham(@org.springframework.data.repository.query.Param("idSanPham") Integer idSanPham);

    /** Các dòng lô còn hàng, sắp hết hạn trong khoảng (today, threshold) — sắp theo HSD tăng dần */
    @Query("SELECT ct FROM ChiTietPhieuNhap ct " +
           "WHERE ct.hanSuDung IS NOT NULL AND ct.hanSuDung > :today AND ct.hanSuDung < :threshold " +
           "AND ct.soLuongConLai > 0 ORDER BY ct.hanSuDung ASC")
    List<com.example.perfumeshop.entity.ChiTietPhieuNhap> findLoSapHetHan(
        @org.springframework.data.repository.query.Param("today") java.time.LocalDate today,
        @org.springframework.data.repository.query.Param("threshold") java.time.LocalDate threshold);
}
