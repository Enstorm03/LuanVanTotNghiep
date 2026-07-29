package com.example.perfumeshop.repository;

import com.example.perfumeshop.entity.SanPham;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SanPhamRepository extends JpaRepository<SanPham, Integer> {

    // Search có phân trang — nongDoMin/nongDoMax để lọc theo range
    @Query("SELECT p FROM SanPham p " +
            "WHERE (:kw IS NULL OR LOWER(p.tenSanPham) LIKE LOWER(CONCAT('%', :kw, '%'))) " +
            "AND (:danhMucId IS NULL OR p.danhMuc.idDanhMuc = :danhMucId) " +
            "AND (:thuongHieuId IS NULL OR p.thuongHieu.idThuongHieu = :thuongHieuId) " +
            "AND (:nongDoMin IS NULL OR p.nongDo >= :nongDoMin) " +
            "AND (:nongDoMax IS NULL OR p.nongDo < :nongDoMax) " +
            "AND (:dungTich IS NULL OR p.dungTichMl = :dungTich) " +
            "AND (:minGia IS NULL OR p.giaBan >= :minGia) " +
            "AND (:maxGia IS NULL OR p.giaBan <= :maxGia)")
    Page<SanPham> searchWithPage(
            @Param("kw") String keyword,
            @Param("danhMucId") Integer danhMucId,
            @Param("thuongHieuId") Integer thuongHieuId,
            @Param("nongDoMin") Integer nongDoMin,
            @Param("nongDoMax") Integer nongDoMax,
            @Param("dungTich") Integer dungTich,
            @Param("minGia") java.math.BigDecimal minGia,
            @Param("maxGia") java.math.BigDecimal maxGia,
            Pageable pageable
    );

    // Sản phẩm liên quan (cùng thương hiệu, trừ sản phẩm hiện tại)
    @Query("SELECT p FROM SanPham p WHERE p.thuongHieu.idThuongHieu = :thuongHieuId AND p.idSanPham <> :excludeId")
    List<SanPham> findRelatedProducts(@Param("thuongHieuId") Integer thuongHieuId,
                                      @Param("excludeId") Integer excludeId,
                                      Pageable pageable);

//     * Trừ kho atomic: chỉ update nếu còn đủ hàng (soLuongTonKho >= qty).
//     * Trả về số rows bị ảnh hưởng: 1 = thành công, 0 = không đủ hàng.
//     * Dùng thay cho đọc-rồi-ghi để tránh race condition khi nhiều đơn đặt cùng lúc.
     @Modifying
     @Query("UPDATE SanPham s SET s.soLuongTonKho = s.soLuongTonKho - :qty " +
            "WHERE s.idSanPham = :id AND s.soLuongTonKho >= :qty")
     int decrementStock(@Param("id") Integer id, @Param("qty") int qty);

     // Tìm sản phẩm theo tên (không phân biệt hoa/thường)
     @Query("SELECT p FROM SanPham p WHERE LOWER(TRIM(p.tenSanPham)) = LOWER(TRIM(:tenSanPham))")
     List<SanPham> findByTenSanPhamIgnoreCase(@Param("tenSanPham") String tenSanPham);

     // Sản phẩm sắp hết kho (tồn < ngưỡng), sắp theo tồn kho tăng dần
     List<SanPham> findBySoLuongTonKhoLessThanOrderBySoLuongTonKhoAsc(Integer nguong);
}
