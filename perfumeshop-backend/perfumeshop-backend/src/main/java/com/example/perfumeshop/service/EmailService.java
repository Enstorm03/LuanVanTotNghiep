package com.example.perfumeshop.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender javaMailSender;

    @Autowired
    private com.example.perfumeshop.repository.NguoiDungRepository nguoiDungRepository;


//      Gửi email xác nhận đơn hàng (cho COD)

    public void sendOrderConfirmationEmail(com.example.perfumeshop.entity.DonHang donHang) {
        if (donHang.getIdNguoiDung() == null) return;
        
        com.example.perfumeshop.entity.NguoiDung user = nguoiDungRepository.findById(donHang.getIdNguoiDung()).orElse(null);
        if (user == null || user.getEmail() == null) return;
        
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(user.getEmail());
            helper.setSubject("Xác nhận đơn hàng #" + donHang.getIdDonHang() + " - Perfume Shop");
            helper.setFrom("perfumeshop@example.com");

            String htmlContent = buildOrderConfirmationTemplate(
                user.getHoTen(),
                donHang.getIdDonHang(),
                donHang.getTongTien(),
                donHang.getDiaChiGiaoHang(),
                donHang.getTenNguoiNhan(),
                donHang.getSoDienThoai(),
                donHang.getPhuongThucThanhToan()
            );
            helper.setText(htmlContent, true);

            javaMailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Không thể gửi email xác nhận đơn hàng: " + e.getMessage(), e);
        }
    }


//      Gửi email chào mừng người dùng mới

    public void sendWelcomeEmail(String email, String hoTen) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(email);
            helper.setSubject("Chào mừng bạn đến với Perfume Shop!");
            helper.setFrom("perfumeshop@example.com");

            String htmlContent = buildWelcomeEmailTemplate(hoTen);
            helper.setText(htmlContent, true);

            javaMailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Không thể gửi email chào mừng: " + e.getMessage(), e);
        }
    }


//     Gửi email xác thực đăng ký

    public void sendVerificationEmail(String email, String hoTen, String verificationToken, String verificationUrl) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(email);
            helper.setSubject("Xác thực tài khoản Perfume Shop");
            helper.setFrom("perfumeshop@example.com");

            String htmlContent = buildVerificationEmailTemplate(hoTen, verificationUrl);
            helper.setText(htmlContent, true);

            javaMailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Không thể gửi email xác thực: " + e.getMessage(), e);
        }
    }


//      Gửi email thông báo thanh toán thành công

    public void sendPaymentSuccessEmail(String email, String hoTen, Integer orderId, 
                                       BigDecimal totalAmount, String deliveryAddress,
                                       String recipientName, String phoneNumber) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(email);
            helper.setSubject("Xác nhận thanh toán đơn hàng #" + orderId);
            helper.setFrom("perfumeshop@example.com");

            String htmlContent = buildPaymentSuccessEmailTemplate(hoTen, orderId, totalAmount, 
                                                                  deliveryAddress, recipientName, phoneNumber);
            helper.setText(htmlContent, true);

            javaMailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Không thể gửi email thanh toán: " + e.getMessage(), e);
        }
    }


//      Gửi email thông báo hủy đơn hàng

    public void sendOrderCancelledEmail(String email, String hoTen, Integer orderId, String cancelReason) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(email);
            helper.setSubject("Thông báo hủy đơn hàng #" + orderId);
            helper.setFrom("perfumeshop@example.com");

            String htmlContent = buildOrderCancelledEmailTemplate(hoTen, orderId, cancelReason);
            helper.setText(htmlContent, true);

            javaMailSender.send(message);
        } catch (MessagingException e) {
            throw new RuntimeException("Không thể gửi email hủy đơn: " + e.getMessage(), e);
        }
    }


