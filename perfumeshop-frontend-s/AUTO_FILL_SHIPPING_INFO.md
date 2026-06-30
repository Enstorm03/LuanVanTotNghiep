# Tính Năng Auto-Fill Thông Tin Giao Hàng

## Tổng Quan
Tính năng tự động điền thông tin giao hàng giúp người dùng không phải nhập lại thông tin khi thanh toán. Khi người dùng đã đăng nhập, hệ thống sẽ tự động lấy thông tin từ profile và điền vào form.

## Cách Hoạt Động

### 1. Luồng Dữ Liệu
```
User đăng nhập → ThanhToanPage → useShippingForm → userApi.getProfile() → Auto-fill form
```

### 2. Các File Liên Quan

#### `src/hooks/useShippingForm.js`
Hook chính xử lý logic auto-fill:
- **State Management**: Quản lý `shippingInfo` và `isLoadingProfile`
- **Auto-Load**: Tự động gọi API khi component mount và có user
- **Error Handling**: Fallback về thông tin cơ bản nếu API fail
- **Loading State**: Hiển thị trạng thái loading cho user

**Các tính năng:**
- ✅ Tự động load profile từ API khi user đăng nhập
- ✅ Hỗ trợ nhiều format userId (id_nguoi_dung, userId, id)
- ✅ Fallback về thông tin cơ bản nếu API fail
- ✅ Loading indicator khi đang tải
- ✅ Console logs để debug

#### `src/pages/public/checkout/ThanhToanPage.jsx`
Trang thanh toán chính:
- Sử dụng `useShippingForm(user)` để lấy shipping info
- Truyền `isLoadingProfile` xuống ShippingForm component

#### `src/pages/public/checkout/components/shipping/ShippingForm.jsx`
Component form hiển thị thông tin:
- Nhận `shippingInfo`, `onShippingInfoChange`, và `isLoadingProfile` từ props
- Hiển thị loading spinner khi đang tải thông tin
- Cho phép user chỉnh sửa thông tin sau khi auto-fill

#### `src/services/api/userApi.js`
API service để lấy thông tin user:
- `getProfile(userId)`: Lấy thông tin profile đầy đủ từ backend
- Tự động thêm X-User-Id header
- Hỗ trợ lấy userId từ sessionStorage nếu không truyền vào

### 3. Cách Sử Dụng

#### Trong Component
```javascript
import useShippingForm from '../../../hooks/useShippingForm';

const MyComponent = () => {
  const { user } = useAuth();
  const { shippingInfo, updateShippingInfo, isLoadingProfile } = useShippingForm(user);

  return (
    <ShippingForm 
      shippingInfo={shippingInfo}
      onShippingInfoChange={updateShippingInfo}
      isLoadingProfile={isLoadingProfile}
    />
  );
};
```

#### Các Trường Được Auto-Fill
```javascript
{
  tenNguoiNhan: '',      // Tên người nhận
  diaChiGiaoHang: '',    // Địa chỉ giao hàng
  soDienThoai: '',       // Số điện thoại
  ghiChu: ''             // Ghi chú (không auto-fill)
}
```

## Quy Trình Auto-Fill

### Bước 1: User Đăng Nhập
```
Login → AuthContext cập nhật user → ThanhToanPage nhận user
```

### Bước 2: Load Profile
```javascript
useEffect(() => {
  if (user) {
    loadUserProfile(); // Gọi API
  }
}, [user]);
```

### Bước 3: Xử Lý Response
```javascript
// Thành công
setShippingInfo({
  tenNguoiNhan: profile.ho_ten,
  diaChiGiaoHang: profile.dia_chi,
  soDienThoai: profile.so_dien_thoai,
  ghiChu: ''
});

// Thất bại - fallback
setShippingInfo({
  tenNguoiNhan: user.ho_ten || '',
  diaChiGiaoHang: user.dia_chi || '',
  soDienThoai: user.so_dien_thoai || '',
  ghiChu: ''
});
```

### Bước 4: Hiển Thị
- Form hiển thị thông tin đã được điền sẵn
- User có thể chỉnh sửa nếu cần
- Loading spinner hiển thị trong khi tải

