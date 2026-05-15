# 📚 Tài Liệu Project PerfumeShop Frontend

## Tổng Quan Kiến Trúc

```
src/
├── App.js                          # Entry point routing
├── index.js                        # ReactDOM render
├── contexts/
│   └── AuthContext.jsx             # Quản lý auth state (user/staff)
├── services/
│   ├── api.js                     # Re-export (có thể xóa)
│   └── api/
│       ├── index.js               # Combine tất cả API modules
│       ├── baseApi.js             # Base class - fetch helper + product mapping
│       ├── authApi.js             # Login/Register API
│       ├── productApi.js          # CRUD sản phẩm + category + brand
│       ├── cartApi.js             # Giỏ hàng API
│       ├── orderApi.js            # Đơn hàng API
│       ├── customerApi.js         # Quản lý khách hàng (admin)
│       ├── employeeApi.js         # Quản lý nhân viên (admin)
│       ├── reviewApi.js           # Đánh giá API
│       ├── returnApi.js           # Đổi trả API
│       └── posApi.js              # POS bán hàng API
├── hooks/
│   ├── useCart.js                 # Cart state (public)
│   ├── useOrders.js               # Order list state + filter
│   ├── useCancelOrder.js          # Hủy đơn hàng
│   ├── useReviewOrder.js          # Đánh giá đơn hàng
│   ├── useReturnOrder.js          # Yêu cầu đổi trả
│   ├── useCheckout.js             # POS checkout logic
│   ├── useCheckoutData.js         # Checkout data (public)
│   ├── useSubmitOrder.js          # Submit đơn hàng (public)
│   ├── useShippingForm.js         # Form thông tin giao hàng
│   ├── usePaymentMethod.js        # Phương thức thanh toán
│   ├── useChiTietSanPham.js       # Product detail logic
│   ├── useCategoryMetadata.js     # Category + brand metadata
│   ├── useCategoryProducts.js     # Product listing
│   ├── useCategoryFilters.js      # Filter + sort
│   ├── useProducts.js             # Admin product management
│   ├── useDashboard.js            # Dashboard data
│   ├── useCustomers.js            # Customer management
│   ├── useEmployees.js            # Employee management
│   ├── useOrderDetail.js          # Order detail (admin)
│   ├── useReport.js               # Report data
│   ├── useReturns.js              # Returns management
│   ├── useReceipt.js              # POS receipt
│   └── usePosCart.js              # POS cart state
├── layouts/
│   ├── PublicLayout.jsx           # Layout public (Header + Outlet + Footer)
│   ├── AdminLayout.jsx            # Layout admin (Sidebar + Header + Outlet)
│   ├── AdminSidebar.jsx           # Sidebar admin
│   └── AdminHeader.jsx            # Header admin (alerts + POS button)
├── components/
│   ├── common/
│   │   ├── Header.jsx             # Header public (search, cart, user menu)
│   │   └── Footer.jsx             # Footer public
│   └── product/
│       └── ProductCard.jsx         # Product card
├── pages/
│   ├── public/
│   │   ├── TrangChu.jsx           # Home page
│   │   ├── DanhMucSanPham.jsx     # Category page
│   │   ├── ChiTietSanPham.jsx     # Product detail
│   │   ├── GioHang.jsx            # Cart page
│   │   ├── LichSuDonHangPage.jsx  # Order history
│   │   ├── ThuongHieuPage.jsx     # Brands page
│   │   └── checkout/
│   │       └── ThanhToanPage.jsx  # Checkout page
│   ├── admin/
│   │   ├── DashboardPage.jsx      # Admin dashboard
│   │   ├── AdminProductsPage.jsx  # Product management
│   │   ├── AdminOrdersPage.jsx    # Order management
│   │   ├── AdminOrderDetailPage.jsx # Order detail
│   │   ├── AdminCustomersPage.jsx # Customer management
│   │   ├── AdminEmployeesPage.jsx # Employee management
│   │   ├── AdminReportPage.jsx    # Reports
│   │   ├── AdminReturnsPage.jsx   # Returns management
│   │   └── POSPage.jsx            # POS bán hàng
│   └── auth/
│       ├── DangNhapPage.jsx       # Login page
│       └── DangKyPage.jsx         # Register page
└── utils/
    ├── productUtils.js            # Product helpers
    ├── productMapper.js           # Product data mapping
    ├── productSort.js             # Product sorting
    ├── categoryHelpers.js         # Category helpers
    ├── cartUtils.js               # Cart helpers
    ├── checkoutCalculations.js    # Checkout calculations
    ├── checkoutUtils.js           # Checkout helpers
    ├── orderUtils.js              # Order helpers
    ├── orderStatus.js             # Status badge colors
    ├── dashboardStatus.js         # Dashboard status helpers
    ├── returnStatus.js            # Return status helpers
    ├── posConstants.js            # POS constants
    ├── posCalculations.js         # POS calculations
    ├── dateRange.js               # Date range helpers
    ├── reportCalculator.js        # Report calculations
    ├── reportExport.js            # Export CSV/JSON
    └── dashboardStatus.js         # Dashboard status helpers
```

---

## 1. Core Files

### `src/index.js` — Application Entry Point
```jsx
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
```
**Chức năng**: Khởi tạo React app, wrap toàn bộ app trong:
- `<React.StrictMode>` — Phát hiện lỗi development
- `<Router>` (BrowserRouter) — Điều hướng SPA
- `<AuthProvider>` — Context auth toàn cục

