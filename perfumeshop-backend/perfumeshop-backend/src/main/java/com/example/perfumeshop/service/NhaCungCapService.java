package com.example.perfumeshop.service;

import com.example.perfumeshop.entity.NhaCungCap;
import com.example.perfumeshop.exception.BusinessException;
import com.example.perfumeshop.repository.NhaCungCapRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class NhaCungCapService {

    @Autowired
    private NhaCungCapRepository nhaCungCapRepository;

    @Autowired
    private PasswordService passwordService;

    /**
     * Đăng nhập nhà cung cấp
     */
    public Map<String, Object> login(String tenDangNhap, String matKhau) {
        NhaCungCap ncc = nhaCungCapRepository.findByTenDangNhap(tenDangNhap)
                .orElseThrow(() -> new BusinessException("Sai tài khoản hoặc mật khẩu"));

        if (!Boolean.TRUE.equals(ncc.getHoatDong())) {
            throw new BusinessException("Tài khoản đã bị khóa");
        }

        if (!passwordService.matches(matKhau, ncc.getMatKhauBam())) {
            throw new BusinessException("Sai tài khoản hoặc mật khẩu");
        }

        Map<String, Object> res = new HashMap<>();
        res.put("idNhaCungCap", ncc.getIdNhaCungCap());
        res.put("tenCongTy", ncc.getTenCongTy());
        res.put("tenDangNhap", ncc.getTenDangNhap());
        res.put("email", ncc.getEmail());
        res.put("soDienThoai", ncc.getSoDienThoai());
        res.put("type", "supplier");
        return res;
    }

    /**
     * Lấy tất cả nhà cung cấp
     */
    public List<NhaCungCap> getAll() {
        return nhaCungCapRepository.findAllByOrderByTenCongTyAsc();
    }

    /**
     * Lấy nhà cung cấp theo ID
     */
    public NhaCungCap getById(Integer id) {
        return nhaCungCapRepository.findById(id)
                .orElseThrow(() -> new BusinessException("NCC không tồn tại"));
    }

    /**
     * Tạo nhà cung cấp mới
     */
    public NhaCungCap create(Map<String, Object> body) {
        String tenDangNhap = (String) body.get("tenDangNhap");
        
        nhaCungCapRepository.findByTenDangNhap(tenDangNhap)
                .ifPresent(x -> {
                    throw new BusinessException("Tên đăng nhập đã tồn tại");
                });

        NhaCungCap ncc = new NhaCungCap();
        ncc.setTenCongTy((String) body.get("tenCongTy"));
        ncc.setTenDangNhap(tenDangNhap);
        ncc.setMatKhauBam(passwordService.encode((String) body.get("matKhau")));
        ncc.setSoDienThoai((String) body.getOrDefault("soDienThoai", ""));
        ncc.setEmail((String) body.getOrDefault("email", ""));
        ncc.setDiaChi((String) body.getOrDefault("diaChi", ""));
        ncc.setHoatDong(true);
        ncc.setNgayTao(LocalDateTime.now());
        
        return nhaCungCapRepository.save(ncc);
    }

    /**
     * Cập nhật nhà cung cấp
     */
    public NhaCungCap update(Integer id, Map<String, Object> body) {
        NhaCungCap ncc = nhaCungCapRepository.findById(id)
                .orElseThrow(() -> new BusinessException("NCC không tồn tại"));

        if (body.get("tenCongTy") != null) {
            ncc.setTenCongTy((String) body.get("tenCongTy"));
        }
        if (body.get("soDienThoai") != null) {
            ncc.setSoDienThoai((String) body.get("soDienThoai"));
        }
        if (body.get("email") != null) {
            ncc.setEmail((String) body.get("email"));
        }
        if (body.get("diaChi") != null) {
            ncc.setDiaChi((String) body.get("diaChi"));
        }
        if (body.get("hoatDong") != null) {
            ncc.setHoatDong(Boolean.parseBoolean(body.get("hoatDong").toString()));
        }
        if (body.get("matKhau") != null && !body.get("matKhau").toString().isBlank()) {
            ncc.setMatKhauBam(passwordService.encode((String) body.get("matKhau")));
        }
        
        return nhaCungCapRepository.save(ncc);
    }

}
