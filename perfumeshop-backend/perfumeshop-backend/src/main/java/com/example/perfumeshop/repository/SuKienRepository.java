package com.example.perfumeshop.repository;

import com.example.perfumeshop.entity.SuKien;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SuKienRepository extends JpaRepository<SuKien, Integer> {


//     * Tìm sự kiện đang active: trangThaiActive = true
//     * và thời điểm hiện tại nằm trong khung ngayBatDau ≤ NOW ≤ ngayKetThuc.
//     * Nếu có nhiều sự kiện cùng lúc (không nên), lấy sự kiện gần kết thúc nhất.

    @Query("SELECT s FROM SuKien s WHERE s.trangThaiActive = true " +
           "AND CURRENT_TIMESTAMP BETWEEN s.ngayBatDau AND s.ngayKetThuc " +
           "ORDER BY s.ngayKetThuc ASC")
    Optional<SuKien> findActiveCampaign();
}
