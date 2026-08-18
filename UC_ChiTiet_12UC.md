# USE CASE CHI TIẾT - 12 USE CASES ĐẦY ĐỦ

---

## **✅ ĐÁNH GIÁ 9 UC HIỆN TẠI**

### **UC-01: Đặt hàng** ✅ **ĐẦY ĐỦ**
- Có đầy đủ workflow COD và PayOS
- Có luồng thay thế hợp lý
- **Gợi ý nhỏ**: Bổ sung bước "Allocate FEFO batch" vào luồng chính bước 6-7

### **UC-02: Xác nhận đơn hàng** ✅ **ĐẦY ĐỦ**
- Có FEFO multi-batch deduction
- Có ghi log biến động kho
- **Hoàn hảo**, không cần sửa

### **UC-03: Chốt thầu NCC** ⚠️ **CẦN BỔ SUNG**
- **Thiếu bước 6.1**: UPDATE `san_pham.gia_ban = gia_ban_chot`
- **Thiếu bước 6.2**: Tính DSV (Q = V×T + V×5 - I)

### **UC-04: Đổi trả hàng** ⚠️ **CẦN LÀM RÕ**
- **Cần rõ hơn**: Bước 5 → 6 → 7 → 8 là 3 workflow riêng biệt
- **Bổ sung**: Hàng về `so_luong_hang_loi`, KHÔNG hoàn `so_luong_ton_kho`

### **UC-05: Đăng ký và xác thực email** ✅ **ĐẦY ĐỦ**
- Workflow rất chi tiết
- Có xử lý token hết hạn
- **Hoàn hảo**

### **UC-06: Duyệt phiếu nhập kho** ⚠️ **CẦN BỔ SUNG**
- **Thiếu**: PO Workflow có 3 giai đoạn (Kho kiểm tra → Admin duyệt → Cộng kho)
- **Hiện tại chỉ có giai đoạn 2** (Admin duyệt)

### **UC-07: NCC đề xuất SP mới** ⚠️ **CẦN BỔ SUNG**
- **Thiếu**: Luồng upload CSV (parse → preview với sessionId → confirm)
- **Hiện tại chỉ có luồng form đơn lẻ**

### **UC-08: QR code** ⚠️ **CẦN LÀM RÕ**
- **Cần rõ hơn**: QR không phải để "xác nhận nhận hàng" mà để "tra cứu thông tin đơn"
- **Sửa mô tả**: Shipper scan QR → Hiển thị thông tin → (Tùy chọn) Xác nhận giao

### **UC-09: Quản lý khuyến mãi** ⚠️ **CẦN BỔ SUNG**
- **Thiếu**: Cơ chế auto-display theo thời gian (query WHERE NOW() BETWEEN start AND end)
- **Thiếu**: Gán sản phẩm qua modal (bước 4-7 trong UC)

---

## **🆕 3 USE CASE MỚI**

---

### **UC-10: Tìm kiếm và duyệt sản phẩm**

**Tên Use case**: Tìm kiếm và duyệt sản phẩm

**Actor**: Khách hàng (chưa cần đăng nhập)

**Mô tả**: Khách hàng tìm kiếm, lọc, xem danh sách và chi tiết sản phẩm

**Điều kiện tiên quyết**: Không (public access)

**Luồng chính**:
1. Khách truy cập trang chủ hoặc trang danh mục
2. Hệ thống hiển thị danh sách sản phẩm (phân trang, mặc định 20 SP/trang)
3. Khách nhập từ khóa tìm kiếm (tên sản phẩm)
4. Hệ thống query: `GET /api/catalog/san-pham/search?kw={keyword}`
5. Hiển thị kết quả tìm kiếm
6. Khách chọn bộ lọc:
   - Danh mục: `?danhMucId={id}`
   - Thương hiệu: `?thuongHieuId={id}`
   - Nồng độ: `?nongDoMin={min}&nongDoMax={max}`
   - Dung tích: `?dungTich={ml}`
   - Giá: `?minGia={min}&maxGia={max}`
7. Hệ thống áp dụng bộ lọc và re-render danh sách
8. Khách chọn sắp xếp (giá tăng/giảm, mới nhất)
9. Hệ thống sắp xếp: `?sortBy={field}&sortDir={asc|desc}`
10. Khách click vào một sản phẩm
11. Hệ thống query: `GET /api/san-pham/{id}`
12. Hiển thị chi tiết sản phẩm: Tên, giá, mô tả, hình ảnh, nồng độ, dung tích, tồn kho
13. Load đánh giá: `GET /api/reviews/product/{productId}`
14. Load sản phẩm liên quan: `GET /api/san-pham/{id}/related?limit=4`
15. Hiển thị đầy đủ thông tin chi tiết

**Luồng thay thế**:
- 4a. Không có từ khóa → Hiển thị tất cả sản phẩm
- 5a. Không có kết quả → Hiển thị "Không tìm thấy sản phẩm"
- 6a. Nhiều bộ lọc → Kết hợp tất cả bằng AND logic
- 12a. Sản phẩm không tồn tại → Hiển thị 404
- 13a. Chưa có đánh giá → Hiển thị "Chưa có đánh giá"

