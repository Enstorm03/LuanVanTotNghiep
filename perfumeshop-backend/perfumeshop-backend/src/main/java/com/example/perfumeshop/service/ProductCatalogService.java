package com.example.perfumeshop.service;

import com.example.perfumeshop.dto.PagedResponse;
import com.example.perfumeshop.entity.DanhMuc;
import com.example.perfumeshop.entity.SanPham;
import com.example.perfumeshop.entity.ThuongHieu;
import com.example.perfumeshop.repository.DanhMucRepository;
import com.example.perfumeshop.repository.SanPhamRepository;
import com.example.perfumeshop.repository.ThuongHieuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

@Service
public class ProductCatalogService {

    @Autowired
    private SanPhamRepository sanPhamRepository;

    @Autowired
    private DanhMucRepository danhMucRepository;

    @Autowired
    private ThuongHieuRepository thuongHieuRepository;

    public PagedResponse<SanPham> searchWithPage(
            String kw, Integer danhMucId, Integer thuongHieuId,
            Integer nongDo, Integer dungTich,
            BigDecimal minGia, BigDecimal maxGia,
            String sortBy, String sortDir,
            int page, int size
    ) {
        Sort sort;
        if (sortBy != null && !sortBy.isBlank()) {
            sort = "desc".equalsIgnoreCase(sortDir)
                    ? Sort.by(sortBy).descending()
                    : Sort.by(sortBy).ascending();
        } else {
            sort = Sort.by("idSanPham").ascending();
        }
        Pageable pageable = PageRequest.of(page, size, sort);
        Page<SanPham> result = sanPhamRepository.searchWithPage(
                kw, danhMucId, thuongHieuId, nongDo, dungTich, minGia, maxGia, pageable
        );
        PagedResponse<SanPham> resp = new PagedResponse<>();
        resp.setContent(result.getContent());
        resp.setPage(result.getNumber());
        resp.setSize(result.getSize());
        resp.setTotalElements(result.getTotalElements());
        resp.setTotalPages(result.getTotalPages());
        resp.setLast(result.isLast());
        return resp;
    }

    public List<SanPham> getRelatedProducts(Integer productId, int limit) {
        SanPham current = sanPhamRepository.findById(productId).orElse(null);
        if (current == null || current.getThuongHieu() == null) return List.of();
        Pageable pageable = PageRequest.of(0, limit);
        return sanPhamRepository.findRelatedProducts(current.getThuongHieu().getIdThuongHieu(), productId, pageable);
    }

    // Giữ lại các method cũ
    public List<SanPham> search(String kw, Integer danhMucId, Integer thuongHieuId, Integer nongDo, Integer dungTich) {
        Pageable pageable = PageRequest.of(0, Integer.MAX_VALUE);
        return sanPhamRepository.searchWithPage(
                kw, danhMucId, thuongHieuId, nongDo, dungTich, null, null, pageable
        ).getContent();
    }

    public List<DanhMuc> listDanhMuc() {
        return danhMucRepository.findAll();
    }

    public List<ThuongHieu> listThuongHieu() {
        return thuongHieuRepository.findAll();
    }
}