**Cách hoạt động**: Khi app start, `index.js` render `App.js` bên trong các wrapper. Router cho phép tất cả component con dùng hooks như `useNavigate`, `useParams`.

---

### `src/App.js` — Route Configuration
```jsx
<Route element={<PublicLayout />}>
  <Route path="/" element={<HomePage />} />
  <Route path="/products" element={<CategoryPage />} />
  <Route path="/product/:id" element={<ProductDetail />} />
  <Route path="/cart" element={<GioHangPage />} />
  <Route path="/thanh-toan" element={<ThanhToanPage />} />
  <Route path="/lich-su-don-hang" element={<LichSuDonHangPage />} />
  <Route path="/brands" element={<ThuongHieuPage />} />
</Route>

<Route path="/login" element={<DangNhapPage />} />
<Route path="/register" element={<DangKyPage />} />

<Route path="/admin" element={<AdminLayout />}>
  <Route index element={<DashboardPage />} />
  <Route path="products" element={<AdminProductsPage />} />
  <Route path="orders" element={<AdminOrdersPage />} />
  <Route path="employees" element={<AdminEmployeesPage />} />
  <Route path="customers" element={<AdminCustomersPage />} />
  <Route path="reports" element={<AdminReportPage />} />
  <Route path="returns" element={<AdminReturnsPage />} />
  <Route path="pos" element={<POSPage />} />
</Route>
```

**Chức năng**: Định nghĩa tất cả route của ứng dụng.
**Cách hoạt động**:
- Public routes được wrap trong `PublicLayout` (Header + Footer)
- Auth routes (login/register) không có layout
- Admin routes được wrap trong `AdminLayout` (Sidebar + Header)
- Route `/admin/pos` dùng `POSPage` (đã move từ public → admin)

---

### `src/contexts/AuthContext.jsx` — Authentication State
**Chức năng**: Quản lý authentication cho cả khách hàng (user) và nhân viên (staff).

**State quản lý**:
| State | Kiểu | Mục đích |
|-------|------|----------|
| `user` | Object/null | Thông tin khách hàng đã login |
| `staff` | Object/null | Thông tin nhân viên đã login |
| `loading` | Boolean | Đang khôi phục session từ localStorage |

**Các hàm chính**:
| Hàm | Mô tả |
|-----|-------|
| `loginUser(data)` | Login với loại='customer', lưu vào localStorage |
| `loginStaff(data)` | Login với loại='employee', lưu vào localStorage |
| `logout()` | Xóa cả user và staff khỏi state + localStorage |
| `isUser()` | Kiểm tra user đã login chưa |
| `isStaff()` | Kiểm tra staff đã login chưa |
| `isAdmin()` | Kiểm tra staff có vai_trò='admin' không |
| `getCurrentUser()` | Trả về user/staff hiện tại kèm 'userType' |

**Cách hoạt động**:
1. Khi app mount, đọc `localStorage` để khôi phục session
2. Khi login thành công, lưu vào cả state và localStorage
3. Nếu user login → xóa staff, nếu staff login → xóa user
4. Các component gọi `useAuth()` từ context để kiểm tra quyền

---

## 2. Services Layer (API)

### `src/services/api/baseApi.js` — Base API Class
**Chức năng**: Class base cho tất cả API modules.

```js
class BaseApi {
  async _fetch(url, options) — Fetch wrapper với error handling
  async _getErrorMessage(response) — Parse lỗi từ response
  mapProductFields(product) — Map backend product → frontend format
  _mapProducts(data) — Map mảng sản phẩm
}
```

**Cách hoạt động**:
- `_fetch()` tự động set header `Content-Type: application/json`
- Nếu response không OK, throw Error với message đã parse
- `mapProductFields` chuyển đổi từ camelCase backend (e.g., `idSanPham`) sang snake_case frontend (e.g., `id_san_pham`)
- ⚠️ Đã sửa: `id_danh_muc: 1` → `product.danhMuc?.idDanhMuc || product.idDanhMuc || 1`

---

### `src/services/api/index.js` — API Module Aggregator
**Chức năng**: Import tất cả API module riêng lẻ và export chung.

| API | File gốc | Chức năng chính |
|-----|----------|-----------------|
| `productApi` | `productApi.js` | getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, getCategories, getBrands, searchProducts |
| `cartApi` | `cartApi.js` | getCart, addCartItem, removeCartItem, clearCart, updateCartItem, checkStockBeforeCheckout, checkoutCart |
| `orderApi` | `orderApi.js` | placeOrder, cancelOrder, getUserOrders, getOrderDetails, confirmOrder, shipOrder, updateTracking, completeOrder... |
| `authApi` | `authApi.js` | login, registerCustomer |
| `customerApi` | `customerApi.js` | getCustomers, createCustomer, updateCustomer, resetCustomerPassword, deleteCustomer |
| `employeeApi` | `employeeApi.js` | getEmployees, createEmployee, updateEmployeeRole, resetEmployeePassword, deleteEmployee |
| `reviewApi` | `reviewApi.js` | createReview |
| `returnApi` | `returnApi.js` | getAllReturns, createReturn, approveReturn, rejectReturn |
| `posApi` | `posApi.js` | createPosBanLe, createPosOrder |

---

