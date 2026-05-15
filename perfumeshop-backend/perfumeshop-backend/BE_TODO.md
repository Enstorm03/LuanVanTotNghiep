# 🛑 Danh Sách Tính Năng FE TỰ LÀM — Cần BE Implement

## Tổng quan

Hiện tại FE đang tự implement **9 nhóm chức năng** lẽ ra BE phải xử lý. Điều này gây ra:
1. **Performance kém** — FE fetch toàn bộ dữ liệu rồi xử lý client-side
2. **Data không nhất quán** — Logic tính toán trùng lặp giữa FE và BE
3. **Không scale được** — Khi data lớn, browser sẽ crash vì phải xử lý hàng nghìn records
4. **Bảo mật kém** — Ví dụ: giá sản phẩm, trạng thái đơn hàng có thể bị client sửa

---

## 🔴 Nhóm 1: Product Filter + Sort + Search + Pagination

### File FE hiện tại:
- `src/hooks/useCategoryFilters.js`
- `src/hooks/useCategoryProducts.js`
- `src/utils/productSort.js`
- `src/utils/categoryHelpers.js`
- `src/pages/public/DanhMucSanPham.jsx` (pagination mock - fake)

### Cách FE đang làm (SAI):
```js
// useCategoryProducts.js — Lấy ALL products
fetchedProducts = await api.getAllProducts();  // N+1 ngầm

// useCategoryFilters.js + productSort.js — Filter + Sort CLIENT-SIDE
// Filter brand, concentration, price + sort giá cả — TẤT CẢ trên browser
const result = filterAndSortProducts(products, filters);
```

### BE cần implement:
| Endpoint | Method | Mô tả |
|----------|--------|-------|
| `/api/san-pham?page=1&size=20&sortBy=gia&sortDir=asc` | GET | Danh sách sản phẩm có phân trang |
| `/api/san-pham/search?kw=&danhMucId=&thuongHieuId=&nongDo=&minGia=&maxGia=&sortBy=&page=&size=` | GET | Search + filter + sort + paginate (ALL-IN-ONE) |
| `/api/san-pham/{id}/related` | GET | Sản phẩm liên quan (lấy từ server, không filter client-side) |

### Xóa sau khi BE implement:
- `src/utils/productSort.js` (toàn bộ file)
- `src/hooks/useCategoryFilters.js` (toàn bộ hook)
- `src/utils/categoryHelpers.js` (hàm `filterByConcentration`, `getConcentrationRanges`)
- Cập nhật `useCategoryProducts.js` → chỉ gọi 1 API duy nhất

---

## 🔴 Nhóm 2: Dashboard Statistics

### File FE hiện tại:
- `src/hooks/useDashboard.js`
- `src/layouts/AdminHeader.jsx` (pending orders count + low stock count)

### Cách FE đang làm (SAI):
```js
// useDashboard.js — Fetch 5 API khác nhau rồi reduce client-side
const [ordersData, productsData, customersData, employeesData, returnsData] = await Promise.all([
  api.getOrders(),        // Lấy ALL orders
  api.getAllProducts(),   // Lấy ALL products
  api.getCustomers(),     // Lấy ALL customers
  api.getEmployees(),     // Lấy ALL employees
  api.getAllReturns()     // Lấy ALL returns
]);

// Reduce client-side để tính toán
const totalRevenue = ordersData.filter(o => o.trangThaiVanHanh === 'Hoàn thành')
  .reduce((sum, order) => sum + (order.tongTien || 0), 0);

const pendingOrders = ordersData.filter(o => o.trangThaiVanHanh === 'Đang chờ').length;
// ... còn nhiều reduce khác

// AdminHeader.jsx — Gọi API riêng chỉ để đếm
const orders = await api.getOrders();           // Lấy ALL orders
const pendingCount = orders.filter(...).length;  // Đếm client-side
const products = await api.getAllProducts();     // Lấy ALL products
const lowStockCount = products.filter(...).length; // Đếm client-side
```

### BE cần implement:
| Endpoint | Method | Mô tả |
|----------|--------|-------|
| `/api/admin/dashboard/stats` | GET | **Trả về JSON**: `{ totalRevenue, totalOrders, totalProducts, totalCustomers, totalEmployees, pendingOrders, confirmedOrders, shippingOrders, completedOrders, pendingReturns, approvedReturns, totalReturns }` |
| `/api/admin/dashboard/recent-orders?limit=5` | GET | 5 đơn hàng gần nhất |
| `/api/admin/dashboard/alerts` | GET | **Trả về JSON**: `{ pendingOrders: number, lowStockItems: number }` |

### Xóa sau khi BE implement:
- `useDashboard.js` → chỉ gọi 1-2 API thay vì 5
- `AdminHeader.jsx` → gọi `/api/admin/dashboard/alerts` thay vì fetch all orders + products

---

## 🔴 Nhóm 3: Report & Analytics

### File FE hiện tại:
- `src/hooks/useReport.js`
- `src/utils/reportCalculator.js`
- `src/utils/dateRange.js`
- `src/utils/reportExport.js`

