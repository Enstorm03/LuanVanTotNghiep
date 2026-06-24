# Sales Velocity Feature - Tính năng Biên độ Bán

## Tổng quan
Tính năng này tự động tính toán tốc độ tiêu thụ sản phẩm và gợi ý số lượng cần nhập kho dựa trên dữ liệu lịch sử bán hàng.

## Công thức tính toán

### 1. Ngày nhập gần nhất (D - Date)
```
D = Ngày nhập kho gần nhất của sản phẩm
```

### 2. Số ngày biên độ (Days)
```
Days = Số ngày từ lần nhập gần nhất đến nay
```

### 3. Tổng số lượng đã bán (S - Sales)
```
S = Tổng số lượng sản phẩm đã bán trong khoảng thời gian Days
    (chỉ tính đơn hàng đã hoàn thành)
```

### 4. Tốc độ tiêu thụ (V - Velocity)
```
V = S / Days (sản phẩm/ngày)
```

### 5. Số lượng gợi ý nhập (Q - Quantity)
```
Q = (V × T) + SS - I

Trong đó:
- T = 30 ngày (chu kỳ nhập hàng mặc định)
- SS = V × 5 (Safety Stock - tồn kho an toàn cho 5 ngày)
- I = Số lượng tồn kho hiện tại
```

## Thay đổi Backend

### File: `ProcurementService.java`

#### 1. Thêm Dependencies
```java
@Autowired private ChiTietDonHangRepository chiTietDonHangRepo;
```

#### 2. Cập nhật method `getDanhSachSapHetKho()`
Thêm tính toán biên độ bán cho mỗi sản phẩm:
```java
Map<String, Object> velocity = tinhBienDoBan(sp.getIdSanPham());
m.putAll(velocity);
```

#### 3. Thêm method mới `tinhBienDoBan()`
Method này tính toán và trả về:
- `ngayNhapGanNhat`: Ngày nhập kho gần nhất
- `soNgayBienDo`: Số ngày từ lần nhập đến nay
- `tongBanRa`: Tổng số lượng đã bán
- `tocDoBan`: Tốc độ tiêu thụ (sp/ngày)
- `soLuongGoiY`: Số lượng gợi ý nhập kho

## Thay đổi Frontend

### File: `AdminProcurementPage.jsx`

#### Hiển thị thông tin biên độ bán
Trong modal "Tạo đợt gọi thầu", mỗi sản phẩm hiện hiển thị:

1. **Thông tin cơ bản** (như cũ):
   - Tên sản phẩm
   - Số lượng tồn kho
   - Giá bán

2. **Thông tin biên độ bán** (mới):
   ```jsx
   📊 {tocDoBan} sp/ngày · 💡 Gợi ý: {soLuongGoiY} sp
   ```

3. **Nút "Dùng gợi ý"** (mới):
   - Tự động điền số lượng gợi ý vào ô input
   - Chỉ hiển thị khi có dữ liệu gợi ý

## Ví dụ sử dụng

### Trường hợp 1: Sản phẩm bán chạy
```
- Ngày nhập gần nhất: 01/06/2026
- Số ngày biên độ: 23 ngày
- Tổng đã bán: 115 sp
- Tốc độ bán: 5 sp/ngày
- Tồn kho hiện tại: 3 sp

Gợi ý nhập: (5 × 30) + (5 × 5) - 3 = 172 sp
```

### Trường hợp 2: Sản phẩm bán chậm
```
- Ngày nhập gần nhất: 15/05/2026
- Số ngày biên độ: 40 ngày
- Tổng đã bán: 20 sp
- Tốc độ bán: 0.5 sp/ngày
- Tồn kho hiện tại: 8 sp

Gợi ý nhập: (0.5 × 30) + (0.5 × 5) - 8 = 10 sp
```

### Trường hợp 3: Sản phẩm mới (chưa có lịch sử)
```
- Ngày nhập gần nhất: null
- Không có dữ liệu
- Gợi ý: null (không hiển thị)
```

## Lợi ích

1. **Tối ưu tồn kho**: Tránh nhập quá nhiều hoặc quá ít
2. **Tiết kiệm thời gian**: Admin không cần tự tính toán
3. **Dựa trên dữ liệu**: Quyết định dựa trên lịch sử bán hàng thực tế
4. **Linh hoạt**: Admin vẫn có thể điều chỉnh số lượng theo ý muốn

## Lưu ý kỹ thuật

- Chỉ tính đơn hàng có trạng thái "Hoàn thành"
- Số lượng gợi ý luôn >= 0
- Nếu không có lịch sử nhập kho, không hiển thị gợi ý
- Tốc độ bán được làm tròn đến 2 chữ số thập phân
- Chu kỳ nhập mặc định là 30 ngày, có thể điều chỉnh trong code

## Testing

Để test tính năng:
1. Đảm bảo có dữ liệu lịch sử nhập kho và đơn hàng
2. Mở modal "Tạo đợt gọi thầu" 
3. Kiểm tra hiển thị tốc độ bán và gợi ý
4. Click "Dùng gợi ý" để tự động điền số lượng
5. Xác nhận logic tính toán bằng cách so sánh với tính tay

## Cải tiến tương lai

- [ ] Cho phép admin tùy chỉnh chu kỳ nhập (T)
- [ ] Cho phép tùy chỉnh hệ số an toàn (safety stock days)
- [ ] Hiển thị biểu đồ xu hướng bán hàng
- [ ] Dự đoán mùa vụ/xu hướng tăng giảm
- [ ] Cảnh báo sản phẩm sắp hết hàng sớm hơn dựa trên velocity