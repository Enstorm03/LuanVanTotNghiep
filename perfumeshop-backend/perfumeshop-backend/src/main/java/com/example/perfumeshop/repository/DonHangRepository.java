package com.example.perfumeshop.repository;

import com.example.perfumeshop.entity.DonHang;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DonHangRepository extends JpaRepository<DonHang, Integer> {
    List<DonHang> findByTrangThaiVanHanh(String trangThaiVanHanh);
    List<DonHang> findByIdNguoiDungAndTrangThaiVanHanh(Integer idNguoiDung, String trangThaiVanHanh);
    List<DonHang> findByIdNguoiDungAndTrangThaiVanHanhNot(Integer idNguoiDung, String trangThaiVanHanh);

    // Tìm kiếm có phân trang, ưu tiên đơn online (PayOS) lên đầu để admin xác nhận sớm
    @Query("SELECT o FROM DonHang o WHERE " +
            "(:trangThai IS NULL OR o.trangThaiVanHanh = :trangThai) " +
            "AND (:search IS NULL OR LOWER(CAST(o.idDonHang AS string)) LIKE LOWER(CONCAT('%', :search, '%')) " +
            "OR LOWER(o.tenNguoiNhan) LIKE LOWER(CONCAT('%', :search, '%'))) " +
            "AND (:trangThai IS NOT NULL OR o.trangThaiVanHanh <> 'Giỏ hàng') " +
            "ORDER BY CASE WHEN o.phuongThucThanhToan = 'online' AND o.trangThaiVanHanh = 'Đang chờ' AND o.trangThaiThanhToan = 'Đã thanh toán' THEN 0 ELSE 1 END ASC, " +
            "o.ngayDatHang DESC")
    Page<DonHang> searchWithPage(@Param("trangThai") String trangThai,
                                 @Param("search") String search,
                                 Pageable pageable);
}