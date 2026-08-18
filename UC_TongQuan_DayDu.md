# USE CASE DIAGRAM - HƯỚNG DẪN VẼ DRAW.IO

## Tổng số: 112 Use Cases - Chia thành 6 Diagrams

---

## **DIAGRAM 1: UC KHÁCH HÀNG (32 UC)**

### **Actors:**
- **Khách hàng** (Customer) - Bên trái
- **Hệ thống PayOS** (External System) - Bên phải

### **System Boundary:** "Hệ thống Perfume Shop"

### **Use Cases (Sắp xếp từ trên xuống):**

#### **NHÓM A: XÁC THỰC & TÀI KHOẢN (8 UC)**
```
UC1: Đăng ký tài khoản
  ├─ «include» → UC1.1: Gửi email xác thực
  
UC2: Xác thực email (từ link)

UC3: Gửi lại email xác thực

UC4: Kiểm tra trạng thái xác thực

UC5: Đăng nhập

UC6: Quản lý tài khoản cá nhân
  ├─ «include» → UC6.1: Xem thông tin
  ├─ «include» → UC6.2: Cập nhật thông tin
  └─ «include» → UC6.3: Đổi mật khẩu
```

#### **NHÓM B: DUYỆT SẢN PHẨM (6 UC)**
```
UC9: Tìm kiếm sản phẩm
  ├─ «extend» → Lọc theo danh mục
  ├─ «extend» → Lọc theo thương hiệu
  ├─ «extend» → Lọc theo nồng độ
  ├─ «extend» → Lọc theo giá
  └─ «extend» → Sắp xếp kết quả

UC10: Xem danh sách danh mục

UC11: Xem danh sách thương hiệu

UC12: Xem chi tiết sản phẩm
  └─ «include» → UC14: Xem đánh giá

UC13: Xem sản phẩm liên quan
```

#### **NHÓM C: GIỎ HÀNG (5 UC)**
```
UC15: Quản lý giỏ hàng
  ├─ «include» → UC16: Thêm sản phẩm vào giỏ
  ├─ «include» → UC17: Cập nhật số lượng
  ├─ «include» → UC18: Xóa sản phẩm
  └─ «include» → UC19: Xóa toàn bộ giỏ
```

#### **NHÓM D: ĐẶT HÀNG & THANH TOÁN (3 UC)**
```
UC20: Đặt hàng (Checkout)
  └─ «include» → Chọn phương thức thanh toán
  
UC21: Thanh toán online PayOS [→ Kết nối với Actor PayOS]
  ├─ «include» → Webhook xác nhận
  └─ «include» → Polling kiểm tra trạng thái
  
UC22: Cập nhật trạng thái thanh toán (manual)
```

#### **NHÓM E: QUẢN LÝ ĐƠN HÀNG (4 UC)**
```
UC23: Xem lịch sử đơn hàng

UC24: Xem chi tiết đơn hàng

UC25: Hủy đơn hàng

UC26: Tra cứu theo mã vận đơn
```

#### **NHÓM F: ĐỔI TRẢ (3 UC)**
```
UC27: Kiểm tra trạng thái đổi trả

UC28: Tạo yêu cầu đổi trả

UC29: Xem chi tiết phiếu đổi trả
```

#### **NHÓM G: ĐÁNH GIÁ (2 UC)**
```
UC30: Viết đánh giá sản phẩm

UC31: Xem đánh giá của mình
```

#### **NHÓM H: KHUYẾN MÃI (1 UC)**
```
UC32: Xem chiến dịch khuyến mãi active
```

---

## **DIAGRAM 2: UC ADMIN/STORE MANAGER (39 UC)**

### **Actors:**
- **Admin/Store Manager** - Bên trái

### **System Boundary:** "Hệ thống quản trị Perfume Shop"

### **Use Cases:**

