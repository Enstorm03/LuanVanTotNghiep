package com.example.perfumeshop.repository;

import com.example.perfumeshop.entity.SanPham;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SanPhamRepository extends JpaRepository<SanPham, Integer> {

    // Search có phân trang
    @Query("SELECT p FROM SanPham p " +
            "WHERE (:kw IS NULL OR LOWER(p.tenSanPham) LIKE LOWER(CONCAT('%', :kw, '%'))) " +
            "AND (:danhMucId IS NULL OR p.danhMuc.idDanhMuc = :danhMucId) " +
            "AND (:thuongHieuId IS NULL OR p.thuongHieu.idThuongHieu = :thuongHieuId) " +
            "AND (:nongDo IS NULL OR p.nongDo = :nongDo) " +
            "AND (:dungTich IS NULL OR p.dungTichMl = :dungTich) " +
            "AND (:minGia IS NULL OR p.giaBan >= :minGia) " +
            "AND (:maxGia IS NULL OR p.giaBan <= :maxGia)")
    Page<SanPham> searchWithPage(
            @Param("kw") String keyword,
            @Param("danhMucId") Integer danhMucId,
            @Param("thuongHieuId") Integer thuongHieuId,
            @Param("nongDo") Integer nongDo,
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
}
