# HƯỚNG DẪN SỬ DỤNG FILE USE CASE DIAGRAM

## 📁 File đã tạo: `UC_12UC_Complete.drawio`

### ✅ Nội dung file

File Draw.io XML chứa **Use Case Diagram hoàn chỉnh** cho hệ thống Perfume Shop với:

---

## 🎯 **12 USE CASES**

### **1. Khách hàng (5 UC - Màu xanh dương)**
- **UC-05**: Đăng ký và xác thực email
- **UC-10**: Tìm kiếm và duyệt sản phẩm
- **UC-11**: Quản lý giỏ hàng
- **UC-01**: Đặt hàng
- **UC-08**: QR code đơn hàng (tra cứu)

### **2. Cửa hàng trưởng / Admin (6 UC - Màu xanh lá)**
- **UC-02**: Xác nhận đơn hàng
- **UC-03**: Chốt thầu NCC
- **UC-06**: Duyệt phiếu nhập kho
- **UC-08**: QR code đơn hàng (sinh mã)
- **UC-09**: Quản lý khuyến mãi

### **3. Nhà cung cấp (2 UC - Màu cam)**
- **UC-07**: NCC đề xuất SP mới
- **UC-03**: Chốt thầu NCC (gửi báo giá)

### **4. Giám đốc (1 UC - Màu đỏ)**
- **UC-12**: Báo cáo và thống kê

### **5. UC dùng chung (2 UC - Màu vàng)**
- **UC-04**: Đổi trả hàng (Khách hàng + Admin)
- **UC-08**: QR code (Khách + Admin)

---

## 📐 **CÁC QUAN HỆ GIỮA USE CASES**

### **«include» (Bắt buộc thực hiện)**
```
UC-10 (Tìm kiếm SP)
  └─ «include» → UC-11 (Quản lý giỏ hàng)
      └─ «include» → UC-01 (Đặt hàng)
```

### **«extend» (Mở rộng tùy chọn)**
```
UC-02 (Xác nhận đơn)
  └─ «extend» → UC-04 (Đổi trả hàng)
```

### **«related» (Liên quan)**
```
UC-02 (Xác nhận đơn) ↔ UC-08 (QR code)
UC-06 (Duyệt phiếu nhập) ↔ UC-03 (Chốt thầu)
```

### **«affects» (Ảnh hưởng)**
```
UC-09 (Khuyến mãi) → UC-11 (Giỏ hàng - giảm giá)
```

---

## 🎨 **5 ACTORS**

| Actor | Số lượng UC | Màu sắc | Vai trò |
|-------|-------------|---------|---------|
| **Khách hàng** | 5 UC | Xanh dương | Người mua hàng |
| **Cửa hàng trưởng** | 6 UC | Xanh lá | Quản lý hệ thống |
| **Nhà cung cấp** | 2 UC | Cam | Cung cấp sản phẩm |
| **Giám đốc** | 1 UC | Đỏ | Xem báo cáo |
| **PayOS** | 1 UC | Xám | Hệ thống bên ngoài |

---

## 📖 **CÁCH MỞ VÀ CHỈNH SỬA**

### **Bước 1: Mở file**
1. Truy cập: https://app.diagrams.net (Draw.io online)
2. Chọn "Open Existing Diagram"
3. Chọn file: `UC_12UC_Complete.drawio`

### **Bước 2: Chỉnh sửa**
- **Di chuyển Use Case**: Click và kéo ellipse
- **Thay đổi text**: Double-click vào ellipse hoặc actor
- **Thêm Use Case mới**:
  1. Kéo "Ellipse" từ thanh bên trái
  2. Đặt vào trong System Boundary
  3. Double-click để đổi tên
  4. Chọn màu: Right-click → Style → Fill Color

- **Thêm Actor mới**:
  1. Tìm "UML Actor" trong thanh bên trái
  2. Kéo vào ngoài System Boundary
  3. Kết nối với Use Case: Chọn "Connector" và kéo từ Actor đến UC

- **Thêm quan hệ «include»/«extend»**:
  1. Chọn "Dashed Line" (đường nét đứt)
  2. Kéo từ UC nguồn đến UC đích
  3. Double-click vào đường → Gõ: `«include»` hoặc `«extend»`

### **Bước 3: Xuất hình**
- **PNG**: File → Export as → PNG (chọn độ phân giải 300 DPI)
- **PDF**: File → Export as → PDF (cho in ấn)
- **SVG**: File → Export as → SVG (vector, chất lượng cao)

---

## 🔧 **CHỈNH SỬA CỤ THỂ**

### **Thay đổi vị trí Use Case**
Nếu muốn sắp xếp lại vị trí các UC, chỉnh sửa tọa độ trong XML:

```xml
<mxCell id="uc01" value="UC-01&#xa;Đặt hàng" ...>
  <mxGeometry x="400" y="400" width="140" height="70" as="geometry" />
  <!--         ↑     ↑       ↑        ↑                              -->
  <!--         x     y    width    height                           -->
</mxCell>
```

