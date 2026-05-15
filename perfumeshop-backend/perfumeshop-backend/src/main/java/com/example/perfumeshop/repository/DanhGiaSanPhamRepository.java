package com.example.perfumeshop.repository;

import com.example.perfumeshop.entity.DanhGiaSanPham;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DanhGiaSanPhamRepository extends JpaRepository<DanhGiaSanPham, Integer> {
    List<DanhGiaSanPham> findByIdSanPham(Integer idSanPham);
}
