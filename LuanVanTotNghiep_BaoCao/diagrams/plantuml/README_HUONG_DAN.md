# HƯỚNG DẪN SỬ DỤNG 3 SƠ ĐỒ ERD PLANTUML

## 📁 CẤU TRÚC FILE

Bạn có 3 file PlantUML:

1. **`01_ERD_Y_NIEM_Conceptual.puml`** - Sơ đồ Ý niệm (Conceptual)
2. **`02_ERD_LOGIC_Logical.puml`** - Sơ đồ Logic (Logical) 
3. **`03_ERD_VAT_LY_Physical.puml`** - Sơ đồ Vật lý (Physical)

---

## 🎯 CÁCH 1: SỬ DỤNG PLANTUML ONLINE (KHUYẾN NGHỊ)

### Bước 1: Truy cập PlantUML Online
Mở trình duyệt và truy cập: **https://www.plantuml.com/plantuml/uml/**

### Bước 2: Copy code
- Mở file `.puml` bằng Notepad hoặc VSCode
- Copy TOÀN BỘ nội dung file

### Bước 3: Paste và render
- Paste code vào ô text trên website PlantUML
- Nhấn **Submit** hoặc đợi auto-render
- Sơ đồ sẽ hiển thị bên phải

### Bước 4: Export ảnh
- Nhấn nút **PNG** để tải ảnh PNG
- Hoặc nhấn **SVG** để tải vector (chất lượng cao hơn)
- Lưu file với tên:
  - `Hinh_3-1_ERD_Y_Niem.png`
  - `Hinh_3-2_ERD_Logic.png`
  - `Hinh_3-3_ERD_Vat_Ly.png`

---

## 🎯 CÁCH 2: SỬ DỤNG DRAW.IO

### Bước 1: Mở Draw.io
Truy cập: **https://app.diagrams.net/**

### Bước 2: Tạo diagram mới
- Chọn **Create New Diagram**
- Chọn template **Blank Diagram** → **Create**

### Bước 3: Import PlantUML
- Vào menu **Arrange** → **Insert** → **Advanced** → **PlantUML...**
- Paste code từ file `.puml`
- Nhấn **Insert**

### Bước 4: Chỉnh sửa (nếu cần)
- Di chuyển các entity để bố cục đẹp hơn
- Thay đổi màu sắc nếu muốn
- Thêm/xóa relationship

### Bước 5: Export ảnh
- Vào **File** → **Export as** → **PNG...**
- Chọn độ phân giải: **300 DPI**
- Tick **Transparent Background** (nếu muốn)
- Nhấn **Export**

---

## 🎯 CÁCH 3: SỬ DỤNG VSCODE (CHO DEVELOPER)

### Bước 1: Cài đặt extension
1. Mở VSCode
2. Cài extension **PlantUML** (tác giả: jebbs)
3. Cài Java (PlantUML cần Java để chạy):
   - Download từ https://www.java.com/
   - Hoặc cài OpenJDK

### Bước 2: Mở file .puml
- Mở file `.puml` trong VSCode
- Nhấn **Alt + D** để preview

### Bước 3: Export ảnh
- Click chuột phải vào preview
- Chọn **Export Current Diagram**
- Chọn format: **PNG** hoặc **SVG**
- Chọn độ phân giải: **300 DPI**

---

## 📋 SO SÁNH 3 SƠ ĐỒ

| Đặc điểm | Ý Niệm | Logic | Vật Lý |
|----------|--------|-------|--------|
| **Mục đích** | Mô tả nghiệp vụ | Thiết kế chi tiết | Triển khai thực tế |
| **Thuộc tính** | Không có | Đầy đủ | Đầy đủ + constraint |
| **Kiểu dữ liệu** | Không | Có | Có + MySQL specific |
| **Constraint** | Không | PK, FK, UK | PK, FK, UK, NOT NULL, DEFAULT, INDEX |
| **Tên bảng** | Tiếng Việt | PascalCase | snake_case |
| **Đối tượng** | Quản lý, khách hàng | DBA, Architect | Developer, DBA |

---

## 🎨 CHỈNH SỬA MÀU SẮC

Nếu muốn thay đổi màu sắc, sửa trong code PlantUML:

```plantuml
skinparam entity {
  BackgroundColor #dae8fc  ' Màu nền entity (xanh nhạt)
  BorderColor #6c8ebf      ' Màu viền (xanh đậm)
  FontSize 10              ' Cỡ chữ
}
```

**Gợi ý màu:**
- Entity: `#dae8fc` (xanh nhạt)
- Primary Table: `#fff2cc` (vàng nhạt) 
- Junction Table: `#e1d5e7` (tím nhạt)

---

## 📐 KÍCH THƯỚC KHUYẾN NGHỊ

Khi export ảnh cho luận văn:

- **Độ phân giải:** 300 DPI (cho in ấn chất lượng cao)
- **Width:** 1920px - 2400px
- **Format:** PNG (nếu có background) hoặc SVG (vector, zoom không mất chất lượng)
- **Transparent:** Không (để giữ màu nền trắng khi in)

---

## ✅ CHECKLIST TRƯỚC KHI CHÈN VÀO LUẬN VĂN

- [ ] Đã render cả 3 sơ đồ thành công
- [ ] Export ảnh độ phân giải >= 300 DPI
- [ ] Đặt tên file theo quy ước: `Hinh_3-X_Ten_So_Do.png`
- [ ] Kiểm tra các relationship hiển thị rõ ràng
- [ ] Kiểm tra không có chữ bị cắt xén
- [ ] Đã đánh số thứ tự hình trong luận văn:
  - Hình 3-1: Sơ đồ ERD Ý niệm
  - Hình 3-2: Sơ đồ ERD Logic
  - Hình 3-3: Sơ đồ ERD Vật lý

---

## 🔧 TROUBLESHOOTING

### Lỗi: "Cannot render diagram"
**Nguyên nhân:** Syntax PlantUML sai
**Giải pháp:** 
- Kiểm tra mọi `entity` phải có `{}` đóng mở đúng
- Kiểm tra relationship syntax: `||--o{` phải đúng

### Lỗi: "Java not found"
**Nguyên nhân:** Chưa cài Java (cho VSCode)
**Giải pháp:** 
- Download Java từ https://www.java.com/
- Restart VSCode sau khi cài

### Sơ đồ quá rộng, không vừa màn hình
**Giải pháp:**
- Thêm vào đầu file: `scale 0.7` (giảm 30%)
- Hoặc export SVG và zoom trong trình xem ảnh

### Font chữ Tiếng Việt bị lỗi
**Giải pháp:**
- PlantUML hỗ trợ UTF-8, đảm bảo file `.puml` save dạng UTF-8
- Nếu vẫn lỗi, thay Tiếng Việt có dấu bằng không dấu

---

## 📞 HỖ TRỢ

Nếu gặp vấn đề:
1. Check documentation PlantUML: https://plantuml.com/
2. Tìm kiếm trên Stack Overflow: "PlantUML ERD"
3. Sử dụng PlantUML Online (cách đơn giản nhất)

---

**Chúc bạn tạo sơ đồ thành công! 🎉**
