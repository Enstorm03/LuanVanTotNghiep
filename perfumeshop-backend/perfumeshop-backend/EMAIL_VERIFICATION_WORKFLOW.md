# Email Verification Workflow Documentation

## Các Field Verification Trong NguoiDung Entity

### 1. **isVerified** 
```java
@Column(name = "is_verified", columnDefinition = "TINYINT(1) DEFAULT 0")
private Boolean isVerified = false;
```
- **Mục đích:** Đánh dấu xem email của người dùng đã được xác thực hay chưa
- **Giá trị:**
  - `false` (0): Email chưa được xác thực
  - `true` (1): Email đã được xác thực
- **Sử dụng:** Kiểm tra xem người dùng có thể sử dụng tính năng nào (ví dụ: chỉ người dùng verified mới có thể đặt hàng)

### 2. **verificationToken**
```java
@Column(name = "verification_token")
private String verificationToken;
```
- **Mục đích:** Lưu trữ token xác thực duy nhất được gửi qua email
- **Định dạng:** String ngẫu nhiên (thường là UUID hoặc hash)
- **Ví dụ:** `"a1b2c3d4-e5f6-7890-abcd-ef1234567890"`
- **Sử dụng:** 
  - Tạo ra khi đăng ký
  - Gửi qua email cho người dùng
  - So sánh khi người dùng click link xác thực

### 3. **tokenExpiryTime**
```java
@Column(name = "token_expiry_time")
private LocalDateTime tokenExpiryTime;
```
- **Mục đích:** Lưu thời gian hết hạn của token xác thực
- **Định dạng:** LocalDateTime (VD: `2024-06-26 18:50:00`)
- **Sử dụng:**
  - Đặt khi token được tạo (thường cộng thêm 24 giờ)
  - Kiểm tra xem token có còn hiệu lực không
  - Token hết hạn → phải yêu cầu gửi lại email

---

## Email Verification Flow

### Scenario 1: Đăng Ký Khách Hàng Mới

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User fills registration form & submits                   │
│    POST /api/auth/register-customer                         │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. AuthController → AdminUserService.createKhachHang()      │
│    - Validate input                                         │
│    - Create NguoiDung entity                               │
│    - Set isVerified = false                                 │
│    - Generate verificationToken (UUID)                      │
│    - Set tokenExpiryTime = now + 24 hours                   │
│    - Save to database                                       │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Send Welcome Email                                       │
│    - Subject: "Chào mừng bạn đến với Perfume Shop!"        │
│    - Content: Tính năng & lợi ích                          │
│    - (Optional: Verification link nếu cần)                 │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Return Success Response                                  │
│    {                                                        │
│      "id": 123,                                             │
│      "hoTen": "Nguyễn Văn A",                               │
│      "email": "user@example.com",                           │
│      "isVerified": false                                    │
│    }                                                        │
└─────────────────────────────────────────────────────────────┘
```

### Scenario 2: User Click Verification Link (Tùy Chọn)

Nếu muốn thêm verification email verification:

```
┌─────────────────────────────────────────────────────────────┐
│ 1. User receives verification email with link              │
│    https://perfumeshop.com/verify?token=abc123xyz           │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. User clicks link                                         │
│    GET /api/auth/verify?token=abc123xyz                     │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Server verifies token                                    │
│    - Find user by verificationToken                         │
│    - Check if tokenExpiryTime > now                         │
│    - If valid: set isVerified = true, clear token           │
│    - If expired: return error "Token hết hạn"              │
└────────────────────────┬────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Return Success & Redirect to login                       │
│    "Email đã được xác thực. Hãy đăng nhập!"                │
└─────────────────────────────────────────────────────────────┘
```

---

## Current Implementation Status

### ✅ Implemented
- Welcome email gửi khi đăng ký
- `isVerified`, `verificationToken`, `tokenExpiryTime` fields được định nghĩa

### ⏳ Not Yet Implemented (Tùy Chọn)
- Email verification endpoint
- Resend verification email
- Business logic check `isVerified` trước khi checkout

---

## Cách Sử Dụng Fields Trong Code

### Khi Tạo User Mới:
```java
public NguoiDungResponse createKhachHang(CreateKhachHangRequest req) {
    NguoiDung kh = new NguoiDung();
    kh.setTenDangNhap(req.getTenDangNhap());
    kh.setHoTen(req.getHoTen());
    kh.setEmail(req.getEmail());
    
    // Email verification fields
    kh.setIsVerified(false);  // Email chưa xác thực
    kh.setVerificationToken(UUID.randomUUID().toString());  // Token ngẫu nhiên
    kh.setTokenExpiryTime(LocalDateTime.now().plusHours(24));  // Hết hạn sau 24h
    
    return nguoiDungRepository.save(kh);
}
```

### Khi Verify Email:
```java
public void verifyEmail(String token) {
    NguoiDung user = nguoiDungRepository.findByVerificationToken(token)
            .orElseThrow(() -> new BusinessException("Token không hợp lệ"));
    
    // Kiểm tra token còn hiệu lực không
    if (user.getTokenExpiryTime().isBefore(LocalDateTime.now())) {
        throw new BusinessException("Token đã hết hạn");
    }
    
    // Mark as verified
    user.setIsVerified(true);
    user.setVerificationToken(null);  // Clear token
    user.setTokenExpiryTime(null);
    
    nguoiDungRepository.save(user);
}
```

### Kiểm Tra Trước Checkout:
```java
public void processCheckout(Integer userId) {
    NguoiDung user = getUserEntity(userId);
    
    if (!Boolean.TRUE.equals(user.getIsVerified())) {
        throw new BusinessException("Vui lòng xác thực email trước khi đặt hàng");
    }
    
    // Tiếp tục xử lý thanh toán...
}
```

---

## Database Schema

```sql
ALTER TABLE Nguoi_Dung ADD COLUMN (
    is_verified TINYINT(1) DEFAULT 0,
    verification_token VARCHAR(255) UNIQUE,
    token_expiry_time DATETIME
);

-- Index để tìm nhanh user theo token
CREATE INDEX idx_verification_token ON Nguoi_Dung(verification_token);
```

---

## Summary

| Field | Mục Đích | Giá Trị |
|-------|---------|--------|
| **isVerified** | Đánh dấu email verified | `true/false` |
| **verificationToken** | Token xác thực | UUID string |
| **tokenExpiryTime** | Hết hạn token | LocalDateTime |

Các fields này là cơ sở hạ tầng để triển khai email verification khi cần thiết.