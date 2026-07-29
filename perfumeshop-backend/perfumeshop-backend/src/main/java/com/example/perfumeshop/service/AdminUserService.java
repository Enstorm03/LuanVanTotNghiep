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
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class AdminUserService {


    private static final Set<String> VALID_ROLES = Set.of(
            "ADMIN", "DIRECTOR", "STORE_MANAGER", "WAREHOUSE_STAFF",
            "SUPPLIER", "STAFF"
    );

    @Autowired
    private NhanVienRepository nhanVienRepository;

    @Autowired
    private NguoiDungRepository nguoiDungRepository;

    @Autowired
    private PasswordService passwordService;

    private void validateRole(String vaiTro) {
        if (vaiTro == null || !VALID_ROLES.contains(vaiTro.toUpperCase())) {
            throw new BusinessException("Vai trò không hợp lệ: " + vaiTro
                    + ". Các vai trò được phép: " + VALID_ROLES);
        }
    }

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
        validateRole(req.getVaiTro());
        NhanVien nv = new NhanVien();
        nv.setTenDangNhap(req.getTenDangNhap());
        nv.setMatKhauBam(passwordService.encode(req.getMatKhau()));
        nv.setHoTen(req.getHoTen());
        nv.setVaiTro(req.getVaiTro().toUpperCase());
        return NhanVienResponse.from(nhanVienRepository.save(nv));
    }

    public NhanVienResponse updateNhanVienRole(Integer id, UpdateNhanVienRoleRequest req) {
        NhanVien nv = getNhanVienEntity(id);
        validateRole(req.getVaiTro());
        nv.setVaiTro(req.getVaiTro().toUpperCase());
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
        kh.setEmail(req.getEmail());
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

//     Giám đốc duyệt khách hàng thành NCC
    public NguoiDungResponse duyetNCC(Integer id) {
        NguoiDung kh = getKhachHangEntity(id);
        kh.setVaiTro("SUPPLIER");
        return NguoiDungResponse.from(nguoiDungRepository.save(kh));
    }

//     Hủy vai trò NCC → trở lại CUSTOMER
    public NguoiDungResponse huyNCC(Integer id) {
        NguoiDung kh = getKhachHangEntity(id);
        kh.setVaiTro("CUSTOMER");
        return NguoiDungResponse.from(nguoiDungRepository.save(kh));
    }

    public void resetKhachHangPassword(Integer id, ResetPasswordRequest req) {
        NguoiDung kh = getKhachHangEntity(id);
        kh.setMatKhauBam(passwordService.encode(req.getNewPassword()));
        nguoiDungRepository.save(kh);
    }

    // ================= Internal helpers =================

//     Trả về entity thô — chỉ dùng nội bộ trong service layer
    public NguoiDung getKhachHangEntity(Integer id) {
        return nguoiDungRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Khách hàng không tồn tại"));
    }

    public NhanVien getNhanVienEntity(Integer id) {
        return nhanVienRepository.findById(id)
                .orElseThrow(() -> new BusinessException("Nhân viên không tồn tại"));
    }
}