### Cách FE đang làm (SAI):
```js
// useReport.js — Lấy ALL orders, filter, rồi tính toán client-side
const [ordersData] = await Promise.all([api.getOrders()]); // ALL orders
const filteredOrders = filterOrdersByDateRange(ordersData, ...); // filter client-side
const revenueMetrics = calculateRevenueMetrics(filteredOrders); // reduce client-side
const topProducts = calculateTopProducts(filteredOrders);        // reduce client-side
```

### BE cần implement:
| Endpoint | Method | Mô tả |
|----------|--------|-------|
| `/api/admin/reports/summary?startDate=&endDate=` | GET | **Trả về**: doanh thu, số đơn, trung bình đơn, khách hàng mới, khách hàng quay lại |
| `/api/admin/reports/top-products?startDate=&endDate=&limit=10` | GET | Top sản phẩm bán chạy |
| `/api/admin/reports/revenue-by-status?startDate=&endDate=` | GET | Doanh thu theo trạng thái đơn hàng |
| `/api/admin/reports/export?startDate=&endDate=&format=csv` | GET | Export CSV trực tiếp từ server |

### Xóa sau khi BE implement:
- `reportCalculator.js` (toàn bộ file)
- `useReport.js` → chỉ gọi API thay vì tính
- `reportExport.js` → có thể giữ nếu cần FE export, hoặc xóa nếu BE export

---

## 🔴 Nhóm 4: Cart Enrichment (N+1 Query)

### File FE hiện tại:
- `src/services/api/cartApi.js` — `_enrichCartItemsWithProductDetails()`

### Cách FE đang làm (SAI):
```js
// Lấy brands: 1 request
const brands = await productApi.getBrands();

// Lấy từng product: N requests (N = số items trong cart)
const enrichedItems = await Promise.all(
  cartItems.map(async (item) => {
    const product = await productApi.getProductById(item.sanPhamId); // N request!
    // merge thủ công
  })
);
```
**Tổng request**: 1 (brands) + N (products) + 1 (cart) = **N+2 requests** cho 1 lần xem giỏ hàng.

### BE cần implement:
| Endpoint | Method | Mô tả |
|----------|--------|-------|
| `/api/cart/dto?userId=` | GET | (ĐÃ CÓ) Nhưng cần đảm bảo trả về **đầy đủ thông tin sản phẩm** (tên, ảnh, thương hiệu, dung tích, nồng độ), không cần FE enrich |

### Xóa sau khi BE implement:
- `_enrichCartItemsWithProductDetails()` trong `cartApi.js`
- Dòng kiểm tra `hasProductInfo` → bỏ luôn, vì BE đã trả đủ

---

## 🔴 Nhóm 5: Check Stock (Checkout)

### File FE hiện tại:
- `src/pages/public/checkout/ThanhToanPage.jsx` (dòng 34-74)

### Cách FE đang làm (SAI):
```js
// Gọi getProductById cho TỪNG item trong cart
for (const item of cartItems) {
  const product = await api.getProductById(item.sanPhamId);
  if (product.so_luong_ton_kho < item.soLuong) {
    // báo hết hàng
  }
}
```
**Vấn đề**: N+1 query, logic kiểm tra tồn kho có thể outdated ngay sau khi check.

### BE cần implement:
| Endpoint | Method | Mô tả |
|----------|--------|-------|
| `/api/cart/check-stock` | POST | (ĐÃ CÓ) Nhưng FE cần **bắt buộc dùng endpoint này** thay vì tự check |

### Xóa sau khi BE implement:
- Check stock loop trong `ThanhToanPage.jsx` → thay bằng gọi `api.checkStockBeforeCheckout()`

---

## 🔴 Nhóm 6: Order Search + Filter + Paginate

### File FE hiện tại:
- `src/hooks/useOrders.js` (dòng 57-72)

### Cách FE đang làm (SAI):
```js
// Search CLIENT-SIDE
const filteredOrders = orders.filter(order => {
  const term = searchTerm.toLowerCase();
  return order.idDonHang?.toString().includes(term) || ...;
});

// Paginate CLIENT-SIDE
const currentOrders = filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
```

### BE cần implement:
| Endpoint | Method | Mô tả |
|----------|--------|-------|
| `/api/don-hang?trangThai=&search=&page=1&size=10` | GET | (CẦN MỞ RỘNG) Thêm params: `search` (tìm theo mã đơn/tên/SĐT), `page`, `size` |

### Xóa sau khi BE implement:
- `filteredOrders` + `currentOrders` + `paginate` trong `useOrders.js`
- Thay bằng gọi API với params

---

## 🟡 Nhóm 7: Check Order Return Status

### File FE hiện tại:
- `src/services/api/orderApi.js` (dòng 162-171)

### Cách FE đang làm (SAI):
```js
// Fetch ALL pending returns rồi find client-side
const returns = await this._fetch(`${API_BASE_URL}/doi-tra/cho-duyet`);
return returns.find(r => r.idDonHang === orderId && r.idNguoiDung === userId) || null;
```

