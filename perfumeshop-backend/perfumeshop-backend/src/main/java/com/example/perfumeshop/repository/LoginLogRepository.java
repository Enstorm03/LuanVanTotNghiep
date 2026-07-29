package com.example.perfumeshop.repository;

import com.example.perfumeshop.entity.LoginLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface LoginLogRepository extends JpaRepository<LoginLog, Long> {

//   Tìm kiếm + lọc log: theo tên đăng nhập, vai trò, trạng thái, khoảng thời gian
    @Query("""
        SELECT l FROM LoginLog l
        WHERE (:tenDangNhap IS NULL OR LOWER(l.tenDangNhap) LIKE LOWER(CONCAT('%', :tenDangNhap, '%')))
          AND (:vaiTro IS NULL OR l.vaiTro = :vaiTro)
          AND (:trangThai IS NULL OR l.trangThai = :trangThai)
          AND (:tuNgay IS NULL OR l.thoiGian >= :tuNgay)
          AND (:denNgay IS NULL OR l.thoiGian <= :denNgay)
        ORDER BY l.thoiGian DESC
        """)
    Page<LoginLog> search(
        @Param("tenDangNhap") String tenDangNhap,
        @Param("vaiTro") String vaiTro,
        @Param("trangThai") String trangThai,
        @Param("tuNgay") LocalDateTime tuNgay,
        @Param("denNgay") LocalDateTime denNgay,
        Pageable pageable
    );

//     Đếm số lần đăng nhập thất bại trong N phút gần nhất (phát hiện brute force)
    @Query("""
        SELECT COUNT(l) FROM LoginLog l
        WHERE l.tenDangNhap = :tenDangNhap
          AND l.trangThai = 'FAILED'
          AND l.thoiGian >= :tuNgay
        """)
    long countFailedAttempts(@Param("tenDangNhap") String tenDangNhap,
                             @Param("tuNgay") LocalDateTime tuNgay);
}