**Điều kiện hậu**: Khách xem được thông tin sản phẩm, có thể thêm vào giỏ hàng (nếu đã đăng nhập)

---

### **UC-11: Quản lý giỏ hàng**

**Tên Use case**: Quản lý giỏ hàng

**Actor**: Khách hàng (đã đăng nhập)

**Mô tả**: Khách hàng thêm, xóa, cập nhật số lượng sản phẩm trong giỏ hàng

**Điều kiện tiên quyết**: Đã đăng nhập

**Luồng chính**:
1. Khách xem chi tiết sản phẩm (từ UC-10)
2. Nhấn "Thêm vào giỏ hàng"
3. Chọn số lượng
4. Hệ thống kiểm tra đăng nhập
5. Gửi request: `POST /api/cart/items` với body: `{userId, sanPhamId, soLuong}`
6. Hệ thống kiểm tra tồn kho
7. Thêm vào giỏ hàng (hoặc cập nhật số lượng nếu SP đã có)
8. Hiển thị thông báo "Đã thêm vào giỏ"
9. Khách vào trang giỏ hàng
10. Hệ thống query: `GET /api/cart/dto?userId={userId}`
11. Hiển thị danh sách SP trong giỏ:
    - Tên, hình ảnh, giá, số lượng
    - Tạm tính từng SP (giá × số lượng)
12. Hệ thống kiểm tra chiến dịch khuyến mãi active: `GET /api/public/campaigns/active`
13. Nếu có chiến dịch và SP trong giỏ thuộc chiến dịch:
    - Hiển thị % giảm giá
    - Tính tổng tiền sau giảm
14. Hiển thị tổng tiền giỏ hàng
15. Khách có thể:
    - Cập nhật số lượng: `PUT /api/cart/items`
    - Xóa SP: `DELETE /api/cart/items?userId={userId}&sanPhamId={id}`
    - Xóa toàn bộ: `DELETE /api/cart?userId={userId}`
    - Thanh toán: Chuyển sang UC-01

**Luồng thay thế**:
- 4a. Chưa đăng nhập → Redirect sang trang đăng nhập
- 6a. Không đủ tồn kho → Hiển thị "Sản phẩm không đủ số lượng"
- 10a. Giỏ hàng trống → Hiển thị "Giỏ hàng trống, quay lại mua sắm"
- 15a. Cập nhật số lượng > tồn kho → Hiển thị lỗi, giữ số lượng cũ

**Điều kiện hậu**: Giỏ hàng được cập nhật, khách có thể tiếp tục mua sắm hoặc thanh toán

---

### **UC-12: Báo cáo và thống kê**

**Tên Use case**: Xem báo cáo và thống kê hệ thống

**Actor**: Giám đốc (DIRECTOR), Admin (xem một phần)

**Mô tả**: Giám đốc xem dashboard, báo cáo doanh thu, biến động kho, log đăng nhập

**Điều kiện tiên quyết**: Đã đăng nhập với vai trò DIRECTOR hoặc ADMIN

**Luồng chính**:
1. Giám đốc đăng nhập và truy cập Dashboard
2. Hệ thống query: `GET /api/admin/dashboard/stats`
3. Hiển thị thống kê tổng quan:
   - Tổng doanh thu (theo khoảng thời gian)
   - Tổng số đơn hàng (Đang chờ, Đã xác nhận, Đã giao, Đã hủy)
   - Tổng số khách hàng
   - Tổng tồn kho (giá trị)
   - Số đơn chờ xử lý
4. Query: `GET /api/admin/dashboard/recent-orders?limit=5`
5. Hiển thị 5 đơn hàng gần nhất
6. Query: `GET /api/admin/dashboard/alerts`
7. Hiển thị cảnh báo:
   - Sản phẩm sắp hết hạn (< 30 ngày)
   - Sản phẩm bán chậm (không bán trong 30 ngày)
   - Đơn hàng chờ xử lý lâu (> 3 ngày)
8. Giám đốc chọn loại báo cáo:
   - **Báo cáo tổng hợp**: `GET /api/admin/reports/summary?startDate={start}&endDate={end}`
   - **Sản phẩm bán chạy**: `GET /api/admin/reports/top-products?limit=10`
   - **Doanh thu theo trạng thái**: `GET /api/admin/reports/revenue-by-status`
   - **Biến động kho**: `GET /api/kho/bien-dong?idSanPham={id}` (tùy chọn filter SP)
   - **Log đăng nhập**: `GET /api/admin/login-logs` (chỉ DIRECTOR)
9. Hệ thống hiển thị báo cáo tương ứng
10. Giám đốc có thể lọc theo:
    - Khoảng thời gian (startDate - endDate)
    - Trạng thái đơn hàng
    - Vai trò nhân viên (chỉ log đăng nhập)