### `src/services/api/cartApi.js` — Cart API
**Chức năng**: Tương tác với giỏ hàng backend.

**Các endpoint gọi**:
| Method | Endpoint | Mô tả |
|--------|----------|-------|
| GET | `/don-hang/gio-hang-dto?userId=` | Lấy giỏ hàng (ưu tiên) |
| GET | `/cart/dto?userId=` | Fallback nếu endpoint trên fail |
| POST | `/cart/items` | Thêm sản phẩm vào giỏ |
| DELETE | `/cart/items?userId=&sanPhamId=` | Xóa 1 sản phẩm |
| DELETE | `/cart?userId=` | Xóa toàn bộ giỏ |
| PUT | `/cart/items` | Cập nhật số lượng |
| POST | `/cart/check-stock` | Kiểm tra tồn kho |
| POST | `/dat-hang` | Thanh toán giỏ hàng |

**Cách hoạt động đặc biệt**:
- `_enrichCartItemsWithProductDetails()`: Nếu cart items không có đủ thông tin sản phẩm, sẽ gọi từng API `getProductById` để enrich (⚠️ N+1 query problem)
- `checkoutCart()`: Lấy cart hiện tại, build order data và gửi lên `/dat-hang`

---

### `src/services/api/orderApi.js` — Order API
**Chức năng**: Tương tác với đơn hàng backend.

**Các endpoint chính**:
| Endpoint | Mô tả |
|----------|-------|
| `POST /dat-hang` | Đặt hàng mới |
| `POST /don-hang/{id}/huy` | Hủy đơn hàng |
| `GET /don-hang/lich-su?userId=` | Lịch sử đơn hàng |
| `GET /don-hang/lich-su-dto?userId=` | Lịch sử đơn hàng (DTO) |
| `GET /don-hang/{id}` | Chi tiết đơn hàng |
| `POST /don-hang/{id}/xac-nhan` | Xác nhận đơn (admin) |
| `POST /don-hang/{id}/cap-nhat-van-don` | Cập nhật vận đơn (admin) |
| `POST /don-hang/{id}/da-thu-tien-con-lai` | Đã thu tiền còn lại (admin) |
| `GET /don-hang?trangThai=` | Lấy danh sách đơn hàng (admin) |

⚠️ **Đã sửa**: `shipOrder()` thêm tham số `trackingNumber` thay vì gửi `maVanDon: ""`.

---

### `src/services/api/productApi.js` — Product API
**Chức năng**: CRUD sản phẩm + catalog.

| Endpoint | Mô tả |
|----------|-------|
| `GET /san-pham` | Lấy tất cả sản phẩm |
| `GET /san-pham/{id}` | Lấy 1 sản phẩm |
| `POST /san-pham` | Tạo sản phẩm mới |
| `PUT /san-pham/{id}` | Cập nhật sản phẩm |
| `DELETE /san-pham/{id}` | Xóa sản phẩm |
| `GET /catalog/danh-muc` | Lấy danh mục |
| `GET /catalog/thuong-hieu` | Lấy thương hiệu |
| `GET /catalog/san-pham/search?kw=&danhMucId=&thuongHieuId=&nongDo=&dungTich=` | Tìm kiếm sản phẩm |

**Cách hoạt động**: Tất cả method gọi API đều qua `this._fetch()` và `this._mapProducts()` để map field names.

---

## 3. Hooks Layer

### `src/hooks/useCart.js` — Cart State Hook
**Chức năng**: Quản lý state giỏ hàng phía public (không phải POS).

**State**:
| State | Mô tả |
|-------|-------|
| `cart` | Object giỏ hàng `{ idDonHang, chiTiet: [] }` |
| `loading` | Đang fetch |
| `error` | Lỗi nếu có |
| `updatingItem` | sanPhamId đang được cập nhật |

**Các hàm**:
- `fetchCart()` — Gọi `api.getCart(userId)`
- `updateItemQuantity(sanPhamId, newQuantity)` — Gọi API update + refresh
- `removeItem(sanPhamId)` — Gọi API remove + refresh
- `clearCart()` — Xác nhận + gọi API clear

**Phụ thuộc**: `useAuth` (lấy `user.id_nguoi_dung`)

---

### `src/hooks/useOrders.js` — Order List Hook
**Chức năng**: Quản lý danh sách đơn hàng + filtering + pagination.

**State**:
| State | Mô tả |
|-------|-------|
| `orders` | Array đơn hàng (đã xử lý format) |
| `loading` | Đang fetch |
| `error` | Lỗi nếu có |
| `searchTerm` | Từ khóa tìm kiếm |
| `statusFilter` | Bộ lọc trạng thái |
| `currentPage` | Trang hiện tại |
| `currentOrders` | Đơn hàng phân trang |

**Cách hoạt động**:
1. Khi mount hoặc filter thay đổi → `fetchOrders()`
2. Nếu user login → gọi `getUserOrdersHistoryDto(userId, statusFilter)`
3. Nếu không → gọi `getOrders(statusFilter)` (admin fallback)
4. Client-side filter theo searchTerm + paginate (10 items/page)

---

### `src/hooks/useCancelOrder.js` — Cancel Order Hook
**Chức năng**: Hủy đơn hàng.

```js
const cancelOrder = async (orderId, onSuccess, order) => {
  // - Nhập lý do hủy (prompt)
  // - Kiểm tra nếu pre-order (trangThaiVanHanh === 'Chờ hàng') → xác nhận thêm
  // - Gọi api.cancelOrder(orderId, reason)
  // - Call onSuccess callback
}
```

