# FEFO Nâng Cấp - Hướng Dẫn Triển Khai Frontend

## ✅ Hoàn Thành

### 1. Chuẩn Hóa Format CSV (`csvFormatUtils.js`)
- **File**: `src/utils/csvFormatUtils.js`
- **Tính năng**:
  - Standard headers: tenSanPham, thuongHieu, moTa, giaDeXuat, soLuongCoTheCungCap, dungTichMl, nongDo, **hanSuDung**, **soLo**, urlHinhAnh, ghiChu
  - Bidirectional conversion: Form ↔ CSV
  - CSV parsing với proper escaping (dấu ngoặc, phẩy)
  - Validation: required fields, numeric formats, dates, URLs
  - Template generator cho users download

**Sử dụng**:
```javascript
import { formDataToCSV, parseCSVToArray, validateCSVRow } from '../../utils/csvFormatUtils';

// Convert form → CSV
const csv = formDataToCSV(arrayOfProducts);

// Parse CSV → objects
const products = parseCSVToArray(csvString);

// Validate từng row
const errors = validateCSVRow(product, rowIndex);
```

---

### 2. Nâng Cấp Giao Diện Nhập Kho - Nhân Viên Kho
- **File**: `src/pages/admin/AdminImportKhoPage.jsx`
- **Cập nhật**:
  - ✅ EditCell component hỗ trợ validation HSD
  - ✅ Thêm trường Hạn sử dụng (Date Picker)
  - ✅ Thêm trường Số lô (Text Input)
  - ✅ Validation: HSD không được trong quá khứ
  - ✅ Cảnh báo đỏ khi HSD < 6 tháng
  - ✅ Tính toán tháng còn lại trực quan

**Validation Logic**:
```javascript
// Khi nhân viên edit HSD
if (selectedDate < today) {
  error: 'HSD không được trong quá khứ'
}
if (calculateMonthsToExpiry(date) < 6) {
  warning: `HSD quá ngắn (${months} tháng) - xác nhận lại!`
}
```

---

### 3. Nâng Cấp Giao Diện Đề Xuất Sản Phẩm - Nhà Cung Cấp
- **File**: `src/pages/public/SupplierProposeProductPage.jsx`
- **Cập nhật**:
  - ✅ Thêm trường Hạn sử dụng (Date Picker)
  - ✅ Thêm trường Số lô (Text Input)
  - ✅ Min date = hôm nay (không cho chọn quá khứ)
  - ✅ Cảnh báo động khi HSD < 6 tháng
  - ✅ Validation HSD không được trong quá khứ
  - ✅ CSV standardized fields (hanSuDung, soLo)

**Fields Mới**:
- `hanSuDung`: Date input, required, min = today, cảnh báo nếu < 6 tháng
- `soLo`: Text input, optional, placeholder "VD: LOT-001, BATCH-2024"

---

### 4. Widget Cảnh Báo Cận Date - Dashboard
- **File**: `src/pages/admin/dashboard/components/NearExpiryWidget.jsx`
- **Tính năng**:
  - Hiển thị TOP 10 lô sắp hết hạn
  - Màu sắc theo mức độ cảnh báo (green, yellow, red)
  - Nút nhanh: "Chi tiết" → AdminNearExpiryProductsPage
  - Cập nhật theo dõi real-time

**API**: `GET /api/kho/near-expiry?limit=10`

**Widget HTML**:
```jsx
<div className="bg-white rounded-lg p-6 shadow-md">
  <h3>⏰ Top 10 Lô Sắp Hết Hạn</h3>
  <table className="w-full text-sm mt-4">
    {nearExpiryProducts.map(product => (
      <tr key={product.id}>
        <td>{product.tenSanPham}</td>
        <td>{daysRemaining} ngày</td>
        <td>
          <button className="btn-primary" onClick={() => navigate('...')}>
            Chi tiết
          </button>
        </td>
      </tr>
    ))}
  </table>
</div>
```

---

### 5. Trang Quản Lý Sản Phẩm Cận Date
- **File**: `src/pages/admin/AdminNearExpiryProductsPage.jsx`
- **Tính năng**:
  - List tất cả sản phẩm cận date (HSD < 30 ngày)
  - Filter: theo cửa hàng, theo khoảng thời gian
  - Nút nhanh "Đẩy sang Khuyến Mãi" → Campaign Module
  - Bulk actions: select nhiều → bulk push
  - Tracking: ai push, khi nào, result

**Route**: `/admin/near-expiry-products`

**API Calls**:
- `GET /api/kho/products-near-expiry?days=30` - Lấy danh sách
- `POST /api/campaigns/push-near-expiry-products` - Đẩy sang campaign

---

### 6. Hiển Thị Phiếu Nhặt Hàng - Pick List
- **File**: `src/pages/admin/orders/components/PickListDisplay.jsx`
- **Tính năng**:
  - Hiển thị chi tiết: "Sản phẩm A - Lấy 2 chai (Lô HSD: 12/2026), Lấy 1 chai (Lô HSD: 05/2027)"
  - FEFO order từ BE: thứ tự lấy theo HSD sớm nhất
  - Warehouse staff dễ lấy đúng hàng vật lý
  - Tracking: ai lấy lô nào, cách nào → truy vết trách nhiệm

