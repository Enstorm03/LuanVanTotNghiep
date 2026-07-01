# FEFO Frontend Implementation Guide - CHUNK 2 (Tiếng Việt)

## 🛠️ React Hooks Implementation

### Hook 1: useAutoFillShipping

**File**: `src/hooks/useAutoFillShipping.js`

**Mục đích**: Tự động điền thông tin giao hàng từ profile người dùng

**Implementation**:
```javascript
import { useEffect, useState } from 'react';
import { getUserProfile } from '@/services/api/userApi';

export function useAutoFillShipping(userId, token) {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId || !token) return;

    setLoading(true);
    getUserProfile(userId, token)
      .then(data => {
        setProfileData({
          tenNguoiNhan: data.hoTen,
          soDienThoai: data.soDienThoai,
          diaChiGiaoHang: data.diaChi
        });
        setError(null);
      })
      .catch(err => {
        setError(err.message);
        console.error('Failed to load profile:', err);
      })
      .finally(() => setLoading(false));
  }, [userId, token]);

  return { profileData, loading, error };
}
```

**Usage**:
```jsx
const { profileData, loading, error } = useAutoFillShipping(userId, token);

const handleAutoFill = () => {
  if (profileData) {
    setFormData({
      tenNguoiNhan: profileData.tenNguoiNhan,
      soDienThoai: profileData.soDienThoai,
      diaChiGiaoHang: profileData.diaChiGiaoHang
    });
  }
};
```

---

### Hook 2: useFEFOBatchInfo

**File**: `src/hooks/useFEFOBatchInfo.js`

**Mục đích**: Lấy thông tin FEFO batch từ order details

**Implementation**:
```javascript
import { useState, useEffect } from 'react';
import { getOrderDetail } from '@/services/api/orderApi';

export function useFEFOBatchInfo(orderId, token) {
  const [batchInfo, setBatchInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!orderId || !token) return;

    setLoading(true);
    getOrderDetail(orderId, token)
      .then(order => {
        // Extract FEFO info từ first item
        const fefoData = order.chiTietDonHangs?.map(item => ({
          id: item.id,
          sanPham: item.tenSanPham || 'N/A',
          soLuong: item.soLuong,
          idPhieuNhap: item.idPhieuNhap,      // Batch ID
          hanSuDung: item.hanSuDung,          // Expiry date
          soLuongConLai: item.soLuongConLai   // Remaining stock
        }));
        setBatchInfo(fefoData);
        setError(null);
      })
      .catch(err => {
        setError(err.message);
        console.error('Failed to load batch info:', err);
      })
      .finally(() => setLoading(false));
  }, [orderId, token]);

  return { batchInfo, loading, error };
}
```

**Usage**:
```jsx
const { batchInfo } = useFEFOBatchInfo(orderId, token);

{batchInfo && batchInfo.map(batch => (
  <div key={batch.id}>
    <p>Batch #{batch.idPhieuNhap}</p>
    <p>Hạn: {formatDate(batch.hanSuDung)}</p>
    <p>Còn: {batch.soLuongConLai} units</p>
  </div>
))}
```

---

## 📄 API Service Implementation

### File: `src/services/api/orderApi.js`

**Endpoints**:
```javascript
import api from './index';

// Create order
export const createOrder = (orderData, token) => {
  return api.post('/api/don-hang', orderData, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Get order details
export const getOrderDetail = (orderId, token) => {
  return api.get(`/api/don-hang/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};