⚠️ **Đã sửa**: Thêm tham số `order` để kiểm tra đúng đơn hàng pre-order, thay vì hardcode mock.

---

### `src/hooks/useReviewOrder.js` — Review Order Hook
**Chức năng**: Gửi đánh giá cho đơn hàng đã hoàn thành.

**Cách hoạt động**:
1. Kiểm tra `reviewData.comment` không rỗng
2. Kiểm tra order có `chiTiet` không rỗng
3. Map từng item trong order → gọi `api.createReview(reviewPayload)`
4. Gửi đồng thời tất cả review bằng `Promise.all()`

---

### `src/hooks/useReturnOrder.js` — Return Request Hook
**Chức năng**: Gửi yêu cầu đổi trả.

**Cách hoạt động**:
1. Kiểm tra `returnData.lyDo` không rỗng
2. Build payload `{ idDonHang, idNguoiDung, lyDo }`
3. Gọi `api.createReturn(returnPayload)`

---

### `src/hooks/useCheckout.js` — POS Checkout Hook
**Chức năng**: Xử lý thanh toán tại POS (dành cho staff).

**Các hàm**:
| Hàm | Mô tả |
|-----|-------|
| `validateCheckout(cart, customerName)` | Validate trước khi thanh toán |
| `processPayment(cart, customerName, customerPhone)` | Xử lý thanh toán |
| `resetCheckout()` | Reset state về mặc định |

**Cách hoạt động**:
1. Validate: kiểm tra cart, customerName, staff, cash
2. Nếu payment = deposit → gọi `api.createPosOrder()`
3. Nếu payment != deposit → gọi `api.createPosBanLe()`
4. Build receipt data và return

⚠️ **Đã sửa**: Tax hardcode → dùng `TAX_RATE` constant.

---

### `src/hooks/useChiTietSanPham.js` — Product Detail Hook
**Chức năng**: Quản lý state cho trang chi tiết sản phẩm.

**State**: product, loading, error, quantity, relatedProducts, cartLoading

**Các hàm**:
- `processCartAction(action)` — Thêm vào giỏ, mua ngay, hoặc pre-order
- `updateQuantity`, `incrementQuantity`, `decrementQuantity` — Quản lý số lượng
- `getStockStatus()` — Kiểm tra tồn kho
- `getBrandName()` — Lấy tên thương hiệu

---

### `src/hooks/useCategoryProducts.js` — Category Products Hook
**Chức năng**: Fetch sản phẩm theo danh mục/thương hiệu/tìm kiếm.

**Cách hoạt động**:
1. Nếu có searchQuery → gọi `api.searchProducts()`
2. Nếu không → gọi `api.getAllProducts()` và filter client-side

---

### `src/hooks/useCategoryFilters.js` — Category Filters Hook
**Chức năng**: Quản lý filter (brand, concentration, price) + sort.

**State**: filters (selectedBrands, selectedConcentrations, maxPrice, sortBy)

**Các hàm**:
- `handleBrandChange(brandId)` — Toggle brand filter
- `handleConcentrationChange(type)` — Toggle concentration filter
- `handlePriceChange(maxPrice)` — Set max price
- `clearFilters()` — Reset về mặc định
- `setSortBy(sortBy)` — Đổi sort mode

---

## 4. Layout Components

### `src/layouts/PublicLayout.jsx`
```jsx
<Header brandName="Enstorm" />
<Outlet />   {/* Nội dung trang public */}
<Footer brandName="Enstorm" />
```

### `src/layouts/AdminLayout.jsx`
```jsx
<div class="grid md:grid-cols-[220px_1fr]">
  <AdminSidebar />
  <div>
    <AdminHeader />
    <main>
      <Outlet />   {/* Nội dung trang admin */}
    </main>
  </div>
</div>
```

### `src/layouts/AdminSidebar.jsx`
**Chức năng**: Sidebar navigation cho admin.

**Các mục**:
- Dashboard (luôn hiện)
- Sản phẩm (luôn hiện)
- Đơn hàng (luôn hiện)
- Đổi trả (luôn hiện)
- Nhân viên (chỉ admin)
- Khách hàng (chỉ admin)
- Báo cáo (luôn hiện)

**Cách hoạt động**: Dùng `NavLink` từ react-router-dom với `isActive` để highlight. Dùng `useAuth().isAdmin()` để ẩn/hiện menu admin-only.

### `src/layouts/AdminHeader.jsx`
**Chức năng**: Header admin với alerts và POS button.

**Các tính năng**:
1. **POS System button** — Link đến `/admin/pos`
2. **Pending orders alert** — Đếm đơn hàng có `trangThaiVanHanh === 'Đang chờ'`
3. **Low stock alert** — Đếm sản phẩm có `so_luong_ton_kho < 5`
4. **Home button** — Link về trang chủ

**Cách hoạt động**: Fetch data mỗi 30 giây tự động, hiển thị badge nếu có alert.

---

## 5. Component Files

### `src/components/common/Header.jsx` — Public Header
**Chức năng**: Header cho trang public với search, cart link, user menu.