11. Giám đốc nhấn "Xuất CSV"
12. Hệ thống query: `GET /api/admin/reports/export?format=csv&startDate={start}&endDate={end}`
13. Download file CSV về máy
14. Giám đốc mở file bằng Excel để phân tích

**Luồng thay thế**:
- 1a. Admin (không phải Director) → Chỉ xem được một phần báo cáo (không có log đăng nhập)
- 8a. Không chọn khoảng thời gian → Mặc định 30 ngày gần nhất
- 9a. Không có dữ liệu → Hiển thị "Chưa có dữ liệu trong khoảng thời gian này"
- 12a. Lỗi export → Hiển thị "Không thể xuất báo cáo, vui lòng thử lại"

**Điều kiện hậu**: Giám đốc có được báo cáo chi tiết, có thể xuất CSV để phân tích sâu hơn

---

## **📊 BẢNG TỔNG HỢP 12 USE CASES**

| ID | Tên Use Case | Actor | Nhóm | Trạng thái |
|----|--------------|-------|------|------------|
| UC-01 | Đặt hàng | Khách hàng | Mua hàng | ✅ Đầy đủ |
| UC-02 | Xác nhận đơn hàng | Cửa hàng trưởng | Quản lý đơn | ✅ Đầy đủ |
| UC-03 | Chốt thầu NCC | Cửa hàng trưởng | Mua hàng NCC | ⚠️ Cần bổ sung |
| UC-04 | Đổi trả hàng | Khách hàng, CHT | Dịch vụ KH | ⚠️ Cần làm rõ |
| UC-05 | Đăng ký xác thực email | Khách hàng mới | Xác thực | ✅ Đầy đủ |
| UC-06 | Duyệt phiếu nhập kho | Cửa hàng trưởng | Quản lý kho | ⚠️ Cần bổ sung |
| UC-07 | NCC đề xuất SP mới | Nhà cung cấp | Mua hàng NCC | ⚠️ Cần bổ sung |
| UC-08 | QR code đơn hàng | Khách hàng | Giao hàng | ⚠️ Cần làm rõ |
| UC-09 | Quản lý khuyến mãi | Cửa hàng trưởng | Marketing | ⚠️ Cần bổ sung |
| **UC-10** | **Tìm kiếm duyệt SP** | **Khách hàng** | **Mua hàng** | **🆕 Mới** |
| **UC-11** | **Quản lý giỏ hàng** | **Khách hàng** | **Mua hàng** | **🆕 Mới** |
| **UC-12** | **Báo cáo thống kê** | **Giám đốc** | **Quản lý** | **🆕 Mới** |

---

## **📐 SƠ ĐỒ QUAN HỆ GIỮA 12 UC**

```
KHÁCH HÀNG (Customer)
├─ UC-10: Tìm kiếm và duyệt sản phẩm
│   └─ include → UC-11: Quản lý giỏ hàng
│       └─ include → UC-01: Đặt hàng
│           └─ extend → UC-04: Đổi trả hàng
└─ UC-05: Đăng ký và xác thực email
    └─ (tiên quyết cho tất cả UC khác)

CỬA HÀNG TRƯỞNG (Store Manager)
├─ UC-02: Xác nhận đơn hàng
│   └─ (liên quan) → UC-08: QR code
├─ UC-06: Duyệt phiếu nhập kho
│   └─ (liên quan) → UC-03: Chốt thầu NCC
├─ UC-09: Quản lý chiến dịch khuyến mãi
│   └─ affect → UC-11: Giỏ hàng (giảm giá)
└─ UC-04: Đổi trả hàng (duyệt)

NHÀ CUNG CẤP (Supplier)
├─ UC-07: Đề xuất sản phẩm mới
└─ UC-03: Chốt thầu NCC (gửi báo giá)

GIÁM ĐỐC (Director)
└─ UC-12: Báo cáo và thống kê
```

---

## **✅ CHECKLIST HOÀN THIỆN LVTN**

### **Đã có đầy đủ (3/12):**
- ✅ UC-01: Đặt hàng
- ✅ UC-02: Xác nhận đơn hàng
- ✅ UC-05: Đăng ký xác thực email

### **Cần bổ sung chi tiết (6/12):**
- ⚠️ UC-03: Thêm UPDATE gia_ban + tính DSV
- ⚠️ UC-04: Làm rõ 3 workflow (CHO_DUYET → CHO_HOAN_TIEN → HOAN_TIEN_TC)
- ⚠️ UC-06: Thêm PO workflow 3 giai đoạn
- ⚠️ UC-07: Thêm luồng CSV (parse → preview → confirm)
- ⚠️ UC-08: Làm rõ QR để tra cứu, không phải xác nhận
- ⚠️ UC-09: Thêm auto-display + gán SP qua modal

### **Cần viết mới (3/12):**
- 🆕 UC-10: Tìm kiếm và duyệt sản phẩm
- 🆕 UC-11: Quản lý giỏ hàng
- 🆕 UC-12: Báo cáo và thống kê

---

**File tiếp theo**: Tôi sẽ tạo file Draw.io XML với UML Use Case Diagram đầy đủ 12 UC.