// Get order history
export const getOrderHistory = (userId, token) => {
  return api.get(`/api/don-hang/lich-su?userId=${userId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};
```

---

## 🧩 Page Components

### Page 1: ShippingFormPage

**File**: `src/pages/public/checkout/ShippingFormPage.jsx`

**Features**:
- Form nhập thông tin giao hàng
- Button "Dùng thông tin profile" auto-fill
- Validate form
- Submit → order creation

**Key Code**:
```jsx
export default function ShippingFormPage() {
  const [formData, setFormData] = useState({
    tenNguoiNhan: '',
    soDienThoai: '',
    diaChiGiaoHang: '',
    phuongThucThanhToan: 'COD'
  });

  const { profileData } = useAutoFillShipping(userId, token);

  const handleAutoFill = () => {
    if (profileData) {
      setFormData(prev => ({
        ...prev,
        tenNguoiNhan: profileData.tenNguoiNhan,
        soDienThoai: profileData.soDienThoai,
        diaChiGiaoHang: profileData.diaChiGiaoHang
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const orderData = {
      idNguoiDung: userId,
      ...formData,
      items: cartItems
    };
    
    const response = await createOrder(orderData, token);
    navigate(`/order-confirmation/${response.idDonHang}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="button" onClick={handleAutoFill}>
        Dùng thông tin profile
      </button>
      
      <input
        value={formData.tenNguoiNhan}
        onChange={(e) => setFormData({...formData, tenNguoiNhan: e.target.value})}
      />
      
      <input
        value={formData.soDienThoai}
        onChange={(e) => setFormData({...formData, soDienThoai: e.target.value})}
      />
      
      <textarea
        value={formData.diaChiGiaoHang}
        onChange={(e) => setFormData({...formData, diaChiGiaoHang: e.target.value})}
      />
      
      <select
        value={formData.phuongThucThanhToan}
        onChange={(e) => setFormData({...formData, phuongThucThanhToan: e.target.value})}
      >
        <option value="COD">Thanh toán khi nhận hàng</option>
        <option value="TRANSFER">Chuyển khoản</option>
      </select>
      
      <button type="submit">Đặt Hàng</button>
    </form>
  );
}
```

---

### Page 2: OrderConfirmationPage

**File**: `src/pages/public/orders/OrderConfirmationPage.jsx`

**Features**:
- Hiển thị Order ID
- Hiển thị FEFO batch info
- Link tới order history

**Key Code**:
```jsx
export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const { batchInfo } = useFEFOBatchInfo(orderId, token);

  useEffect(() => {
    getOrderDetail(orderId, token).then(setOrder);
  }, [orderId]);

  return (
    <div className="order-confirmation">
      <h2>✓ Đơn Hàng #{orderId}</h2>
      
      <div className="order-info">
        <p>Người nhận: {order?.tenNguoiNhan}</p>
        <p>Địa chỉ: {order?.diaChiGiaoHang}</p>
        <p>Tổng tiền: {order?.tongTien} VND</p>
      </div>

      <div className="fefo-info">
        <h3>📦 Thông Tin Batch (FEFO)</h3>
        {batchInfo?.map(batch => (
          <div key={batch.id} className="batch-card">
            <p><strong>Batch ID:</strong> #{batch.idPhieuNhap}</p>
            <p><strong>Hạn sử dụng:</strong> {formatDate(batch.hanSuDung)}</p>
            <p><strong>Tồn kho:</strong> {batch.soLuongConLai} units</p>
            <p><strong>Sản phẩm:</strong> {batch.soLuong}x {batch.sanPham}</p>
          </div>
        ))}
      </div>

      <button onClick={() => navigate('/orders')}>
        Xem lịch sử đơn hàng
      </button>
    </div>
  );
}
```

---

### Page 3: OrderHistoryPage

**File**: `src/pages/public/orders/OrderHistoryPage.jsx`

**Features**:
- Danh sách tất cả đơn hàng của user
- Click order → view details + FEFO info

**Key Code**:
```jsx
export default function OrderHistoryPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getOrderHistory(userId, token).then(setOrders);
  }, []);

  return (
    <div className="order-history">
      <h2>Lịch Sử Đơn Hàng</h2>
      
      {orders.map(order => (
        <div 
          key={order.idDonHang} 
          className="order-card"
          onClick={() => navigate(`/order-confirmation/${order.idDonHang}`)}
        >
          <p className="order-id">Đơn #({order.idDonHang})</p>
          <p className="order-status">{order.trangThaiVanHanh}</p>
          <p className="order-total">{order.tongTien} VND</p>
          <p className="order-date">{formatDate(order.ngayDatHang)}</p>
        </div>
      ))}
    </div>
  );
}
```

---

## 📋 Data Flow Diagram

```
┌──────────────────────────────────────────────────┐
│ Login Form                                        │
│ - Email, Password                                │
│ - Store token → localStorage                     │
└──────────────┬───────────────────────────────────┘
               │
               ↓