**Tính năng**:
1. **Logo** — Link về trang chủ
2. **Navigation** — Trang Chủ, Sản Phẩm, Thương Hiệu
3. **Search bar** — Tìm kiếm (chuyển hướng đến `/products?search=...`)
4. **Cart icon** — Link đến `/cart`
5. **User menu dropdown**:
   - Chưa login: Hiển thị Đăng nhập / Đăng ký
   - Đã login: Hiển thị tên user, Lịch sử đơn hàng, Đăng xuất

---

### `src/components/common/Footer.jsx` — Public Footer
**Chức năng**: Footer cho trang public.

**Các section**:
- Brand info + description
- Shop links (Women's, Men's, Brands, New Arrivals)
- About links (Our Story, Contact Us, FAQs)
- Support links (Shipping & Returns, Privacy Policy, Terms)
- Copyright

---

## 6. Page Components

### `src/pages/public/TrangChu.jsx` — Home Page
**Chức năng**: Trang chủ với hero banner, sản phẩm nổi bật, danh mục.

**Cách hoạt động**:
1. Fetch `api.getAllProducts()`, `api.getCategories()`, `api.getBrands()` đồng thời
2. Render Banner slider + 4 sản phẩm đầu tiên + danh mục với ảnh mẫu

---

### `src/pages/public/DanhMucSanPham.jsx` — Category Page
**Chức năng**: Trang danh sách sản phẩm với filter và sort.

**Cách hoạt động**:
1. Đọc URL params: `category`, `brand`, `search`
2. Fetch metadata (categories, brands) + products đồng thời
3. Filter client-side theo brand, concentration, price
4. Sort theo lựa chọn (Mới nhất, Bán chạy, Giá)
5. **⚠️ Pagination mock**: Hiện tại chỉ render static pagination UI (luôn hiển thị trang 1, 2, 3) — không hoạt động thực sự

---

### `src/pages/public/ChiTietSanPham.jsx` — Product Detail
**Chức năng**: Trang chi tiết sản phẩm.

**Các component con**:
- `Breadcrumbs` — Đường dẫn
- `ProductImage` — Ảnh sản phẩm
- `ProductInfo` — Tên, thương hiệu
- `QuantitySelector` — Chọn số lượng (ẩn nếu hết hàng)
- `ProductSpecs` — Thông số kỹ thuật
- `ActionButtons` — Thêm vào giỏ / Mua ngay / Pre-order
- `ServiceFeatures` — Dịch vụ
- `RelatedProducts` — Sản phẩm liên quan

---

### `src/pages/public/GioHang.jsx` — Cart Page
**Chức năng**: Trang giỏ hàng.

**Luồng xử lý**:
1. Nếu chưa login → Hiển thị "Yêu cầu đăng nhập" + link login
2. Nếu loading → Spinner
3. Nếu error → Hiển thị lỗi + nút "Thử lại"
4. Nếu giỏ rỗng → `EmptyCart` component
5. Nếu có sản phẩm → `CartItemList` + `CartSummary`

---

### `src/pages/public/LichSuDonHangPage.jsx` — Order History
**Chức năng**: Trang lịch sử đơn hàng (đã refactored dùng hooks riêng).

**Các tính năng**:
- Hiển thị danh sách đơn hàng (`OrderList`)
- Hủy đơn hàng (`useCancelOrder`) — **Đã sửa**: truyền order thật
- Viết đánh giá (`useReviewOrder` + `ReviewModal`)
- Yêu cầu đổi trả (`useReturnOrder` + `ReturnModal`)

⚠️ **Đã xóa**: File `LichSuDonHang.jsx` (dead code 577 dòng, duplicate với file này)

---

### `src/pages/public/ThuongHieuPage.jsx` — Brands Page
**Chức năng**: Hiển thị tất cả thương hiệu dạng grid.

**Cách hoạt động**:
1. Fetch `api.getBrands()`
2. Render grid các thương hiệu, mỗi item là link đến `/products?brand={id}`
3. Hiển thị loading/error state

---

### `src/pages/public/checkout/ThanhToanPage.jsx` — Checkout Page
**Chức năng**: Trang thanh toán cho khách hàng public.

**Luồng xử lý**:
1. Kiểm tra đăng nhập (nếu chưa → redirect)
2. Load dữ liệu checkout (`useCheckoutData`)
3. Hiển thị form thông tin giao hàng (`ShippingForm`)
4. Chọn phương thức thanh toán (`PaymentMethodSelector`)
5. Kiểm tra tồn kho từng sản phẩm (gọi API getProductById cho mỗi item)
6. Submit đơn hàng (`useSubmitOrder`)

---

### `src/pages/admin/POSPage.jsx` — POS Page
**Chức năng**: Bán hàng tại quầy (POS) — đã move từ public sang admin.

**Tính năng**:
1. Tìm kiếm sản phẩm (theo tên hoặc thương hiệu)
2. Thêm sản phẩm vào giỏ (tap để thêm +1)
3. Quản lý số lượng (tăng/giảm/xóa)
4. Nhập thông tin khách (tên + SĐT)
5. Chọn phương thức thanh toán:
   - **Cash** — Nhập số tiền nhận, tính tiền thừa
   - **Card** — Thanh toán đầy đủ
   - **Online** — Ví điện tử
   - **Deposit** — Đặt cọc 50%
6. In hóa đơn

**Cách hoạt động**:
1. Load sản phẩm + thương hiệu khi mount
2. Lưu cart vào `localStorage('pos-cart')` để persist
3. Khi thanh toán: gọi `api.createPosBanLe()` hoặc `api.createPosOrder()` tùy phương thức