//      Template HTML cho email xác nhận đơn hàng COD

    private String buildOrderConfirmationTemplate(String hoTen, Integer orderId, BigDecimal totalAmount,
                                                 String deliveryAddress, String recipientName, String phoneNumber,
                                                 String paymentMethod) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        String orderDate = LocalDateTime.now().format(formatter);

        return "<!DOCTYPE html>\n" +
                "<html>\n" +
                "<head>\n" +
                "    <meta charset='UTF-8'>\n" +
                "    <style>\n" +
                "        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }\n" +
                "        .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; border-radius: 8px; }\n" +
                "        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; border-radius: 8px 8px 0 0; text-align: center; }\n" +
                "        .header h1 { margin: 0; font-size: 28px; }\n" +
                "        .content { background: white; padding: 30px 20px; }\n" +
                "        .success-badge { display: inline-block; background: #4caf50; color: white; padding: 8px 15px; border-radius: 20px; font-size: 12px; margin-bottom: 15px; }\n" +
                "        .order-info { background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0; }\n" +
                "        .order-info p { margin: 8px 0; }\n" +
                "        .info-label { font-weight: bold; color: #667eea; width: 150px; display: inline-block; }\n" +
                "        .delivery-box { background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #2196f3; }\n" +
                "        .total-amount { font-size: 20px; color: #d32f2f; font-weight: bold; }\n" +
                "        .footer { background: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }\n" +
                "        .cod-note { background: #fff3cd; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #ffc107; }\n" +
                "    </style>\n" +
                "</head>\n" +
                "<body>\n" +
                "    <div class='container'>\n" +
                "        <div class='header'>\n" +
                "            <h1>✓ Đơn Hàng Đã Được Đặt!</h1>\n" +
                "        </div>\n" +
                "        <div class='content'>\n" +
                "            <p><span class='success-badge'>Đơn hàng đã được xác nhận</span></p>\n" +
                "            <p>Xin chào <strong>" + hoTen + "</strong>,</p>\n" +
                "            <p>Cảm ơn bạn đã đặt hàng tại Perfume Shop! Đơn hàng của bạn đã được tiếp nhận và đang chờ xử lý.</p>\n" +
                "            <div class='order-info'>\n" +
                "                <p><span class='info-label'>Mã Đơn Hàng:</span> <strong>#" + orderId + "</strong></p>\n" +
                "                <p><span class='info-label'>Ngày Đặt Hàng:</span> " + orderDate + "</p>\n" +
                "                <p><span class='info-label'>Phương Thức:</span> " + (paymentMethod != null ? paymentMethod : "COD") + "</p>\n" +
                "                <p><span class='info-label'>Tổng Tiền:</span> <span class='total-amount'>" + formatCurrency(totalAmount) + "</span></p>\n" +
                "            </div>\n" +
                (("COD".equalsIgnoreCase(paymentMethod)) ? 
                "            <div class='cod-note'>\n" +
                "                <p><strong>💵 Thanh Toán Khi Nhận Hàng (COD)</strong></p>\n" +
                "                <p>Bạn sẽ thanh toán bằng tiền mặt khi nhận hàng từ nhân viên giao hàng.</p>\n" +
                "            </div>\n" : "") +
                "            <h3 style='color: #333; margin-top: 20px;'>Thông Tin Giao Hàng</h3>\n" +
                "            <div class='delivery-box'>\n" +
                "                <p><span class='info-label'>Người Nhận:</span> " + (recipientName != null ? recipientName : "") + "</p>\n" +
                "                <p><span class='info-label'>Số Điện Thoại:</span> " + (phoneNumber != null ? phoneNumber : "") + "</p>\n" +
                "                <p><span class='info-label'>Địa Chỉ:</span> " + (deliveryAddress != null ? deliveryAddress : "") + "</p>\n" +
                "            </div>\n" +
                "            <p style='margin-top: 20px; color: #666;'>Đơn hàng của bạn sẽ được xác nhận và chuẩn bị giao hàng sớm nhất. Bạn sẽ nhận được email cập nhật trạng thái đơn hàng.</p>\n" +
                "        </div>\n" +
                "        <div class='footer'>\n" +
                "            <p>&copy; 2026 Perfume Shop. All rights reserved.</p>\n" +
                "            <p>Đây là email tự động, vui lòng không trả lời email này.</p>\n" +
                "        </div>\n" +
                "    </div>\n" +
                "</body>\n" +
                "</html>";
    }