┌──────────────────────────────────────────────────┐
│ Checkout Page                                    │
│ - Call useAutoFillShipping()                     │
│ - GET /api/user/profile → get user data         │
│ - Button: "Dùng thông tin profile"              │
│ - Form fields auto-filled with profile data     │
└──────────────┬───────────────────────────────────┘
               │
               ↓
┌──────────────────────────────────────────────────┐
│ Place Order (Submit Form)                        │
│ - POST /api/don-hang                            │
│ - Include: user info, items, payment method     │
│ - Backend: FEFO allocation → select batch       │
│ - Response: Order ID                            │
└──────────────┬───────────────────────────────────┘
               │
               ↓
┌──────────────────────────────────────────────────┐
│ Order Confirmation Page                          │
│ - Display Order ID                              │
│ - Call useFEFOBatchInfo()                       │
│ - GET /api/don-hang/{id}                        │
│ - Extract FEFO data:                            │
│   • idPhieuNhap (Batch ID)                      │
│   • hanSuDung (Expiry date)                     │
│   • soLuongConLai (Remaining stock)             │
│ - Display batch info to user                    │
└──────────────┬───────────────────────────────────┘
               │
               ↓
┌──────────────────────────────────────────────────┐
│ Order History Page                               │
│ - Display all user orders                       │
│ - Click order → view confirmation page          │
└──────────────────────────────────────────────────┘
```

---

## ✅ Validation Rules

### Form Validation (Checkout)
```javascript
const validateForm = (formData) => {
  const errors = {};
  
  if (!formData.tenNguoiNhan?.trim()) {
    errors.tenNguoiNhan = 'Tên không được để trống';
  }
  
  if (!formData.soDienThoai?.trim()) {
    errors.soDienThoai = 'Số điện thoại không được để trống';
  } else if (!/^\d{10}$/.test(formData.soDienThoai.replace(/\D/g, ''))) {
    errors.soDienThoai = 'Số điện thoại không hợp lệ';
  }
  
  if (!formData.diaChiGiaoHang?.trim()) {
    errors.diaChiGiaoHang = 'Địa chỉ không được để trống';
  }
  
  return errors;
};
```

---

## 🎨 CSS Styling Tips

### Auto-fill Button
```css
.auto-fill-btn {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.auto-fill-btn:hover {
  background-color: #45a049;
}
```

### FEFO Batch Info Card
```css
.batch-card {
  border: 1px solid #e0e0e0;
  padding: 15px;
  margin: 10px 0;
  border-radius: 4px;
  background-color: #f9f9f9;
}

.batch-card p {
  margin: 5px 0;
  font-size: 14px;
}

.batch-card strong {
  color: #333;
  min-width: 100px;
}
```

---

## 🔒 Security Considerations

1. **Token Storage**: Store JWT in sessionStorage (not localStorage) for sensitive operations
2. **Token Refresh**: Implement token refresh logic before API calls
3. **Input Validation**: Validate all form inputs before submission
4. **CORS**: Ensure backend has proper CORS headers
5. **Error Messages**: Don't expose internal errors to users

---

## 🧪 Testing Checklist

- [ ] Auto-fill shipping: Click button → form populated
- [ ] Form validation: Submit empty form → show error messages
- [ ] Create order: Submit form → redirect to confirmation page
- [ ] Display FEFO info: Confirmation page shows batch details
- [ ] Order history: Load and display all orders
- [ ] Click order: Navigate to confirmation page
- [ ] Response time: API calls complete within 3 seconds
- [ ] Error handling: Display meaningful errors when API fails

---

## 📝 Summary

**FEFO Frontend Implementation** bao gồm:
1. ✅ Auto-fill shipping info từ profile
2. ✅ Create order với items
3. ✅ Display FEFO batch info sau order
4. ✅ View order history
5. ✅ Form validation & error handling

**Next Steps**:
- Deploy frontend
- Test with backend
- Monitor batch allocation in database