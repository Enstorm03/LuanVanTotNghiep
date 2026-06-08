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
    long countByTrangThaiVanHanhNot(String trangThaiVanHanh);

    // Tìm đơn hàng theo ngày và trạng thái (thay findAll để tránh load toàn bộ DB)
    @Query("SELECT o FROM DonHang o WHERE o.trangThaiVanHanh <> 'Giỏ hàng' " +
           "AND (:start IS NULL OR o.ngayDatHang >= :start) " +
           "AND (:end IS NULL OR o.ngayDatHang <= :end)")
    List<DonHang> findForReport(@Param("start") java.time.LocalDateTime start,
                                @Param("end") java.time.LocalDateTime end);

    // Dashboard: lấy đơn không phải giỏ hàng, sort mới nhất trước
    @Query("SELECT o FROM DonHang o WHERE o.trangThaiVanHanh <> 'Giỏ hàng' ORDER BY o.ngayDatHang DESC")
    List<DonHang> findAllExceptCart();

    // Dashboard: đếm theo trạng thái (chạy ở DB thay vì load hết về Java)
    @Query("SELECT COUNT(o) FROM DonHang o WHERE o.trangThaiVanHanh = :trangThai")
    long countByTrangThai(@Param("trangThai") String trangThai);

    // Dashboard: tổng doanh thu đơn hoàn thành
    @Query("SELECT COALESCE(SUM(o.tongTien), 0) FROM DonHang o WHERE o.trangThaiVanHanh = 'Hoàn thành'")
    java.math.BigDecimal sumRevenueCompleted();
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