//      Template HTML cho email chào mừng

    private String buildWelcomeEmailTemplate(String hoTen) {
        return "<!DOCTYPE html>\n" +
                "<html>\n" +
                "<head>\n" +
                "    <meta charset='UTF-8'>\n" +
                "    <style>\n" +
                "        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }\n" +
                "        .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; border-radius: 8px; }\n" +
                "        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 40px 20px; border-radius: 8px 8px 0 0; text-align: center; }\n" +
                "        .header h1 { margin: 0; font-size: 28px; }\n" +
                "        .header p { margin: 10px 0 0 0; font-size: 16px; }\n" +
                "        .content { background: white; padding: 30px 20px; }\n" +
                "        .content p { margin: 15px 0; line-height: 1.8; }\n" +
                "        .features { background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0; }\n" +
                "        .feature-item { margin: 12px 0; padding-left: 25px; position: relative; }\n" +
                "        .feature-item:before { content: '✓'; position: absolute; left: 0; color: #4caf50; font-weight: bold; }\n" +
                "        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 20px; }\n" +
                "        .button:hover { background: #764ba2; }\n" +
                "        .footer { background: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }\n" +
                "        .welcome-badge { display: inline-block; background: #ff6b6b; color: white; padding: 8px 15px; border-radius: 20px; font-size: 12px; margin-bottom: 15px; }\n" +
                "    </style>\n" +
                "</head>\n" +
                "<body>\n" +
                "    <div class='container'>\n" +
                "        <div class='header'>\n" +
                "            <h1>🎉 Chào Mừng!</h1>\n" +
                "            <p>Bạn đã tham gia Perfume Shop</p>\n" +
                "        </div>\n" +
                "        <div class='content'>\n" +
                "            <p><span class='welcome-badge'>Tài khoản đã được tạo thành công</span></p>\n" +
                "            <p>Xin chào <strong>" + hoTen + "</strong>,</p>\n" +
                "            <p>Cảm ơn bạn đã đăng ký tài khoản tại <strong>Perfume Shop</strong>. Chúng tôi rất vui được phục vụ bạn!</p>\n" +
                "            <h3 style='color: #667eea; margin-top: 25px;'>Bạn có thể làm gì:</h3>\n" +
                "            <div class='features'>\n" +
                "                <div class='feature-item'>Khám phá bộ sưu tập nước hoa tuyệt vời của chúng tôi</div>\n" +
                "                <div class='feature-item'>Thêm sản phẩm yêu thích vào danh sách mong muốn</div>\n" +
                "                <div class='feature-item'>Nhận ưu đãi độc quyền và giảm giá</div>\n" +
                "                <div class='feature-item'>Ghi lại lịch sử đơn hàng của bạn</div>\n" +
                "                <div class='feature-item'>Cập nhật thông tin hồ sơ bất cứ lúc nào</div>\n" +
                "            </div>\n" +
                "            <p style='margin-top: 25px;'>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi. Chúng tôi luôn sẵn sàng giúp đỡ!</p>\n" +
                "            <a href='https://pendant-moustache-flask.ngrok-free.dev/' class='button'>Bắt Đầu Mua Sắm</a>\n" +
                "        </div>\n" +
                "        <div class='footer'>\n" +
                "            <p>&copy; 2026 Perfume Shop. All rights reserved.</p>\n" +
                "            <p>Đây là email tự động, vui lòng không trả lời email này.</p>\n" +
                "        </div>\n" +
                "    </div>\n" +
                "</body>\n" +
                "</html>";
    }