#### **NHÓM A: QUẢN LÝ SẢN PHẨM (6 UC)**
```
UC33: Xem danh sách sản phẩm

UC34: Tạo sản phẩm mới

UC35: Cập nhật sản phẩm

UC36: Xóa sản phẩm

UC37: Quản lý danh mục (CRUD)

UC38: Quản lý thương hiệu (CRUD)
```

#### **NHÓM B: QUẢN LÝ ĐƠN HÀNG (9 UC)**
```
UC39: Xem danh sách đơn hàng
  └─ «include» → Lọc theo trạng thái

UC40: Xem chi tiết đơn hàng

UC41: Xác nhận đơn hàng
  ├─ «include» → Trừ kho FEFO multi-batch
  └─ «include» → Ghi log biến động kho

UC42: Giao hàng (Ship)
  └─ «extend» → UC47: Xem Pick List FEFO

UC43: Cập nhật mã vận đơn

UC44: Hoàn thành đơn hàng

UC45: Hủy đơn hàng
  └─ «include» → Hoàn kho (nếu đã trừ)

UC46: Đánh dấu đã hoàn tiền

UC47: Xem Pick List FEFO (danh sách lấy hàng theo lô)
```

#### **NHÓM C: QUẢN LÝ ĐỔI TRẢ (5 UC)**
```
UC48: Xem danh sách đổi trả chờ duyệt

UC49: Xem tất cả phiếu đổi trả

UC50: Duyệt đổi trả
  └─ «include» → Chuyển hàng sang so_luong_hang_loi

UC51: Xác nhận đã hoàn tiền

UC52: Từ chối đổi trả
```

#### **NHÓM D: QUẢN LÝ KHUYẾN MÃI (5 UC)**
```
UC53: Xem danh sách chiến dịch

UC54: Tạo chiến dịch khuyến mãi

UC55: Cập nhật chiến dịch

UC56: Xóa chiến dịch

UC57: Gán sản phẩm vào chiến dịch
  └─ «include» → Transaction (xóa cũ + chèn mới)
```

#### **NHÓM E: QUẢN LÝ NGƯỜI DÙNG (12 UC)**
```
UC58: Xem danh sách khách hàng

UC59: Tạo khách hàng

UC60: Cập nhật khách hàng

UC61: Xóa khách hàng

UC62: Reset mật khẩu khách hàng

UC63: ⭐ Duyệt khách hàng thành NCC

UC64: ⭐ Hủy vai trò NCC

UC65: Xem danh sách nhân viên

UC66: Tạo nhân viên

UC67: Cập nhật vai trò nhân viên

UC68: Reset mật khẩu nhân viên

UC69: Xóa nhân viên
```

#### **NHÓM F: QUẢN LÝ ĐÁNH GIÁ (2 UC)**
```
UC70: Xem tất cả đánh giá

UC71: Xóa đánh giá (nếu vi phạm)
```

---

## **DIAGRAM 3: UC NHÂN VIÊN KHO (16 UC)**

### **Actors:**
- **Nhân viên kho** (Warehouse Staff) - Bên trái
- **Cửa hàng** (Store - optional, có thể gộp vào Admin)

### **System Boundary:** "Hệ thống quản lý kho"

### **Use Cases:**

#### **NHÓM A: QUẢN LÝ KHO CƠ BẢN (8 UC)**
```
UC72: Xem tồn kho

UC73: Nhập kho qua CSV/Excel
  ├─ «include» → UC73.1: Upload và preview
  ├─ «include» → UC73.2: Sửa dòng preview
  ├─ «include» → UC73.3: Xóa dòng preview
  ├─ «include» → UC73.4: Thêm dòng thủ công
  └─ «include» → UC73.5: Xác nhận nhập kho

UC74: Xem biến động kho

UC75: Xem cảnh báo HSD
  ├─ «extend» → Lọc gần hết hạn (< 30 ngày)
  └─ «extend» → Lọc hết hạn

UC76: Validate HSD

UC77: Xem lô hàng (batch)

UC78: Xem sản phẩm bán chậm
```