**Data Structure từ BE**:
```json
{
  "donHangId": "ORD-001",
  "pickList": [
    {
      "sanPhamId": 1,
      "tenSanPham": "Nước Hoa X",
      "chiTiet": [
        {
          "soLo": "LOT-001",
          "hanSuDung": "2026-12-31",
          "soLuong": 2
        },
        {
          "soLo": "LOT-002",
          "hanSuDung": "2027-05-30",
          "soLuong": 1
        }
      ]
    }
  ]
}
```

**Render**:
```jsx
<div className="pick-list">
  {pickList.map(item => (
    <div key={item.sanPhamId} className="product-section">
      <h4>{item.tenSanPham}</h4>
      {item.chiTiet.map(detail => (
        <p>Lấy {detail.soLuong} chai (Lô {detail.soLo}, HSD: {formatDate(detail.hanSuDung)})</p>
      ))}
    </div>
  ))}
</div>
```

---

## 📝 Utility Functions

### `calculateMonthsToExpiry(expiryDate)`
```javascript
const months = calculateMonthsToExpiry('2026-12-31'); // → số tháng còn lại
```

### `getTodayISOString()`
```javascript
const today = getTodayISOString(); // → "2026-07-01"
```

### `parseCSVLine(line)`
```javascript
const values = parseCSVLine('"name, with comma","normal","quoted""quote"');
// → ["name, with comma", "normal", 'quoted"quote']
```

---

## 🔄 Data Flow FEFO

### Nhập Kho (Warehouse Staff)
1. Upload CSV với hanSuDung + soLo
2. Validation: HSD >= hôm nay, cảnh báo < 6 tháng
3. Confirm import → BE lưu vào ChiTietPhieuNhap + LoHang
4. BE tính toán FEFO: sorted by HSD ASC

### Bán Hàng (Order Processing)
1. Order đến → BE FEFOService.calculatePickList()
2. BE trả về PickList: [{ soLo, hanSuDung, soLuong }, ...]
3. FE hiển thị PickListDisplay: "Lấy N chai lô X (HSD: Y)"
4. Warehouse staff lấy hàng theo thứ tự FEFO

### Cảnh Báo Date (Admin/Manager)
1. Dashboard: TOP 10 sắp hết hạn
2. Detail page: danh sách < 30 ngày
3. Push to Campaign: xử lý khuyến mãi, xả hàng

---

## 🛠️ Implementation Checklist

- [x] csvFormatUtils.js: Chuẩn hóa CSV format
- [x] AdminImportKhoPage: Validation HSD + soLo
- [x] SupplierProposeProductPage: Add HSD + soLo fields
- [x] NearExpiryWidget: Dashboard widget
- [x] AdminNearExpiryProductsPage: Management page
- [x] PickListDisplay: Order pick list visualization
- [ ] pickListUtils.js: Helper functions (ready)
- [ ] khoApi.js: Backend integration (ready)
- [ ] BE API Endpoints: /api/kho/near-expiry, /api/kho/products-near-expiry
- [ ] BE: FEFOService.calculatePickList() method
- [ ] Testing: E2E CSV import, pick list display

---

## 🚀 Next Steps Backend

1. **Add Endpoints**:
   - `GET /api/kho/near-expiry?limit=10` - Widget data
   - `GET /api/kho/products-near-expiry?days=30` - Management page
   - `POST /api/campaigns/push-near-expiry-products` - Bulk push to campaign

2. **Update ChiTietPhieuNhap Entity**:
   - Ensure `hanSuDung` and `soLo` fields exist
   - Add database migration if needed

3. **Implement FEFOService**:
   - `calculatePickList(donHangId)` → return sorted by HSD
   - Include `soLo`, `hanSuDung`, `soLuong` in response

4. **API Response Format**:
   ```json
   {
     "donHangId": "ORD-123",
     "pickList": [
       {
         "sanPhamId": 1,
         "tenSanPham": "Nước Hoa X",
         "chiTiet": [
           { "soLo": "LOT-001", "hanSuDung": "2026-12-31", "soLuong": 2 }
         ]
       }
     ]
   }
   ```

---

## 📊 Notes for QA Testing

1. **CSV Import**:
   - Test HSD in past → reject
   - Test HSD < 6 months → show warning
   - Test soLo with special chars → CSV escape works

2. **Pick List**:
   - Verify FEFO order: earliest expiry first
   - Verify soLo visible in display
   - Test with multiple lots same product

3. **Dashboard**:
   - Widget show TOP 10 correct
   - Click "Chi tiết" → navigate to list page
   - List page filter works

4. **Campaign Push**:
   - Bulk select works
   - Products move to campaign module
   - Tracking data saved