//     Template HTML cho email xác thực

    private String buildVerificationEmailTemplate(String hoTen, String verificationUrl) {
        return "<!DOCTYPE html>\n" +
                "<html>\n" +
                "<head>\n" +
                "    <meta charset='UTF-8'>\n" +
                "    <style>\n" +
                "        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }\n" +
                "        .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; border-radius: 8px; }\n" +
                "        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }\n" +
                "        .header h1 { margin: 0; font-size: 24px; }\n" +
                "        .content { background: white; padding: 20px; }\n" +
                "        .content p { margin: 10px 0; }\n" +
                "        .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin-top: 15px; }\n" +
                "        .button:hover { background: #764ba2; }\n" +
                "        .footer { background: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }\n" +
                "        .warning { color: #d32f2f; font-size: 13px; margin-top: 20px; }\n" +
                "    </style>\n" +
                "</head>\n" +
                "<body>\n" +
                "    <div class='container'>\n" +
                "        <div class='header'>\n" +
                "            <h1>Xác Thực Tài Khoản</h1>\n" +
                "        </div>\n" +
                "        <div class='content'>\n" +
                "            <p>Xin chào <strong>" + hoTen + "</strong>,</p>\n" +
                "            <p>Cảm ơn bạn đã đăng ký tài khoản tại Perfume Shop. Để hoàn tất việc đăng ký, vui lòng xác thực email của bạn bằng cách nhấp vào nút dưới đây:</p>\n" +
                "            <a href='" + verificationUrl + "' class='button'>Xác Thực Email</a>\n" +
                "            <p class='warning'><strong>Lưu ý:</strong> Liên kết xác thực này sẽ hết hạn trong 24 giờ. Nếu bạn không yêu cầu đăng ký, vui lòng bỏ qua email này.</p>\n" +
                "            <p>Hoặc sao chép liên kết này vào trình duyệt:</p>\n" +
                "            <p style='word-break: break-all; background: #f0f0f0; padding: 10px; border-radius: 5px; font-size: 12px;'>" + verificationUrl + "</p>\n" +
                "        </div>\n" +
                "        <div class='footer'>\n" +
                "            <p>&copy; 2026 Perfume Shop. All rights reserved.</p>\n" +
                "            <p>Đây là email tự động, vui lòng không trả lời email này.</p>\n" +
                "        </div>\n" +
                "    </div>\n" +
                "</body>\n" +
                "</html>";
    }


//     Template HTML cho email thanh toán thành công

    private String buildPaymentSuccessEmailTemplate(String hoTen, Integer orderId, BigDecimal totalAmount,
                                                   String deliveryAddress, String recipientName, String phoneNumber) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        String orderDate = LocalDateTime.now().format(formatter);

        return "<!DOCTYPE html>\n" +
                "<html>\n" +
                "<head>\n" +
                "    <meta charset='UTF-8'>\n" +
                "    <style>\n" +
                "        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }\n" +
                "        .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; border-radius: 8px; }\n" +
                "        .header { background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }\n" +
                "        .header h1 { margin: 0; font-size: 24px; }\n" +
                "        .content { background: white; padding: 20px; }\n" +
                "        .content p { margin: 10px 0; }\n" +
                "        .order-info { background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0; }\n" +
                "        .order-info p { margin: 8px 0; }\n" +
                "        .info-label { font-weight: bold; color: #667eea; width: 150px; display: inline-block; }\n" +
                "        .delivery-box { background: #e3f2fd; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #2196f3; }\n" +
                "        .total-amount { font-size: 20px; color: #d32f2f; font-weight: bold; }\n" +
                "        .footer { background: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }\n" +
                "        .success-badge { display: inline-block; background: #4caf50; color: white; padding: 8px 15px; border-radius: 20px; font-size: 12px; margin-bottom: 15px; }\n" +
                "    </style>\n" +
                "</head>\n" +
                "<body>\n" +
                "    <div class='container'>\n" +
                "        <div class='header'>\n" +
                "            <h1>✓ Thanh Toán Thành Công</h1>\n" +
                "        </div>\n" +
                "        <div class='content'>\n" +
                "            <p>Xin chào <strong>" + hoTen + "</strong>,</p>\n" +
                "            <p><span class='success-badge'>Thanh toán đã được xác nhận</span></p>\n" +
                "            <p>Đơn hàng của bạn đã được thanh toán thành công. Cảm ơn bạn đã mua hàng tại Perfume Shop!</p>\n" +
                "            <div class='order-info'>\n" +
                "                <p><span class='info-label'>Mã Đơn Hàng:</span> <strong>#" + orderId + "</strong></p>\n" +
                "                <p><span class='info-label'>Ngày Đặt Hàng:</span> " + orderDate + "</p>\n" +
                "                <p><span class='info-label'>Tổng Tiền:</span> <span class='total-amount'>" + formatCurrency(totalAmount) + "</span></p>\n" +
                "            </div>\n" +
                "            <h3 style='color: #333; margin-top: 20px;'>Thông Tin Giao Hàng</h3>\n" +
                "            <div class='delivery-box'>\n" +
                "                <p><span class='info-label'>Người Nhận:</span> " + recipientName + "</p>\n" +
                "                <p><span class='info-label'>Số Điện Thoại:</span> " + phoneNumber + "</p>\n" +
                "                <p><span class='info-label'>Địa Chỉ:</span> " + deliveryAddress + "</p>\n" +
                "            </div>\n" +
                "            <p style='margin-top: 20px; color: #666;'>Đơn hàng của bạn sẽ được chuẩn bị và giao hàng sớm nhất. Bạn sẽ nhận được thông báo cập nhật trạng thái qua email.</p>\n" +
                "        </div>\n" +
                "        <div class='footer'>\n" +
                "            <p>&copy; 2026 Perfume Shop. All rights reserved.</p>\n" +
                "            <p>Đây là email tự động, vui lòng không trả lời email này.</p>\n" +
                "        </div>\n" +
                "    </div>\n" +
                "</body>\n" +
                "</html>";
    }


