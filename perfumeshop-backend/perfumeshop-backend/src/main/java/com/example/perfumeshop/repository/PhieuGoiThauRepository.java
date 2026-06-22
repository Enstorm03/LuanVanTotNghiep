package com.example.perfumeshop.repository;

import com.example.perfumeshop.entity.PhieuGoiThau;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhieuGoiThauRepository extends JpaRepository<PhieuGoiThau, Integer> {
    List<PhieuGoiThau> findByTrangThaiOrderByNgayTaoDesc(String trangThai);
    List<PhieuGoiThau> findAllByOrderByNgayTaoDesc();
}