#### **NHÓM B: QUẢN LÝ PHIẾU NHẬP (2 UC)**
```
UC79: Xem lịch sử phiếu nhập

UC80: Xem chi tiết phiếu nhập
```

#### **NHÓM C: QUẢN LÝ HÀNG LỖI (2 UC)**
```
UC81: Xem hàng lỗi chờ trả NCC

UC82: Xuất hàng lỗi trả NCC
```

#### **NHÓM D: QUẢN LÝ PO (Purchase Order) - ⭐ QUAN TRỌNG (4 UC)**
```
UC83: Xem PO chờ kho kiểm tra

UC84: Kho xác nhận PO
  ├─ «include» → Cập nhật số lượng thực nhận
  ├─ «include» → Ghi nhận hàng lỗi
  └─ «include» → Upload hình ảnh

UC85: Xem PO chờ Admin duyệt cuối

UC86: Admin duyệt PO cuối
  ├─ «include» → Cộng kho
  └─ «include» → Ghi log biến động

UC87: Admin từ chối PO
```

---

## **DIAGRAM 4: UC NHÀ CUNG CẤP (8 UC)**

### **Actors:**
- **Nhà cung cấp** (Supplier) - Bên trái
- **Admin** (phía duyệt) - Bên phải

### **System Boundary:** "Supplier Portal & Procurement"

### **Use Cases:**

#### **NHÓM A: ĐẤU THẦU (4 UC)**
```
UC88: Xem phiếu gợi thầu

UC89: Xem chi tiết phiếu đấu thầu

UC90: Gửi báo giá

UC91: ⭐ Xem lịch sử báo giá của mình
```

#### **NHÓM B: ĐỀ XUẤT SẢN PHẨM (4 UC)**
```
UC92: Xem trạng thái đề xuất

UC93: Đề xuất sản phẩm đơn lẻ (form)

UC94: ⭐ Tải template CSV

UC95: Đề xuất sản phẩm qua CSV
  ├─ «include» → Upload file CSV
  ├─ «include» → Xem preview
  └─ «include» → Xác nhận (bulk confirm)
```

#### **ADMIN DUYỆT ĐỀ XUẤT (3 UC)**
```
UC96: Xem tất cả đề xuất từ NCC

UC97: Duyệt đề xuất
  └─ «include» → Thêm vào san_pham (nếu chưa có)

UC98: Từ chối đề xuất
```

---

## **DIAGRAM 5: UC GIÁM ĐỐC/DIRECTOR (9 UC)**

### **Actors:**
- **Giám đốc** (Director) - Bên trái
- **Admin** (chia sẻ một số UC) - Bên phải

### **System Boundary:** "Hệ thống báo cáo & giám sát"

### **Use Cases:**

#### **NHÓM A: DASHBOARD (3 UC)**
```
UC99: Xem dashboard tổng quan
  ├─ «include» → Thống kê tổng quan
  └─ «include» → Cảnh báo hệ thống

UC100: Xem đơn hàng gần nhất

UC101: Xem cảnh báo (alerts)
```

#### **NHÓM B: BÁO CÁO (5 UC)**
```
UC102: Báo cáo tổng hợp
  ├─ «include» → Tổng doanh thu
  ├─ «include» → Tổng đơn hàng
  ├─ «include» → Tổng khách hàng
  └─ «extend» → Lọc theo khoảng thời gian

UC103: Báo cáo sản phẩm bán chạy (Top N)

UC104: Báo cáo doanh thu theo trạng thái đơn

UC105: Xuất báo cáo CSV
  ├─ «extend» → Từ UC102
  ├─ «extend» → Từ UC103
  └─ «extend» → Từ UC104

UC107: ⭐ Xem báo cáo biến động kho
```