//      Template HTML cho email hủy đơn hàng

    private String buildOrderCancelledEmailTemplate(String hoTen, Integer orderId, String cancelReason) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
        String cancelDate = LocalDateTime.now().format(formatter);

        return "<!DOCTYPE html>\n" +
                "<html>\n" +
                "<head>\n" +
                "    <meta charset='UTF-8'>\n" +
                "    <style>\n" +
                "        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }\n" +
                "        .container { max-width: 600px; margin: 0 auto; padding: 20px; background: #f9f9f9; border-radius: 8px; }\n" +
                "        .header { background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center; }\n" +
                "        .header h1 { margin: 0; font-size: 24px; }\n" +
                "        .content { background: white; padding: 20px; }\n" +
                "        .content p { margin: 10px 0; }\n" +
                "        .info-box { background: #fff3cd; padding: 15px; border-radius: 5px; margin: 15px 0; border-left: 4px solid #ffc107; }\n" +
                "        .info-label { font-weight: bold; color: #d32f2f; }\n" +
                "        .footer { background: #f0f0f0; padding: 15px; text-align: center; font-size: 12px; color: #666; border-radius: 0 0 8px 8px; }\n" +
                "    </style>\n" +
                "</head>\n" +
                "<body>\n" +
                "    <div class='container'>\n" +
                "        <div class='header'>\n" +
                "            <h1>Thông Báo Hủy Đơn Hàng</h1>\n" +
                "        </div>\n" +
                "        <div class='content'>\n" +
                "            <p>Xin chào <strong>" + hoTen + "</strong>,</p>\n" +
                "            <p>Đơn hàng của bạn đã bị hủy.</p>\n" +
                "            <div class='info-box'>\n" +
                "                <p><span class='info-label'>Mã Đơn Hàng:</span> #" + orderId + "</p>\n" +
                "                <p><span class='info-label'>Thời Gian Hủy:</span> " + cancelDate + "</p>\n" +
                "                <p><span class='info-label'>Lý Do Hủy:</span> " + cancelReason + "</p>\n" +
                "            </div>\n" +
                "            <p>Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với chúng tôi qua email hoặc điện thoại.</p>\n" +
                "        </div>\n" +
                "        <div class='footer'>\n" +
                "            <p>&copy; 2026 Perfume Shop. All rights reserved.</p>\n" +
                "            <p>Đây là email tự động, vui lòng không trả lời email này.</p>\n" +
                "        </div>\n" +
                "    </div>\n" +
                "</body>\n" +
                "</html>";
    }


//      Định dạng tiền tệ VND

    private String formatCurrency(BigDecimal amount) {
        if (amount == null) return "0 ₫";
        long longValue = amount.longValue();
        return String.format("%,d ₫", longValue);
    }
}