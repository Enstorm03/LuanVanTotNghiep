package com.example.perfumeshop.repository;

import com.example.perfumeshop.entity.BienDongKho;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface BienDongKhoRepository extends JpaRepository<BienDongKho, Integer> {
    List<BienDongKho> findByIdSanPhamOrderByNgayTaoDesc(Integer idSanPham);
    List<BienDongKho> findAllByOrderByNgayTaoDesc();
}
