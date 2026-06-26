package com.example.perfumeshop.service;

import com.example.perfumeshop.entity.NguoiDung;
import com.example.perfumeshop.exception.BusinessException;
import com.example.perfumeshop.repository.NguoiDungRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class EmailVerificationService {

    @Autowired
    private NguoiDungRepository nguoiDungRepository;

    @Autowired
    private EmailService emailService;

    /**
     * Gửi email xác thực cho người dùng mới
     * Gọi khi user đăng ký
     */
    public void sendVerificationEmail(Integer userId, String email, String hoTen) {
        try {
            NguoiDung user = nguoiDungRepository.findById(userId).orElse(null);
            if (user == null) return;
            
            sendVerificationEmail(user);
        } catch (Exception e) {
            System.err.println("Lỗi gửi email xác thực: " + e.getMessage());
        }
    }

    private void sendVerificationEmail(NguoiDung user) {
        try {
            // Generate verification token
            String verificationToken = UUID.randomUUID().toString();
            LocalDateTime tokenExpiryTime = LocalDateTime.now().plusHours(24);

            // Update user
            user.setVerificationToken(verificationToken);
            user.setTokenExpiryTime(tokenExpiryTime);
            nguoiDungRepository.save(user);

            // Build verification link
            String verificationUrl = "https://pendant-moustache-flask.ngrok-free.dev/verify-email?token=" + verificationToken;

            // Send email
            emailService.sendVerificationEmail(
                    user.getEmail(),
                    user.getHoTen(),
                    verificationToken,
                    verificationUrl
            );
        } catch (Exception e) {
            System.err.println("Lỗi gửi email xác thực: " + e.getMessage());
        }
    }

    /**
     * Xác thực email bằng token
     */
    public boolean verifyEmail(String token) {
        try {
            if (token == null || token.isBlank()) {
                throw new BusinessException("Token không hợp lệ");
            }

            NguoiDung user = nguoiDungRepository.findByVerificationToken(token)
                    .orElseThrow(() -> new BusinessException("Token không tồn tại hoặc đã hết hạn"));

            if (Boolean.TRUE.equals(user.getIsVerified())) {
                return true;
            }

            if (user.getTokenExpiryTime() == null || user.getTokenExpiryTime().isBefore(LocalDateTime.now())) {
                throw new BusinessException("Token đã hết hạn");
            }

            user.setIsVerified(true);
            user.setVerificationToken(null);
            user.setTokenExpiryTime(null);
            nguoiDungRepository.save(user);

            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Xác thực email bằng token (trả về Map với chi tiết)
     */
    public Map<String, Object> verifyEmailWithDetails(String token) {
        Map<String, Object> response = new HashMap<>();

        if (token == null || token.isBlank()) {
            throw new BusinessException("Token không hợp lệ");
        }

        // Find user by token
        NguoiDung user = (NguoiDung) nguoiDungRepository.findByVerificationToken(token)
                .orElseThrow(() -> new BusinessException("Token không tồn tại hoặc đã hết hạn"));

        // Check if already verified
        if (Boolean.TRUE.equals(user.getIsVerified())) {
            response.put("message", "Email đã được xác thực trước đó");
            response.put("status", "already_verified");
            return response;
        }

        // Check token expiry
        if (user.getTokenExpiryTime() == null || user.getTokenExpiryTime().isBefore(LocalDateTime.now())) {
            throw new BusinessException("Token đã hết hạn. Vui lòng yêu cầu gửi lại email xác thực");
        }

        // Mark as verified
        user.setIsVerified(true);
        user.setVerificationToken(null);
        user.setTokenExpiryTime(null);
        nguoiDungRepository.save(user);

        response.put("message", "Email đã được xác thực thành công");
        response.put("status", "success");
        response.put("idNguoiDung", user.getIdNguoiDung());
        response.put("hoTen", user.getHoTen());
        response.put("email", user.getEmail());

        return response;
    }

    /**
     * Gửi lại email xác thực
     */
    public void resendVerificationEmail(Integer userId, String email, String hoTen) {
        try {
            NguoiDung user = nguoiDungRepository.findById(userId).orElse(null);
            if (user == null) {
                throw new BusinessException("User không tồn tại");
            }

            if (Boolean.TRUE.equals(user.getIsVerified())) {
                throw new BusinessException("Email này đã được xác thực");
            }

            sendVerificationEmail(user);
        } catch (Exception e) {
            throw new BusinessException(e.getMessage());
        }
    }

    /**
     * Gửi lại email xác thực (overload - legacy)
     */
    public Map<String, Object> resendVerificationEmailLegacy(String email) {
        Map<String, Object> response = new HashMap<>();

        NguoiDung user = nguoiDungRepository.findByEmail(email)
                .orElse(null);

        if (user == null) {
            response.put("message", "Nếu email tồn tại, bạn sẽ nhận được email xác thực");
            response.put("status", "sent");
            return response;
        }

        if (Boolean.TRUE.equals(user.getIsVerified())) {
            throw new BusinessException("Email này đã được xác thực");
        }

        sendVerificationEmail(user);

        response.put("message", "Email xác thực đã được gửi lại. Vui lòng kiểm tra hộp thư của bạn");
        response.put("status", "sent");

        return response;
    }

    /**
     * Check if user is verified
     */
    public boolean isUserVerified(Integer userId) {
        return nguoiDungRepository.findById(userId)
                .map(user -> Boolean.TRUE.equals(user.getIsVerified()))
                .orElse(false);
    }

    /**
     * Get verification status
     */
    public Map<String, Object> getVerificationStatus(Integer userId) {
        Map<String, Object> status = new HashMap<>();

        NguoiDung user = nguoiDungRepository.findById(userId)
                .orElseThrow(() -> new BusinessException("Người dùng không tồn tại"));

        status.put("idNguoiDung", user.getIdNguoiDung());
        status.put("hoTen", user.getHoTen());
        status.put("email", user.getEmail());
        status.put("isVerified", user.getIsVerified());

        if (!Boolean.TRUE.equals(user.getIsVerified()) && user.getTokenExpiryTime() != null) {
            status.put("tokenExpiryTime", user.getTokenExpiryTime());
            status.put("canResendEmail", true);
        } else {
            status.put("canResendEmail", false);
        }

        return status;
    }
}