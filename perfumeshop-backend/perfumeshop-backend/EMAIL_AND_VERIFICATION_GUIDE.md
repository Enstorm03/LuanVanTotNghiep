# Email Verification & Payment Notification System - Implementation Guide

## Overview
This guide covers the complete implementation of email verification and payment success notifications in the Perfume Shop application. The system automatically sends professional HTML emails to customers for various events.

---

## 1. Email Configuration Setup

### 1.1 Gmail SMTP Configuration

The email system uses Gmail's SMTP server. Follow these steps to set it up:

#### Step 1: Enable 2-Factor Authentication on Gmail
1. Go to [myaccount.google.com](https://myaccount.google.com)
2. Select **Security** from the left menu
3. Enable **2-Step Verification**

#### Step 2: Generate App Password
1. In Security settings, find **App passwords** (only appears after 2FA is enabled)
2. Select **Mail** and **Windows Computer** (or your platform)
3. Google will generate a 16-character password

#### Step 3: Configure application.properties

**File:** `perfumeshop-backend/src/main/resources/application.properties`

```properties
# Email Configuration (Gmail SMTP)
spring.mail.host=smtp.gmail.com
spring.mail.port=587
spring.mail.username=${MAIL_USERNAME:your-email@gmail.com}
spring.mail.password=${MAIL_PASSWORD:your-app-password}
spring.mail.properties.mail.smtp.auth=true
spring.mail.properties.mail.smtp.starttls.enable=true
spring.mail.properties.mail.smtp.starttls.required=true
spring.mail.properties.mail.smtp.ssl.protocols=TLSv1.2
```

#### Step 4: Set Environment Variables (Recommended for Production)

**On Windows (Command Prompt):**
```cmd
set MAIL_USERNAME=your-email@gmail.com
set MAIL_PASSWORD=your-16-char-app-password
```

**On Linux/Mac (Terminal):**
```bash
export MAIL_USERNAME=your-email@gmail.com
export MAIL_PASSWORD=your-16-char-app-password
```

**Or use .env file** (if using Spring's environment property loader):
Create a `.env` file in the project root:
```
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-16-char-app-password
```

---

## 2. Database Schema Updates

### 2.1 New Fields Added to NguoiDung (Users) Table

The `NguoiDung` entity has been updated with email-related fields:

```java
@Column(name = "email")
private String email;

@Column(name = "is_verified", columnDefinition = "TINYINT(1) DEFAULT 0")
private Boolean isVerified = false;

@Column(name = "verification_token")
private String verificationToken;

@Column(name = "token_expiry_time")
private LocalDateTime tokenExpiryTime;
```

### 2.2 SQL Migration (Manual Execution)

If not using Hibernate auto-update, execute these SQL commands:

```sql
ALTER TABLE Nguoi_Dung ADD COLUMN email VARCHAR(255);
ALTER TABLE Nguoi_Dung ADD COLUMN is_verified TINYINT(1) DEFAULT 0;
ALTER TABLE Nguoi_Dung ADD COLUMN verification_token VARCHAR(500);
ALTER TABLE Nguoi_Dung ADD COLUMN token_expiry_time DATETIME;
```

---

## 3. Core Components

### 3.1 EmailService Class

**Location:** `perfumeshop-backend/src/main/java/com/example/perfumeshop/service/EmailService.java`

**Methods Available:**

#### sendVerificationEmail()
Sends account verification email to newly registered users.
```java
public void sendVerificationEmail(String email, String hoTen, 
                                 String verificationToken, String verificationUrl)
```

#### sendPaymentSuccessEmail()
Sends payment confirmation email with order details and shipping information.
```java
public void sendPaymentSuccessEmail(String email, String hoTen, Integer orderId, 
                                   BigDecimal totalAmount, String deliveryAddress,
                                   String recipientName, String phoneNumber)
```

#### sendOrderCancelledEmail()
Sends notification when an order is cancelled.
```java
public void sendOrderCancelledEmail(String email, String hoTen, 
                                   Integer orderId, String cancelReason)
```

### 3.2 PaymentService Integration

The `PaymentService` has been enhanced to automatically send emails when payment status changes:

**Automatic Email Triggers:**
- **Payment Success:** When webhook receives code "00" or `checkPaymentStatus()` confirms PAID status
- **Order Cancelled:** When payment fails or user cancels payment

---

## 4. Features & Workflows

### 4.1 Payment Success Notification Flow

When a customer completes payment:

1. **PayOS Webhook** receives payment confirmation (code "00")
2. **PaymentService.handleWebhook()** processes the event
3. **Order status** updated to "Đã thanh toán" (Paid)
4. **EmailService.sendPaymentSuccessEmail()** called automatically
5. **Customer receives** professional HTML email with:
   - ✓ Payment confirmation badge
   - Order number (#123)
   - Order date and time
   - Total amount with VND currency formatting
   - Delivery address (automatically populated from checkout form)
   - Recipient name and phone number
   - Professional styling with gradient header

### 4.2 Auto-Populated Shipping Information

**Key Implementation:** Shipping information is **automatically populated** from the DonHang (Order) entity:

From `DonHang` entity:
- `diaChiGiaoHang` → Delivery Address
- `tenNguoiNhan` → Recipient Name
- `soDienThoai` → Phone Number
- `tongTien` → Total Amount
- `idDonHang` → Order ID

**No manual data entry required by customer!**

---

## 5. Email Template Examples

### 5.1 Payment Success Email

The email template includes:
- **Header:** Green gradient with "✓ Thanh Toán Thành Công" title
- **Success Badge:** Green badge indicating payment confirmed
- **Order Information:** Order ID, Date, Amount (VND formatted)
- **Delivery Box:** Address, recipient name, phone number
- **Professional Footer:** Copyright and disclaimer

**Color Scheme:**
- Primary: Green (#11998e to #38ef7d)
- Accent: Blue (#667eea)
- Amount: Red (#d32f2f)

### 5.2 Email Verification Template

- **Header:** Purple gradient
- **Verification Button:** Direct link to verify account
- **Token Expiry:** 24-hour expiration warning
- **Fallback Link:** Manual URL option

### 5.3 Order Cancellation Template

- **Header:** Pink/Red gradient
- **Cancellation Details:** Order ID, Cancellation date, Reason
- **Support Notice:** Contact information for customer support

---

## 6. Implementation Steps for Frontend

### 6.1 Update Registration Form

When creating a new user account, ensure the email field is captured:

```javascript
const registerUser = async (userData) => {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tenDangNhap: userData.username,
      matKhau: userData.password,
      hoTen: userData.fullName,
      email: userData.email,  // ← REQUIRED
      soDienThoai: userData.phone,
      diaChi: userData.address
    })
  });
  return response.json();
};
```

### 6.2 Update Checkout Form

The shipping form should capture delivery information which will be automatically used in the payment email:

```javascript
const checkoutData = {
  diaChiGiaoHang: form.deliveryAddress,
  tenNguoiNhan: form.recipientName,
  soDienThoai: form.phoneNumber
};
```

**No additional API calls needed!** The email service automatically uses these fields from the order.

---

## 7. Error Handling & Logging

### 7.1 Email Sending Failures

The system is designed to be **non-blocking**:
- If email fails to send, the payment is still processed
- Errors are logged to System.err
- Exception messages are prefixed with context (e.g., "Lỗi gửi email thanh toán:")

### 7.2 Debugging Email Issues

Check these logs in your IDE console:
```
Lỗi gửi email thanh toán: [error details]
Lỗi gửi email hủy đơn: [error details]
```

---

## 8. Testing Email Functionality

### 8.1 Test Payment Success Email

1. Create a test order in the system
2. Complete payment through PayOS
3. Check the registered email inbox for confirmation email
4. Verify all details are correct (address, recipient name, total amount)

### 8.2 Test Verification Email

1. Register a new account with valid email
2. Check inbox for verification email
3. Click the verification link
4. Account should be marked as verified

### 8.3 Manual Testing with MailHog

For local development without real Gmail:

```bash
# Install MailHog
choco install mailhog  # Windows
brew install mailhog   # macOS

# Run MailHog
mailhog

# Configure application.properties
spring.mail.host=localhost
spring.mail.port=1025  # SMTP port
```

Then access emails at: `http://localhost:8025`

---

## 9. Production Deployment Checklist

- [ ] Gmail 2FA enabled
- [ ] App password generated and stored securely
- [ ] Environment variables set on server
- [ ] Database migration executed (`ALTER TABLE` commands)
- [ ] NguoiDung.email field populated with existing user emails
- [ ] Test registration and payment flow
- [ ] Verify email delivery in production environment
- [ ] Set up email logging/monitoring
- [ ] Create user guide on verifying email accounts

---

## 10. API Reference

### 10.1 Updated AuthController Endpoints

When implementing email verification, add:

```java
@PostMapping("/verify-email")
public ResponseEntity<Map<String, String>> verifyEmail(@RequestParam String token) {
  // Verify token and mark user as verified
  // Return success/error response
}
```

### 10.2 PaymentService Methods

```java
// Automatically called by webhook/status check
public void handleWebhook(WebhookData data)

// Manually check payment status
public String checkPaymentStatus(Integer idDonHang)
```

---

## 11. Troubleshooting

### Issue: "MAIL_USERNAME not found"
**Solution:** 
- Ensure environment variables are set
- Or use hardcoded values in application.properties for testing
- Restart the application after changing environment variables

### Issue: "Authentication failed" error
**Solution:**
- Verify Gmail 2FA is enabled
- Regenerate app password
- Ensure 16-character app password is used (not Gmail password)
- Check 'Less secure app access' is enabled (if applicable)

### Issue: Email not sent but no error shown
**Solution:**
- Check logs for "Lỗi gửi email" messages
- Verify SMTP credentials
- Check firewall/network blocks port 587
- Test with MailHog locally first

### Issue: Special characters (ñ, ü, etc.) not displaying correctly
**Solution:**
- Verified by UTF-8 encoding in EmailService
- Already set to `new MimeMessageHelper(message, true, "UTF-8")`
- No additional action needed

---

## 12. Security Notes

- **Email addresses** are stored in database; ensure proper database security
- **Verification tokens** expire after 24 hours; implement token cleanup job
- **App passwords** stored in environment variables, never commit to Git
- **SMTP credentials** use TLS 1.2 encryption for secure transmission
- **HTML emails** are built as strings; ensure no user input is directly injected

---

## 13. Future Enhancements

Potential improvements for next versions:

1. **Email Templates:** Move to separate .html files in `templates/` folder
2. **Scheduled Email Reminders:** Unverified accounts after 3 days
3. **Email Preferences:** Let users choose notification frequency
4. **Multiple Recipient Support:** CC/BCC for admin notifications
5. **Attachments:** Invoice PDF in payment confirmation email
6. **Email Analytics:** Track open rates, click rates
7. **Backup Email Service:** Fallback to alternative provider if Gmail fails
8. **Internationalization:** Multi-language email templates

---

## 14. Contact & Support

For issues related to this email system:
1. Check the troubleshooting section above
2. Review application logs for error messages
3. Verify Gmail/SMTP configuration
4. Test with MailHog locally
5. Ensure database migration was applied

---

**Last Updated:** June 2024
**Version:** 1.0
**Status:** Production Ready