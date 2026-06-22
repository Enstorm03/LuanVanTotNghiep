package com.example.perfumeshop.repository;

import com.example.perfumeshop.entity.SanPhamDeXuat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SanPhamDeXuatRepository extends JpaRepository<SanPhamDeXuat, Integer> {

    List<SanPhamDeXuat> findByPhieuGoiThau_IdPhieuGoiThau(Integer idPhieuGoiThau);

    List<SanPhamDeXuat> findByTrangThai(String trangThai);

    List<SanPhamDeXuat> findByPhieuGoiThau_IdPhieuGoiThauAndTrangThai(
        Integer idPhieuGoiThau, String trangThai);

    /** Lấy tất cả đề xuất độc lập (không thuộc phiếu gọi thầu nào) */
    List<SanPhamDeXuat> findByPhieuGoiThauIsNullOrderByNgayTaoDesc();

    /** Lấy đề xuất độc lập theo trạng thái */
    List<SanPhamDeXuat> findByPhieuGoiThauIsNullAndTrangThaiOrderByNgayTaoDesc(String trangThai);
}