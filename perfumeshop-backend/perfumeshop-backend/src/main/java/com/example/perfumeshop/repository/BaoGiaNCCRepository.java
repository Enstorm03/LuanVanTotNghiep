package com.example.perfumeshop.repository;

import com.example.perfumeshop.entity.BaoGiaNCC;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BaoGiaNCCRepository extends JpaRepository<BaoGiaNCC, Integer> {
    List<BaoGiaNCC> findByPhieuGoiThauIdPhieuGoiThauOrderByNgayTaoAsc(Integer idPhieuGoiThau);
    List<BaoGiaNCC> findByPhieuGoiThauIdPhieuGoiThauAndTrangThaiNot(Integer idPhieuGoiThau, String trangThai);
}
