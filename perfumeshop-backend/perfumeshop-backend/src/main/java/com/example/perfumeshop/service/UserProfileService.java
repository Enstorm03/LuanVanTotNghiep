package com.example.perfumeshop.service;

import com.example.perfumeshop.entity.NguoiDung;
import com.example.perfumeshop.exception.BusinessException;
import com.example.perfumeshop.repository.NguoiDungRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class UserProfileService {

    @Autowired
    private NguoiDungRepository nguoiDungRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

//     * Lấy thông tin cá nhân của user

    public Map<String, Object> getProfile(Integer userId) {
        if (userId == null) {
            throw new BusinessException("Không tìm thấy user");
        }

        NguoiDung user = nguoiDungRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("User không tồn tại"));

        return convertToResponse(user);
    }


//      Cập nhật thông tin cá nhân của user

    public Map<String, Object> updateProfile(Integer userId, Map<String, Object> updateData) {
        if (userId == null) {
            throw new BusinessException("Không tìm thấy user");
        }

        NguoiDung user = nguoiDungRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("User không tồn tại"));

        // Cập nhật các trường
        if (updateData.containsKey("hoTen")) {
            user.setHoTen((String) updateData.get("hoTen"));
        }
        if (updateData.containsKey("soDienThoai")) {
            user.setSoDienThoai((String) updateData.get("soDienThoai"));
        }
        if (updateData.containsKey("diaChi")) {
            user.setDiaChi((String) updateData.get("diaChi"));
        }

        NguoiDung updated = nguoiDungRepository.save(user);
        return convertToResponse(updated);
    }


//      Thay đổi mật khẩu của user

    public void changePassword(Integer userId, String matKhauCu, String matKhauMoi) {
        if (userId == null) {
            throw new BusinessException("Không tìm thấy user");
        }

        // Validate mật khẩu cũ
        if (matKhauCu == null || matKhauCu.isEmpty()) {
            throw new BusinessException("Vui lòng nhập mật khẩu hiện tại");
        }

        // Validate mật khẩu mới
        if (matKhauMoi == null || matKhauMoi.isEmpty()) {
            throw new BusinessException("Vui lòng nhập mật khẩu mới");
        }

//        if (matKhauMoi.length() < 6) {
//            throw new BusinessException("Mật khẩu mới phải có ít nhất 6 ký tự");
//        }

        NguoiDung user = nguoiDungRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("User không tồn tại"));

        // Kiểm tra mật khẩu cũ
        if (!passwordEncoder.matches(matKhauCu, user.getMatKhauBam())) {
            throw new BusinessException("Mật khẩu hiện tại không chính xác");
        }

        // Cập nhật mật khẩu mới
        user.setMatKhauBam(passwordEncoder.encode(matKhauMoi));
        nguoiDungRepository.save(user);
    }


//     * Convert NguoiDung entity to response DTO

    private Map<String, Object> convertToResponse(NguoiDung user) {
        Map<String, Object> response = new HashMap<>();
        response.put("id_nguoi_dung", user.getIdNguoiDung());
        response.put("ten_dang_nhap", user.getTenDangNhap());
        response.put("ho_ten", user.getHoTen());
        response.put("so_dien_thoai", user.getSoDienThoai());
        response.put("dia_chi", user.getDiaChi());
        return response;
    }
}