#### **NHÓM C: LOG & BẢO MẬT (1 UC)**
```
UC106: Xem log đăng nhập
  ├─ «extend» → Lọc theo tên đăng nhập
  ├─ «extend» → Lọc theo vai trò
  ├─ «extend» → Lọc theo trạng thái (success/failed)
  └─ «extend» → Lọc theo khoảng thời gian
```

---

## **DIAGRAM 6: UC QUẢN LÝ ĐẤU THẦU NCC (5 UC)**

### **Actors:**
- **Admin/Store Manager** - Bên trái
- **Nhà cung cấp** - Bên phải (reference)

### **System Boundary:** "Hệ thống đấu thầu & mua hàng"

### **Use Cases:**

```
UC108: Tạo phiếu gợi thầu (yêu cầu báo giá)

UC109: ⭐ Xem danh sách đấu thầu

UC110: So sánh báo giá từ nhiều NCC

UC111: Chốt thầu
  ├─ «include» → ⭐ UPDATE san_pham.gia_ban = gia_ban_chot
  ├─ «include» → Tính DSV (Q = V×T + V×5 - I)
  └─ «extend» → UC86: Sinh PO (Purchase Order)

UC112: ⭐ Hủy phiếu đấu thầu (khi chưa có báo giá)
```

---

## **CHÚ THÍCH MÀU SẮC TRONG DRAW.IO**

### **Màu UC:**
- **Trắng/Xanh nhạt (#E1F5FF)**: Use case «include» (bắt buộc thực hiện)
- **Vàng nhạt (#FFF9C4)**: Use case «extend» (tùy chọn, mở rộng)
- **Xanh lá nhạt (#C8E6C9)**: Use case kết nối với external actor (PayOS, Email service)
- **Đỏ nhạt (#FFEBEE)**: Use case quan trọng ⭐ (cần chú ý đặc biệt)

### **Kiểu mũi tên:**
- **Liền nét →** : Association (liên kết giữa Actor và UC)
- **Đứt nét → «include»**: Include relationship (UC chính bắt buộc gọi UC phụ)
- **Đứt nét → «extend»**: Extend relationship (UC mở rộng tùy chọn)

---

## **HƯỚNG DẪN VẼ TRONG DRAW.IO**

### **Bước 1: Tạo Actor**
1. File → New → Blank Diagram
2. Từ panel trái, chọn **UML** → kéo **Actor** vào canvas
3. Đặt tên actor (double-click để edit)

### **Bước 2: Tạo System Boundary**
1. Chọn **UML** → kéo **Container** (hoặc dùng Rectangle với label)
2. Đặt tên: "Hệ thống Perfume Shop"
3. Resize để chứa tất cả use cases

### **Bước 3: Tạo Use Case**
1. Chọn **UML** → kéo **Use Case** (ellipse) vào trong boundary
2. Đặt tên use case theo format: "UC#: Tên use case"
3. Thêm màu sắc: Click chuột phải → Style → Fill Color

### **Bước 4: Kết nối**
1. **Actor → UC**: Dùng connector thường (solid line)
2. **UC → UC (include)**: 
   - Dùng dashed line
   - Thêm label "«include»" ở giữa
   - Mũi tên hướng từ UC chính → UC phụ
3. **UC → UC (extend)**:
   - Dùng dashed line
   - Thêm label "«extend»"
   - Mũi tên hướng từ UC mở rộng → UC chính

### **Bước 5: Sắp xếp Layout**
- **Actor**: Đặt bên trái hoặc bên phải boundary
- **UC chính**: Gần actor nhất
- **UC phụ (include/extend)**: Xa hơn, group theo chức năng
- **Dùng Grid**: View → Grid để align chính xác

---

## **FILE XML ĐƠN GIẢN HÓA**

Tôi sẽ tạo tiếp 5 file XML còn lại với cấu trúc đơn giản hơn để bạn import vào Draw.io.