⚠️ **Đã sửa**: Tax dùng `TAX_RATE` constant thay hardcode.

---

### `src/pages/auth/DangNhapPage.jsx` — Login Page
**Chức năng**: Đăng nhập cho user và staff.

**Tính năng**:
- Form đăng nhập với tên đăng nhập + mật khẩu
- Chọn loại: Khách hàng / Nhân viên
- Nếu là nhân viên → gọi `loginStaff()`
- Nếu là khách hàng → gọi `loginUser()`
- Sau login thành công → redirect về trang chủ (user) hoặc admin (staff)

---

### `src/pages/auth/DangKyPage.jsx` — Register Page
**Chức năng**: Đăng ký tài khoản khách hàng.

**Cách hoạt động**: Gọi `api.registerCustomer()` với thông tin đăng ký.

---

## 7. Utility Files

### Overview — Code Duplication Status

| Chức năng | File | Ghi chú |
|-----------|------|---------|
| `formatCurrency(amount)` | `checkoutCalculations.js`, `cartUtils.js`, `orderUtils.js`, `posCalculations.js` | ⚠️ Duplicate ×4 |
| `getStatusBadgeColor(status)` | `orderUtils.js`, `orderStatus.js`, `dashboardStatus.js` | ⚠️ Duplicate ×3 |
| `PAYMENT_METHODS` | `checkoutUtils.js`, `posConstants.js` | ⚠️ Duplicate ×2 |
| `calculateDepositAmount(total)` | `checkoutCalculations.js`, `posCalculations.js` | ⚠️ Duplicate ×2 |
| `validateQuantity(quantity, maxStock)` | `productUtils.js`, `cartUtils.js` | ⚠️ Duplicate ×2 |
| `getOrderItemImageUrl(item)` | `checkoutUtils.js`, `orderUtils.js` | ⚠️ Duplicate ×2 |

**Đề xuất**: Gộp thành 3 file centralized:
- `utils/currency.js` — formatCurrency, calculateSubtotal, calculateTax, calculateTotal
- `utils/statusHelpers.js` — getStatusBadgeColor, getStatusIcon, getStatusColor (cho cả order, dashboard, return)
- `utils/paymentMethods.js` — PAYMENT_METHODS, PAYMENT_METHOD_LABELS, PAYMENT_METHOD_DESCRIPTIONS

---

### `src/utils/productUtils.js`
**Chức năng**: Product utilities cho product detail page.

| Hàm | Mô tả |
|-----|-------|
| `formatPrice(price)` | Format giá VNĐ (toLocaleString) |
| `getStockStatus(stockQuantity)` | Lấy trạng thái tồn kho (out_of_stock / low_stock / in_stock) |
| `validateQuantity(quantity, maxStock)` | Validate số lượng trong khoảng [1, maxStock] |
| `createPreOrderData(product, quantity)` | Tạo object pre-order data |
| `formatCartItem(product, quantity)` | Format item cho cart API |
| `getRelatedProducts(allProducts, currentId, brandId, limit)` | Lấy sản phẩm liên quan cùng thương hiệu |
| `createBrandMap(brands)` | Tạo map id → tên thương hiệu |

---

### `src/utils/productMapper.js`
**Chức năng**: Chuyển đổi dữ liệu sản phẩm giữa backend và frontend.

| Hàm | Mô tả |
|-----|-------|
| `mapProductFromBackend(product)` | Backend (camelCase) → Frontend (snake_case) |
| `mapProductToBackend(productData)` | Frontend → Backend (cho create/update) |
| `getStockStatus(stockQuantity)` | Status với className Tailwind |

---

### `src/utils/productSort.js`
**Chức năng**: Sort và filter sản phẩm.

| Hàm | Mô tả |
|-----|-------|
| `SORT_OPTIONS` | ['Mới nhất', 'Bán chạy nhất', 'Giá: Tăng dần', 'Giá: Giảm dần'] |
| `sortProducts(products, sortBy)` | Sort theo lựa chọn |
| `filterAndSortProducts(products, filters)` | Kết hợp filter + sort |

---

### `src/utils/categoryHelpers.js`
**Chức năng**: Helper cho category page.

| Hàm | Mô tả |
|-----|-------|
| `getCategoryName(id, categories)` | Lấy tên danh mục từ ID |
| `getBrandName(id, brands)` | Lấy tên thương hiệu từ ID |
| `getCategoryTitle(categoryId, brandId, searchQuery, categories, brands)` | Tạo title động |
| `getConcentrationTypes()` | Các loại nồng độ |
| `filterByConcentration(products, selectedConcentrations)` | Filter theo nồng độ |
| `getDefaultFilters()` | Filter mặc định |

---

### `src/utils/cartUtils.js`
**Chức năng**: Helper cho cart page.

| Hàm | Mô tả |
|-----|-------|
| `calculateTotal(cart)` | Tính tổng tiền giỏ hàng |
| `calculateItemSubtotal(item)` | Tính tiền 1 sản phẩm |
| `formatCurrency(amount)` | Format tiền tệ |
| `validateQuantity(quantity)` | Validate số lượng |
| `isCartEmpty(cart)` | Kiểm tra giỏ hàng rỗng |
| `getCartItemCount(cart)` | Đếm số items |

