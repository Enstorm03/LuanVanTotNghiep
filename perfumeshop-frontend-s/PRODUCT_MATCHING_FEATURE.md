# Tính năng: Phát hiện sản phẩm đã tồn tại khi duyệt đề xuất NCC

## Tổng quan

Khi Admin duyệt đề xuất sản phẩm từ NCC, hệ thống sẽ **tự động kiểm tra** xem sản phẩm đã tồn tại trong hệ thống chưa (dựa vào tên sản phẩm). Nếu đã có rồi, hệ thống sẽ:

- ✅ **KHÔNG tạo sản phẩm mới** (tránh trùng lặp)
- ✅ **Dùng sản phẩm đã có** và chỉ tạo PO nhập kho cho sản phẩm đó
- ✅ **Hiển thị badge** để Admin biết đây là sản phẩm đã tồn tại

## Cách hoạt động

### Backend Logic

1. **Khi NCC gửi đề xuất:**
   - Đề xuất được lưu vào bảng `san_pham_de_xuat` với trạng thái `PENDING`
   - Field `idSanPhamKhop` = `null` (chưa kiểm tra)

2. **Khi Admin duyệt đề xuất** (`duyetSanPhamDeXuat`):
   ```java
   // Bước 1: Kiểm tra sản phẩm đã tồn tại chưa
   SanPham sanPhamKhop = sanPhamRepository.findAll().stream()
       .filter(sp -> sp.getTenSanPham().trim().equalsIgnoreCase(dx.getTenSanPham().trim()))
       .findFirst()
       .orElse(null);

   if (sanPhamKhop != null) {
       // Sản phẩm đã có → Dùng SP có sẵn
       spMoi = sanPhamKhop;
       dx.setIdSanPhamKhop(sanPhamKhop.getIdSanPham());
   } else {
       // Sản phẩm mới → Tạo SP mới
       spMoi = sanPhamRepository.save(sp);
   }

   // Bước 2: Tạo PO nhập kho cho sản phẩm (mới hoặc đã có)
   PhieuNhapKho po = new PhieuNhapKho();
   po.setGhiChu(daTonTai ? "PO nhập thêm SP đã có" : "PO từ đề xuất NCC");
   // ... tạo PO với trạng thái CHO_KHO_KIEM_TRA
   ```

### Frontend UI

**Modal xem đề xuất theo NCC:**

- Sản phẩm **đã tồn tại**: Badge xanh dương "Đã có #{idSanPham}"
- Sản phẩm **mới**: Badge vàng "Sản phẩm mới"

```jsx
{p.idSanPhamKhop && (
  <span className="badge-blue">Đã có #{p.idSanPhamKhop}</span>
)}
{!p.idSanPhamKhop && p.trangThai === 'PENDING' && (
  <span className="badge-amber">Sản phẩm mới</span>
)}
```

## Database Schema

### Bảng `san_pham_de_xuat`

```sql
ALTER TABLE san_pham_de_xuat 
ADD COLUMN id_san_pham_khop INT NULL 
COMMENT 'ID sản phẩm khớp trong hệ thống (nếu đã tồn tại)';

CREATE INDEX idx_san_pham_khop ON san_pham_de_xuat(id_san_pham_khop);
```

**Các trường:**
- `id_san_pham_tao_ra`: ID sản phẩm mới được tạo (nếu tạo mới)
- `id_san_pham_khop`: ID sản phẩm đã có trong hệ thống (nếu match)

## Ví dụ thực tế

### Case 1: Sản phẩm đã tồn tại

1. NCC đề xuất "Bleu de Chanel 100ml"
2. Hệ thống đã có SP #45 tên "Bleu de Chanel 100ml"
3. Admin duyệt → Không tạo SP mới
4. Tạo PO nhập kho cho SP #45
5. Response:
   ```json
   {
     "idSanPhamDeXuat": 123,
     "idSanPhamKhop": 45,
     "idSanPhamTaoRa": 45,
     "trangThai": "APPROVED"
   }
   ```

### Case 2: Sản phẩm mới

1. NCC đề xuất "Dior Sauvage EDT 200ml"
2. Hệ thống chưa có SP này
3. Admin duyệt → Tạo SP mới #78
4. Tạo PO nhập kho cho SP #78
5. Response:
   ```json
   {
     "idSanPhamDeXuat": 124,
     "idSanPhamKhop": null,
     "idSanPhamTaoRa": 78,
     "trangThai": "APPROVED"
   }
   ```

## Lợi ích

1. **Tránh trùng lặp sản phẩm** - Không tạo nhiều bản ghi cho cùng 1 sản phẩm
2. **Nhất quán dữ liệu** - Tất cả PO nhập kho đều liên kết đúng SP
3. **Dễ quản lý kho** - Tồn kho tập trung cho 1 SP thay vì phân tán
4. **Trải nghiệm tốt** - Admin biết rõ SP nào mới, SP nào đã có

## Migration SQL

**Chạy script sau để thêm column mới:**

```bash
# Kết nối MySQL
mysql -u root -p perfumeshop

# Chạy migration
source perfumeshop-backend/perfumeshop-backend/src/main/resources/db/migration/add_id_san_pham_khop.sql
```

Hoặc copy nội dung file và chạy trực tiếp trong MySQL Workbench.

## Testing

1. **Test sản phẩm đã tồn tại:**
   - Tạo SP "Test Product A" trong hệ thống
   - NCC đề xuất "Test Product A"
   - Duyệt đề xuất → Kiểm tra không tạo SP mới, chỉ tạo PO

2. **Test sản phẩm mới:**
   - NCC đề xuất "New Unique Product XYZ"
   - Duyệt đề xuất → Kiểm tra tạo SP mới + PO

3. **Test UI:**
   - Kiểm tra badge hiển thị đúng cho SP đã có vs SP mới
   - Kiểm tra bulk approve vẫn hoạt động bình thường

## Notes

- Matching logic: So sánh **không phân biệt hoa/thường**, bỏ qua khoảng trắng đầu cuối
- Performance: Với DB lớn (>10k SP), nên thêm Full-Text Index cho `ten_san_pham`
- Future enhancement: Có thể dùng fuzzy matching (Levenshtein distance) để phát hiện SP tương tự