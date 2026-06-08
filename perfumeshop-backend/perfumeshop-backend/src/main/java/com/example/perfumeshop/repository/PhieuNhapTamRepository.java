package com.example.perfumeshop.repository;

import com.example.perfumeshop.entity.PhieuNhapTam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PhieuNhapTamRepository extends JpaRepository<PhieuNhapTam, Integer> {
    List<PhieuNhapTam> findByIdSessionOrderByDongSoAsc(String idSession);
    void deleteByIdSession(String idSession);
    boolean existsByIdSession(String idSession);
}
