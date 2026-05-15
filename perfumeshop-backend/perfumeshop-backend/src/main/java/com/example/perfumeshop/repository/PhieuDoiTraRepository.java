package com.example.perfumeshop.repository;

import com.example.perfumeshop.entity.PhieuDoiTra;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhieuDoiTraRepository extends JpaRepository<PhieuDoiTra, Integer> {
    List<PhieuDoiTra> findByTrangThai(String trangThai);
    List<PhieuDoiTra> findByIdDonHangAndIdNguoiDung(Integer idDonHang, Integer idNguoiDung);
}
