package com.example.perfumeshop.service;

import com.example.perfumeshop.dto.*;
import com.example.perfumeshop.entity.NguoiDung;
import com.example.perfumeshop.entity.NhanVien;
import com.example.perfumeshop.exception.BusinessException;
import com.example.perfumeshop.repository.NguoiDungRepository;
import com.example.perfumeshop.repository.NhanVienRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AdminUserService {

    @Autowired
    private NhanVienRepository nhanVienRepository;

    @Autowired
    private NguoiDungRepository nguoiDungRepository;

    @Autowired
    private PasswordService passwordService;

    // ================= Nhân viên =================

    public List<NhanVienResponse> listNhanVien() {
        return nhanVienRepository.findAll()
                .stream().map(NhanVienResponse::from).collect(Collectors.toList());
    }

    public NhanVienResponse getNhanVien(Integer id) {
        return NhanVienResponse.from(getNhanVienEntity(id));
    }

    public NhanVienResponse createNhanVien(CreateNhanVienRequest req) {
        nhanVienRepository.findByTenDangNhap(req.getTenDangNhap())
                .ifPresent(x -> { throw new BusinessException("Tên đăng nhập đã tồn tại"); });
        NhanVien nv = new NhanVien();
        nv.setTenDangNhap(req.getTenDangNhap());
        nv.setMatKhauBam(passwordService.encode(req.getMatKhau()));
        nv.setHoTen(req.getHoTen());
        nv.setVaiTro(req.getVaiTro());
        return NhanVienResponse.from(nhanVienRepository.save(nv));
    }

    public NhanVienResponse updateNhanVienRole(Integer id, UpdateNhanVienRoleRequest req) {
        NhanVien nv = getNhanVienEntity(id);
        nv.setVaiTro(req.getVaiTro());
        return NhanVienResponse.from(nhanVienRepository.save(nv));
    }

    public void deleteNhanVien(Integer id) {
        nhanVienRepository.deleteById(id);
    }

    public void resetNhanVienPassword(Integer id, ResetPasswordRequest req) {
        NhanVien nv = getNhanVienEntity(id);
        nv.setMatKhauBam(passwordService.encode(req.getNewPassword()));
        nhanVienRepository.save(nv);
    }

    // ================= Khách hàng =================

    public List<NguoiDungResponse> listKhachHang() {
        return nguoiDungRepository.findAll()
                .stream().map(NguoiDungResponse::from).collect(Collectors.toList());
    }

    public NguoiDungResponse getKhachHang(Integer id) {
        return NguoiDungResponse.from(getKhachHangEntity(id));
    }

    public NguoiDungResponse createKhachHang(CreateKhachHangRequest req) {
        nguoiDungRepository.findByTenDangNhap(req.getTenDangNhap())
                .ifPresent(x -> { throw new BusinessException("Tên đăng nhập đã tồn tại"); });
        NguoiDung kh = new NguoiDung();
        kh.setTenDangNhap(req.getTenDangNhap());
        kh.setMatKhauBam(passwordService.encode(req.getMatKhau()));
        kh.setHoTen(req.getHoTen());
        kh.setSoDienThoai(req.getSoDienThoai());
        kh.setDiaChi(req.getDiaChi());
        return NguoiDungResponse.from(nguoiDungRepository.save(kh));
    }

    public NguoiDungResponse updateKhachHang(Integer id, UpdateKhachHangRequest req) {
        NguoiDung kh = getKhachHangEntity(id);
        if (req.getHoTen() != null) kh.setHoTen(req.getHoTen());
        if (req.getSoDienThoai() != null) kh.setSoDienThoai(req.getSoDienThoai());
        if (req.getDiaChi() != null) kh.setDiaChi(req.getDiaChi());
        return NguoiDungResponse.from(nguoiDungRepository.save(kh));
    }

    public void deleteKhachHang(Integer id) {
        nguoiDungRepository.deleteById(id);
    }

    public void resetKhachHangPassword(Integer id, ResetPasswordRequest req) {
        NguoiDung kh = getKhachHangEntity(id);
        kh.setMatKhauBam(passwordService.encode(req.getNewPassword()));
        nguoiDungRepository.save(kh);
    }

    // ================= Internal helpers =================

    /** Trả về entity thô — chỉ dùng nội bộ trong service layer */
    public NguoiDung getKhachHangEntity(Integer id) {
        return nguoiDungRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Khách hàng không tồn tại"));
    }

    public NhanVien getNhanVienEntity(Integer id) {
        return nhanVienRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Nhân viên không tồn tại"));
    }
}
