package com.example.perfumeshop.service;

import com.example.perfumeshop.dto.*;
import com.example.perfumeshop.entity.NguoiDung;
import com.example.perfumeshop.entity.NhanVien;
import com.example.perfumeshop.exception.BusinessException;
import com.example.perfumeshop.repository.NguoiDungRepository;
import com.example.perfumeshop.repository.NhanVienRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.List;

@Service
public class AdminUserService {

    @Autowired
    private NhanVienRepository nhanVienRepository;

    @Autowired
    private NguoiDungRepository nguoiDungRepository;

    // ================= Employees =================
    public List<NhanVien> listNhanVien() { return nhanVienRepository.findAll(); }

    public NhanVien getNhanVien(Integer id) {
        return nhanVienRepository.findById(id).orElseThrow(() -> new BusinessException("Nhân viên không tồn tại"));
    }

    public NhanVien createNhanVien(CreateNhanVienRequest req) {
        nhanVienRepository.findByTenDangNhap(req.getTenDangNhap())
                .ifPresent(x -> { throw new BusinessException("Tên đăng nhập đã tồn tại"); });
        NhanVien nv = new NhanVien();
        nv.setTenDangNhap(req.getTenDangNhap());
        nv.setMatKhauBam(hash(req.getMatKhau()));
        nv.setHoTen(req.getHoTen());
        nv.setVaiTro(req.getVaiTro());
        return nhanVienRepository.save(nv);
    }

    public NhanVien updateNhanVienRole(Integer id, UpdateNhanVienRoleRequest req) {
        NhanVien nv = getNhanVien(id);
        nv.setVaiTro(req.getVaiTro());
        return nhanVienRepository.save(nv);
    }

    public void deleteNhanVien(Integer id) { nhanVienRepository.deleteById(id); }

    public void resetNhanVienPassword(Integer id, ResetPasswordRequest req) {
        NhanVien nv = getNhanVien(id);
        nv.setMatKhauBam(hash(req.getNewPassword()));
        nhanVienRepository.save(nv);
    }

    // ================= Customers =================
    public List<NguoiDung> listKhachHang() { return nguoiDungRepository.findAll(); }

    public NguoiDung getKhachHang(Integer id) {
        return nguoiDungRepository.findById(id).orElseThrow(() -> new BusinessException("Khách hàng không tồn tại"));
    }

    public NguoiDung createKhachHang(CreateKhachHangRequest req) {
        nguoiDungRepository.findByTenDangNhap(req.getTenDangNhap())
                .ifPresent(x -> { throw new BusinessException("Tên đăng nhập đã tồn tại"); });
        NguoiDung kh = new NguoiDung();
        kh.setTenDangNhap(req.getTenDangNhap());
        kh.setMatKhauBam(hash(req.getMatKhau()));
        kh.setHoTen(req.getHoTen());
        kh.setSoDienThoai(req.getSoDienThoai());
        kh.setDiaChi(req.getDiaChi());
        return nguoiDungRepository.save(kh);
    }

    public NguoiDung updateKhachHang(Integer id, UpdateKhachHangRequest req) {
        NguoiDung kh = getKhachHang(id);
        if (req.getHoTen() != null) kh.setHoTen(req.getHoTen());
        if (req.getSoDienThoai() != null) kh.setSoDienThoai(req.getSoDienThoai());
        if (req.getDiaChi() != null) kh.setDiaChi(req.getDiaChi());
        return nguoiDungRepository.save(kh);
    }

    public void deleteKhachHang(Integer id) { nguoiDungRepository.deleteById(id); }

    public void resetKhachHangPassword(Integer id, ResetPasswordRequest req) {
        NguoiDung kh = getKhachHang(id);
        kh.setMatKhauBam(hash(req.getNewPassword()));
        nguoiDungRepository.save(kh);
    }

    private String hash(String raw) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-256");
            byte[] digest = md.digest(raw.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException(e);
        }
    }
}