---

### `src/utils/checkoutCalculations.js`
**Chức năng**: Tính toán cho checkout.

| Hàm | Mô tả |
|-----|-------|
| `calculateCartTotal(cart)` | Tổng tiền giỏ hàng (dùng `giaTaiThoiDiemMua`) |
| `calculatePreOrderTotal(items)` | Tổng tiền pre-order |
| `calculateDepositAmount(total)` | 50% tiền cọc |
| `calculateRemainingAmount(total, deposit)` | Số tiền còn lại |
| `formatCurrency(amount)` | Format tiền tệ |

---

### `src/utils/checkoutUtils.js`
**Chức năng**: Helper cho checkout page.

| Hàm | Mô tả |
|-----|-------|
| `PAYMENT_METHODS` | { COD, ONLINE, CARD } |
| `validatePhoneNumber(phone)` | Validate SĐT Việt Nam (10-11 số) |
| `validateShippingForm(shippingInfo)` | Validate form giao hàng |
| `getOrderItemId(item, isPreOrder)` | Lấy ID item (hỗ trợ nhiều format) |
| `getOrderItemImageUrl(item)` | Lấy URL ảnh (hỗ trợ nhiều field names) |
| `getOrderItemName(item)` | Lấy tên sản phẩm (hỗ trợ nhiều field names) |
| `getOrderItemQuantity(item)` | Lấy số lượng |
| `getOrderItemPrice(item)` | Lấy giá (hỗ trợ nhiều field names) |
| `calculateOrderTotal(items)` | Tính tổng tiền |

---

### `src/utils/orderUtils.js`
**Chức năng**: Helper cho order history page.

| Hàm | Mô tả |
|-----|-------|
| `getStatusBadgeColor(status)` | Màu badge theo trạng thái |
| `canCancelOrder(order)` | Kiểm tra có thể hủy không |
| `canWriteReview(order)` | Kiểm tra có thể viết review không (chỉ 'Hoàn thành') |
| `canRequestReturn(order, orderDate, hasExistingReturn)` | Kiểm tra đủ điều kiện đổi trả (trong 7 ngày) |
| `formatOrderDate(dateString)` | Format ngày |
| `formatCurrency(amount)` | Format tiền tệ |
| `getOrderItemImageUrl(imageUrl)` | Xử lý URL ảnh (relative → absolute) |
| `calculateOrderItemTotal(item)` | Tính tiền 1 item |

---

### `src/utils/orderStatus.js`
**Chức năng**: Status badge CSS classes cho đơn hàng.

Chỉ có 1 hàm `getStatusClass(status)` trả về className Tailwind.
⚠️ **Duplicate** với `orderUtils.getStatusBadgeColor()` và `dashboardStatus.getStatusBadgeColor()`.

---

### `src/utils/dashboardStatus.js`
**Chức năng**: Status helpers cho dashboard.

| Hàm | Mô tả |
|-----|-------|
| `getStatusBadgeColor(status)` | Badge CSS |
| `getStatusIcon(status)` | Material icon name |
| `getStatusColor(status)` | Text color CSS |

---

### `src/utils/returnStatus.js`
**Chức năng**: Status helpers cho đổi trả.

| Hàm | Mô tả |
|-----|-------|
| `getReturnStatusBadgeColor(status)` | Badge CSS |
| `getReturnStatusIcon(status)` | Material icon name |
| `getReturnStatusColor(status)` | Text color CSS |

---

### `src/utils/posConstants.js`
**Chức năng**: Constants cho POS.

| Constant | Giá trị |
|----------|---------|
| `PAYMENT_METHODS` | { CASH, CARD, ONLINE, DEPOSIT } |
| `TAX_RATE` | 0.1 (10%) |
| `DEPOSIT_RATE` | 0.5 (50%) |
| `CART_STORAGE_KEY` | 'pos-cart' |
| `ORDER_TYPES` | { SALE, DEPOSIT } |
| `RECEIPT_PRINT_DELAY` | 2000ms |

---

### `src/utils/posCalculations.js`
**Chức năng**: Tính toán cho POS.

| Hàm | Mô tả |
|-----|-------|
| `calculateSubtotal(cart)` | Tổng tạm tính |
| `calculateTax(subtotal, taxRate)` | Tính thuế |
| `calculateTotal(subtotal, tax)` | Tổng cộng |
| `calculateChange(cashReceived, total)` | Tiền thừa |
| `calculateDepositAmount(total)` | Tiền cọc 50% |
| `formatCurrency(amount)` | Format tiền tệ |
| `validateCashPayment(cashReceived, total)` | Kiểm tra đủ tiền |

---

### `src/utils/dateRange.js`
**Chức năng**: Helper cho date range (dùng trong reports).

| Hàm | Mô tả |
|-----|-------|
| `getDefaultDateRange()` | 30 ngày gần nhất → hôm nay |
| `formatDateRange(startDate, endDate)` | Format date range |
| `filterOrdersByDateRange(orders, startDate, endDate)` | Lọc đơn hàng theo ngày |

---

### `src/utils/reportCalculator.js`
**Chức năng**: Tính toán dữ liệu báo cáo.