**Gợi ý layout:**
- **X**: Tăng để dịch sang phải (400-800)
- **Y**: Tăng để dịch xuống dưới (100-1600)
- **Width**: Chiều rộng ellipse (120-180)
- **Height**: Chiều cao ellipse (60-80)

---

## 📋 **CHECKLIST TRƯỚC KHI NỘP LVTN**

### **1. Kiểm tra tính đầy đủ**
- [ ] 12 Use Cases có đầy đủ
- [ ] 5 Actors hiển thị đúng
- [ ] System Boundary ("Hệ thống Perfume Shop") bao quanh tất cả UC
- [ ] Legend (chú thích) đầy đủ

### **2. Kiểm tra quan hệ**
- [ ] UC-10 → UC-11 → UC-01 có đường «include»
- [ ] UC-02 → UC-04 có đường «extend»
- [ ] UC-02 ↔ UC-08 có đường «related»
- [ ] UC-06 ↔ UC-03 có đường «related»
- [ ] UC-09 → UC-11 có đường «affects»

### **3. Kiểm tra kết nối Actor**
- [ ] Khách hàng → UC-05, UC-10, UC-11, UC-01, UC-04, UC-08
- [ ] Admin → UC-02, UC-03, UC-04, UC-06, UC-08, UC-09
- [ ] Nhà cung cấp → UC-03, UC-07
- [ ] Giám đốc → UC-12
- [ ] PayOS → UC-01 (nét đứt)

### **4. Kiểm tra định dạng**
- [ ] Tất cả UC đều là ellipse (hình bầu dục)
- [ ] Actors đều là stick figure (hình người que)
- [ ] Màu sắc nhất quán theo từng nhóm
- [ ] Font chữ rõ ràng (Arial hoặc Tahoma, size 12-14)

### **5. Xuất hình chất lượng cao**
- [ ] Xuất PNG 300 DPI
- [ ] Hoặc xuất PDF vector
- [ ] Không bị vỡ hình khi phóng to

---

## 🚀 **TẠO HÌNH NHANH (1 PHÚT)**

### **Nếu không muốn chỉnh sửa**

1. Mở https://app.diagrams.net
2. File → Open → Chọn `UC_12UC_Complete.drawio`
3. File → Export as → PNG
4. Chọn:
   - **Zoom**: 100%
   - **DPI**: 300
   - **Transparent background**: ☑ (nếu muốn nền trong suốt)
   - **Border width**: 10px
5. Click "Export"
6. Lưu file: `UC_Diagram_12UC.png`
7. Dán vào Word/Overleaf

---

## 📝 **GỢI Ý CHÈN VÀO LVTN**

### **Vị trí đề xuất:**
- **Chương 3: Phân tích và thiết kế hệ thống**
  - Mục **3.1.2: Sơ đồ Use Case tổng quan**

### **Mô tả hình trong LVTN:**

```
Hình 3.X: Sơ đồ Use Case tổng quan hệ thống Perfume Shop

Sơ đồ Use Case trên mô tả 12 chức năng chính của hệ thống, 
được phân loại theo 5 actors:

- Khách hàng: Tìm kiếm, duyệt sản phẩm, quản lý giỏ hàng, đặt hàng, 
  đăng ký tài khoản, đổi trả hàng, và tra cứu đơn qua QR code.

- Cửa hàng trưởng: Xác nhận đơn hàng, duyệt phiếu nhập kho, 
  chốt thầu nhà cung cấp, quản lý chiến dịch khuyến mãi, 
  và sinh QR code xác nhận.

- Nhà cung cấp: Đề xuất sản phẩm mới qua form hoặc CSV, 
  và gửi báo giá trong quy trình đấu thầu.

- Giám đốc: Xem báo cáo doanh thu, biến động kho, 
  và log đăng nhập của nhân viên.

- PayOS (hệ thống bên ngoài): Xử lý thanh toán trực tuyến 
  cho đơn hàng.

Các Use Case có mối quan hệ «include» (bắt buộc), 
«extend» (mở rộng tùy chọn), «related» (liên quan), 
và «affects» (ảnh hưởng) thể hiện tính logic và 
tương tác giữa các chức năng.
```

---

## 🎯 **TÓM TẮT**

✅ **File đã tạo**: `UC_12UC_Complete.drawio`

✅ **Nội dung**: 
- 12 Use Cases
- 5 Actors
- System Boundary
- Relationships (include, extend, related, affects)
- Legend (chú thích đầy đủ)

✅ **Cách dùng**:
1. Mở bằng Draw.io (app.diagrams.net)
2. Chỉnh sửa nếu cần
3. Xuất PNG/PDF
4. Dán vào LVTN

✅ **Liên kết với các file khác**:
- `UC_ChiTiet_12UC.md` → Mô tả chi tiết 12 UC
- `UC_LVTN_Review.md` → Đánh giá và gợi ý bổ sung
- `UC_TongQuan_DayDu.md` → Hướng dẫn vẽ 112 UC đầy đủ
- `UC_LIST_FULL.txt` → Danh sách ASCII 112 UC
- `UC_Mapping_Controller_Endpoint.csv` → Mapping UC ↔ Code

---

**Chúc bạn hoàn thành tốt luận văn! 🎓**