### BE cần implement:
| Endpoint | Method | Mô tả |
|----------|--------|-------|
| `/api/doi-tra/kiem-tra?orderId=&userId=` | GET | **Trả về**: `{ hasReturnRequest: boolean, returnStatus: string \| null }` |

### Xóa sau khi BE implement:
- `checkOrderReturnStatus()` trong `orderApi.js` → thay bằng API chuyên dụng

---

## 🟡 Nhóm 8: Admin Dashboard Count (AdminHeader)

### File FE hiện tại:
- `src/layouts/AdminHeader.jsx` (dòng 10-45)

### Cách FE đang làm (SAI):
```js
// Gọi 2 API lớn chỉ để đếm
const orders = await api.getOrders();         // Lấy ALL orders
const pendingCount = orders.filter(...).length; // Đếm client-side
const products = await api.getAllProducts();   // Lấy ALL products
const lowStockCount = products.filter(...).length; // Đếm client-side
```

### BE cần implement:
| Endpoint | Method | Mô tả |
|----------|--------|-------|
| `/api/admin/dashboard/alerts` | GET | (đã liệt kê ở nhóm 2) Trả về `{ pendingOrders: 5, lowStockItems: 3 }` |

### Xóa sau khi BE implement:
- `AdminHeader.jsx` → gọi `/api/admin/dashboard/alerts` 1 request duy nhất

---

## 🟡 Nhóm 9: Product Detail — Related Products

### File FE hiện tại:
- `src/hooks/useChiTietSanPham.js` (bên trong gọi `api.getAllProducts()` + filter)

### Cách FE đang làm (SAI):
```js
// Bên trong useChiTietSanPham.js
const allProducts = await api.getAllProducts(); // Lấy ALL products
// Filter client-side
const related = allProducts.filter(p => p.id_thuong_hieu === brandId && p.id_san_pham !== currentId).slice(0, 4);
```

### BE cần implement:
| Endpoint | Method | Mô tả |
|----------|--------|-------|
| `/api/san-pham/{id}/related?limit=4` | GET | Trả về sản phẩm liên quan (cùng thương hiệu, loại trừ sản phẩm hiện tại) |

### Xóa sau khi BE implement:
- `getRelatedProducts()` trong `productUtils.js`
- Cập nhật `useChiTietSanPham.js` → gọi API này

---

## Tổng Kết

### Các file có thể XÓA HOÀN TOÀN sau khi BE implement:

| File | Lý do |
|------|-------|
| `src/utils/productSort.js` | Sort + filter chuyển hết về BE |
| `src/utils/reportCalculator.js` | Tính toán chuyển hết về BE |
| `src/utils/categoryHelpers.js` (1 phần) | `filterByConcentration`, `getConcentrationRanges` |
| `src/utils/checkoutCalculations.js` (1 phần) | Các hàm duplicate đã liệt kê |

### Các hook cần REWRITE:

| Hook | Hiện tại | Sau khi BE xong |
|------|----------|-----------------|
| `useDashboard.js` | 5 API calls + reduce | 1-2 API calls |
| `useReport.js` | 1 API call + tính client-side | 1-4 API calls (nhưng không tính) |
| `useCategoryProducts.js` | Lấy all + client-side filter | 1 API param filter |
| `useOrders.js` | Filter + paginate client-side | BE paginate |
| `useChiTietSanPham.js` | Lấy all products cho related | 1 API riêng |

### Các API mới BE cần thêm (tổng hợp):

| # | Endpoint | Mục đích |
|---|----------|----------|
| 1 | `GET /api/san-pham?page=&size=&sortBy=&sortDir=` | Product list có phân trang |
| 2 | `GET /api/san-pham/search?kw=&danhMucId=&thuongHieuId=&nongDo=&minGia=&maxGia=&sortBy=&page=&size=` | Search + filter + sort + paginate (ALL-IN-ONE) |
| 3 | `GET /api/san-pham/{id}/related?limit=` | Sản phẩm liên quan |
| 4 | `GET /api/admin/dashboard/stats` | Dashboard stats tổng hợp |
| 5 | `GET /api/admin/dashboard/recent-orders?limit=` | Recent orders |
| 6 | `GET /api/admin/dashboard/alerts` | Alert counts (pending orders, low stock) |
| 7 | `GET /api/admin/reports/summary?startDate=&endDate=` | Report summary |
| 8 | `GET /api/admin/reports/top-products?startDate=&endDate=&limit=` | Top products |
| 9 | `GET /api/admin/reports/revenue-by-status?startDate=&endDate=` | Revenue by status |
| 10 | `GET /api/admin/reports/export?startDate=&endDate=&format=` | Export CSV/JSON |
| 11 | `GET /api/don-hang?trangThai=&search=&page=&size=` | Order list có search + paginate |
| 12 | `GET /api/doi-tra/kiem-tra?orderId=&userId=` | Check return status |
| 13 | `POST /api/cart/dto?userId=` (SỬA) | Cart trả đủ product info |