## API Backend

### Endpoint: GET `/api/users/profile`

#### Request Headers
```
X-User-Id: {userId}
Authorization: Bearer {token}
```

#### Response
```json
{
  "id_nguoi_dung": 1,
  "ho_ten": "Nguyễn Văn A",
  "dia_chi": "123 Đường ABC, Quận 1, TP.HCM",
  "so_dien_thoai": "0901234567",
  "email": "user@example.com"
}
```

## UX Improvements

### 1. Loading State
```javascript
{isLoadingProfile && (
  <span className="text-sm text-gray-500 flex items-center">
    <svg className="animate-spin h-4 w-4 mr-2">...</svg>
    Đang tải thông tin...
  </span>
)}
```

### 2. Console Logs
```javascript
// Thành công
console.log('✅ Auto-filled shipping info from profile:', {
  name: profile.ho_ten,
  hasAddress: !!profile.dia_chi,
  hasPhone: !!profile.so_dien_thoai
});

// Thất bại
console.error('❌ Lỗi tải thông tin cá nhân:', error);
```

### 3. Error Handling
- API fail → Fallback về thông tin từ auth
- Không có userId → Sử dụng thông tin cơ bản
- Network error → Hiển thị warning, user có thể nhập tay

## Testing

### Test Cases

#### 1. User đã có thông tin đầy đủ
- ✅ Tên, địa chỉ, SĐT được fill tự động
- ✅ User có thể chỉnh sửa
- ✅ Loading spinner hiển thị và ẩn đúng lúc

#### 2. User chưa có địa chỉ/SĐT
- ✅ Tên được fill từ auth info
- ✅ Các trường khác để trống
- ✅ User có thể nhập thông tin

#### 3. API Error
- ✅ Fallback về thông tin cơ bản
- ✅ Console error log
- ✅ User vẫn có thể tiếp tục checkout

#### 4. User chưa đăng nhập
- ✅ Redirect về trang login
- ✅ Hiển thị thông báo "Yêu cầu đăng nhập"

### Debug Commands
```javascript
// Kiểm tra user object
console.log('User object:', user);

// Kiểm tra profile response
console.log('Profile response:', profile);

// Kiểm tra shipping info state
console.log('Shipping info:', shippingInfo);
```

## Best Practices

### 1. Luôn Validate Dữ Liệu
```javascript
const userId = user.id_nguoi_dung || user.userId || user.id;
if (!userId) {
  console.warn('No userId found');
  return;
}
```

### 2. Xử Lý Nhiều Format Field
```javascript
tenNguoiNhan: profile.ho_ten || user.ho_ten || user.hoTen || '',
```

### 3. Loading State
```javascript
const [isLoadingProfile, setIsLoadingProfile] = useState(false);
// Luôn set loading state
setIsLoadingProfile(true);
try { ... } finally { setIsLoadingProfile(false); }
```

### 4. Error Boundaries
```javascript
try {
  // API call
} catch (error) {
  console.error('Error:', error);
  // Fallback logic
}
```

## Troubleshooting

### Problem: Thông tin không auto-fill
**Giải pháp:**
1. Kiểm tra user object có tồn tại không
2. Kiểm tra userId có đúng format không
3. Kiểm tra API endpoint có hoạt động không
4. Xem console logs để debug

### Problem: Loading spinner không hiển thị
**Giải pháp:**
1. Kiểm tra `isLoadingProfile` được truyền vào ShippingForm
2. Kiểm tra state được set đúng trong useEffect
3. Verify CSS animation hoạt động

### Problem: API error
**Giải pháp:**
1. Kiểm tra backend server đang chạy
2. Verify X-User-Id header đúng format
3. Kiểm tra token authorization
4. Xem backend logs

## Kết Luận

Tính năng auto-fill thông tin giao hàng giúp:
- ✅ Cải thiện trải nghiệm người dùng
- ✅ Giảm thời gian checkout
- ✅ Giảm lỗi nhập liệu
- ✅ Tăng conversion rate

**Status**: ✅ Đã implement và hoạt động ổn định