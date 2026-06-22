package com.example.perfumeshop.repository;

import com.example.perfumeshop.entity.NhaCungCap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface NhaCungCapRepository extends JpaRepository<NhaCungCap, Integer> {
    Optional<NhaCungCap> findByTenDangNhap(String tenDangNhap);
    List<NhaCungCap> findAllByOrderByTenCongTyAsc();
}
