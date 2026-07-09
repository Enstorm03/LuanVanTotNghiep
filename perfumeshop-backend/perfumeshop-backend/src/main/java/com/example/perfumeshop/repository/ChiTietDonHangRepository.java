package com.example.perfumeshop.repository;

import com.example.perfumeshop.entity.ChiTietDonHang;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface ChiTietDonHangRepository extends JpaRepository<ChiTietDonHang, Integer> {

    /** Tổng số lượng đã bán của 1 SP từ 1 thời điểm, chỉ tính đơn ở trạng thái chỉ định */
    @Query("SELECT COALESCE(SUM(ct.soLuong), 0) FROM ChiTietDonHang ct " +
           "WHERE ct.sanPham.idSanPham = :idSanPham " +
           "AND ct.donHang.trangThaiVanHanh = :trangThai " +
           "AND ct.donHang.ngayDatHang >= :tuNgay")
    Long tongSoLuongDaBanTuNgay(@Param("idSanPham") Integer idSanPham,
                                @Param("trangThai") String trangThai,
                                @Param("tuNgay") LocalDateTime tuNgay);
}