| Hàm | Mô tả |
|-----|-------|
| `calculateRevenueMetrics(orders)` | Tổng doanh thu, trung bình đơn |
| `calculateOrderStats(orders)` | Thống kê theo trạng thái |
| `calculateTopProducts(orders)` | Top 10 sản phẩm bán chạy |
| `calculateCustomerStats(orders)` | Thống kê khách hàng |
| `calculateRevenueByStatus(orders, stats)` | Doanh thu theo trạng thái |
| `calculateConversionRate(total, completed)` | Tỷ lệ chuyển đổi |

---

### `src/utils/reportExport.js`
**Chức năng**: Export báo cáo ra file.

| Hàm | Mô tả |
|-----|-------|
| `exportReportToCSV(reportData, dateRange)` | Export CSV (tự động download) |
| `exportReportToJSON(reportData, dateRange)` | Export JSON (tự động download) |

---

## 8. Luồng Dữ Liệu Chính

### Luồng 1: Mua hàng (User flow)
```
TrangChu → ChiTietSanPham → GioHang → ThanhToan → API /dat-hang
                                            ↓
                                    Kiểm tra đăng nhập
                                            ↓
                                    Form giao hàng
                                            ↓
                                    Chọn phương thức thanh toán
                                            ↓
                                    Kiểm tra tồn kho (N+1!)
                                            ↓
                                    Gọi placeOrder()
```

### Luồng 2: Quản lý đơn hàng (Admin flow)
```
AdminLayout → AdminOrdersPage → OrderList → OrderDetail
                    ↓                           ↓
              Filter/Search              ShipOrderDialog
                                            ConfirmOrderDialog
                                            CancelOrderDialog
                                            PaymentCollectedDialog
```

### Luồng 3: Bán hàng POS (Staff flow)
```
AdminLayout → POSPage (trong /admin/pos)
                    ↓
            Chọn sản phẩm → cart
                    ↓
            Nhập thông tin khách
                    ↓
            Chọn phương thức thanh toán
                    ↓
            Cash: createPosBanLe()
            Card: createPosBanLe()
            Online: createPosBanLe()
            Deposit: createPosOrder()
                    ↓
            In hóa đơn (window.print())
```

### Luồng 4: Authentication
```
DangNhapPage
    ├── Khách hàng → loginUser() → lưu user vào localStorage → redirect /
    └── Nhân viên → loginStaff() → lưu staff vào localStorage → redirect /admin

DangKyPage → registerCustomer() → tạo tài khoản mới
```

---

## 9. API Endpoint Summary

### Public Endpoints
| API | Method | Endpoint |
|-----|--------|----------|
| Auth | POST | `/api/auth/login` |
| Auth | POST | `/api/auth/register-customer` |
| Product | GET | `/api/san-pham` |
| Product | GET | `/api/san-pham/{id}` |
| Catalog | GET | `/api/catalog/danh-muc` |
| Catalog | GET | `/api/catalog/thuong-hieu` |
| Catalog | GET | `/api/catalog/san-pham/search` |
| Cart | GET | `/api/don-hang/gio-hang-dto` |
| Cart | POST | `/api/cart/items` |
| Cart | PUT | `/api/cart/items` |
| Cart | DELETE | `/api/cart/items` |
| Order | POST | `/api/dat-hang` |
| Order | POST | `/api/don-hang/{id}/huy` |
| Order | GET | `/api/don-hang/lich-su` |
| Review | POST | `/api/reviews` |
| Return | POST | `/api/doi-tra` |

### Admin Endpoints
| API | Method | Endpoint |
|-----|--------|----------|
| Product | POST | `/api/san-pham` |
| Product | PUT | `/api/san-pham/{id}` |
| Product | DELETE | `/api/san-pham/{id}` |
| Order | GET | `/api/don-hang` |
| Order | POST | `/api/don-hang/{id}/xac-nhan` |
| Order | POST | `/api/don-hang/{id}/cap-nhat-van-don` |
| Order | POST | `/api/don-hang/{id}/chuyen-dang-cho` |
| Order | POST | `/api/don-hang/{id}/hoan-thanh` |
| Customer | GET/POST/PUT | `/api/admin/khach-hang` |
| Employee | GET/POST | `/api/admin/nhan-vien` |
| Return | GET | `/api/doi-tra/all` |
| Return | POST | `/api/doi-tra/{id}/duyet` |
| Return | POST | `/api/doi-tra/{id}/tu-choi` |
| POS | POST | `/api/pos/ban-le` |
| POS | POST | `/api/pos/order` |

---

## 10. Known Issues / TODOs

### 🔴 Critical
| Issue | File | Mức độ |
|-------|------|--------|
| N+1 query trong enrich cart items | `cartApi.js` | Performance |
| Thiếu JWT/Authorization header | `baseApi.js` | Security |
| checkOrderReturnStatus fetch all returns | `orderApi.js` (dòng 165) | Performance |

### 🟡 High
| Issue | File | Mô tả |
|-------|------|-------|
| Duplicate util functions (7 bộ) | utils/ | ~12 files |
| snake_case vs camelCase lẫn lộn | Toàn bộ | Inconsistency |
| Đuôi file không nhất quán (.js vs .jsx) | root files | Style |

### 🟢 Medium
| Issue | File | Mô tả |
|-------|------|-------|
| Pagination mock (static UI) | `DanhMucSanPham.jsx` | Not functional |
| `services/api.js` re-export | `services/api.js` | Redundant (2 lines file) |
| `useCheckout.js` tên sai | `hooks/useCheckout.js` | Nên rename thành `usePosCheckout` |