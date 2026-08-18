# TÀI LIỆU TỔNG QUAN HỆ THỐNG PERFUME SHOP

## 📋 MỤC LỤC
1. [Tổng Quan Dự Án](#tổng-quan-dự-án)
2. [Kiến Trúc Hệ Thống](#kiến-trúc-hệ-thống)
3. [Backend - Spring Boot](#backend---spring-boot)
4. [Frontend - React](#frontend---react)
5. [Cơ Sở Dữ Liệu](#cơ-sở-dữ-liệu)
6. [Các Tính Năng Nổi Bật](#các-tính-năng-nổi-bật)
7. [API Endpoints](#api-endpoints)
8. [Quy Trình Nghiệp Vụ](#quy-trình-nghiệp-vụ)

---

## 🎯 TỔNG QUAN DỰ ÁN

### Thông Tin Cơ Bản
- **Tên dự án**: Hệ thống quản lý cửa hàng nước hoa (Perfume Shop)
- **Mục đích**: Xây dựng hệ thống quản lý bán hàng online và quản lý kho nước hoa
- **Công nghệ**: Full-stack Web Application
- **Kiến trúc**: Client-Server (REST API)

### Mục Tiêu
- Quản lý sản phẩm nước hoa (danh mục, thương hiệu, tồn kho)
- Hỗ trợ khách hàng đặt hàng online
- Quản lý đơn hàng và vận chuyển
- Quản lý nhập kho và nhà cung cấp
- Báo cáo thống kê kinh doanh
- Hệ thống đấu thầu và báo giá NCC
- Quản lý đổi trả hàng
- Tích hợp thanh toán online (PayOS)

---

## 🏗️ KIẾN TRÚC HỆ THỐNG

### Tổng Quan Kiến Trúc
```
┌─────────────────┐         ┌─────────────────┐         ┌─────────────────┐
│   React Frontend│ ◄─────► │  Spring Boot    │ ◄─────► │   MySQL         │
│   (Port 3000)   │  REST   │  Backend        │  JPA    │   Database      │
│                 │  API    │  (Port 8080)    │         │                 │
└─────────────────┘         └─────────────────┘         └─────────────────┘
                                    │
                                    │
                            ┌───────┴────────┐
                            │  External APIs  │
                            ├─────────────────┤
                            │  - PayOS Payment│
                            │  - Email SMTP   │
                            └─────────────────┘
```

### Tech Stack

#### Backend
- **Framework**: Spring Boot 3.2.5
- **Language**: Java 17
- **ORM**: Spring Data JPA + Hibernate
- **Database**: MySQL
- **Security**: Spring Security + JWT
- **Build Tool**: Maven

#### Frontend
- **Framework**: React 19.2.0
- **Routing**: React Router DOM 7.9.6
- **Styling**: Tailwind CSS 3.4.19
- **Build Tool**: React Scripts 5.0.1

---

## 🔧 BACKEND - SPRING BOOT

### Cấu Trúc Thư Mục
```
src/main/java/com/example/perfumeshop/
├── config/              # Cấu hình (Security, PayOS, CORS)
├── controller/          # REST API Controllers (21 files)
├── dto/                 # Data Transfer Objects (25 files)
├── entity/              # JPA Entities (20 files)
├── exception/           # Exception Handlers (2 files)
├── repository/          # JPA Repositories (18 files)
├── security/            # JWT, AuthFilter (4 files)
└── service/             # Business Logic (23 files)
```

### Dependencies Chính

#### Core Framework
- **spring-boot-starter-web**: RESTful API
- **spring-boot-starter-data-jpa**: Database ORM
- **spring-boot-starter-validation**: Input validation
- **spring-boot-starter-security**: Authentication & Authorization
- **mysql-connector-j**: MySQL driver

#### Security & Authentication
- **io.jsonwebtoken (jjwt)**: JWT token generation/validation
- **spring-boot-starter-security**: Spring Security framework

#### Payment Integration
- **vn.payos:payos-java (2.0.1)**: PayOS payment gateway SDK

#### File Processing
- **org.apache.poi:poi-ooxml (5.2.5)**: Excel file import (.xlsx)
- **org.apache.commons:commons-csv (1.10.0)**: CSV file import

#### Email Service
- **spring-boot-starter-mail**: Email sending (SMTP)

#### Utilities
- **org.projectlombok:lombok**: Reduce boilerplate code
- **jackson-datatype-hibernate6**: Handle Hibernate lazy loading in JSON

### Entities (20 Bảng)

| Entity | Mô Tả | Quan Hệ Chính |
|--------|-------|---------------|
| **NguoiDung** | Khách hàng | → DonHang, DanhGiaSanPham |
| **NhanVien** | Nhân viên | → DonHang, PhieuNhapKho, PhieuGoiThau |
| **SanPham** | Sản phẩm nước hoa | → DanhMuc, ThuongHieu |
| **DanhMuc** | Danh mục SP | 1:N SanPham |
| **ThuongHieu** | Thương hiệu | 1:N SanPham |
| **DonHang** | Đơn hàng | → ChiTietDonHang, PhieuDoiTra |
| **ChiTietDonHang** | Chi tiết đơn | → SanPham, PhieuNhapKho (FEFO) |
| **PhieuGoiThau** | Gói thầu NCC | → ChiTietGoiThau, BaoGiaNCC |
| **ChiTietGoiThau** | Chi tiết gói thầu | → SanPham |
| **BaoGiaNCC** | Báo giá NCC | → PhieuGoiThau |
| **PhieuNhapKho** | Phiếu nhập kho | → ChiTietPhieuNhap |
| **ChiTietPhieuNhap** | Chi tiết phiếu nhập | → SanPham, HSD, Số lô |
| **BienDongKho** | Biến động kho | Audit trail (NHAP/XUAT) |
| **SuKien** | Sự kiện khuyến mãi | 1:N DonHang |
| **PhieuDoiTra** | Đổi trả hàng | → DonHang, ChiTietDonHang |
| **DanhGiaSanPham** | Đánh giá SP | → SanPham, NguoiDung |
| **SanPhamDeXuat** | SP đề xuất NCC | → PhieuGoiThau, SanPham |
| **PhieuNhapTam** | Phiếu nhập tạm | Session-based import |
| **LoginLog** | Log đăng nhập | Audit login history |

### Services Chính

#### 1. AuthService
- Đăng ký, đăng nhập (JWT)
- Xác thực email (verification token)
- Quản lý session

#### 2. DonHangService
- Tạo đơn hàng
- Xác nhận đơn (tạo pick list FEFO)
- Cập nhật trạng thái (đang giao, hoàn thành, hủy)
- Quản lý mã vận đơn

#### 3. ProcurementService (Đấu Thầu & Nhập Hàng)
- Tạo phiếu gọi thầu
- Quản lý báo giá NCC
- Tính toán định lượng đặt hàng (DSV formula)
- Gợi ý sản phẩm cần nhập
- **Công thức DSV**: `Q = (V × T) + SS - I`
  - T = 30 ngày
  - SS (Safety Stock) = V × 5

#### 4. FEFOService (First Expired First Out)
- Tự động chọn lô hàng sắp hết hạn
- Tạo pick list cho đơn hàng
- Kiểm tra HSD khi xuất kho

#### 5. CheckoutService
- Xử lý thanh toán (COD, PayOS)
- Tính toán giảm giá (sự kiện, sản phẩm)
- Validate tồn kho

#### 6. PaymentService
- Tích hợp PayOS Gateway
- Tạo payment link
- Xử lý webhook callback
- Cập nhật trạng thái thanh toán

#### 7. EmailService
- Gửi email xác thực đăng ký
- Gửi email xác nhận đơn hàng
- Gửi email thông báo trạng thái đơn

#### 8. ReportService
- Báo cáo doanh thu theo thời gian
- Thống kê sản phẩm bán chạy
- Báo cáo tồn kho
- Cảnh báo HSD sắp hết

#### 9. DoiTraService
- Tạo phiếu đổi trả
- Duyệt/từ chối đổi trả
- Cập nhật kho khi duyệt

### Security Configuration

#### JWT Authentication
- **Token Type**: Bearer JWT
- **Secret Key**: Configurable (application.properties)
- **Expiration**: Configurable
- **Claims**: username, roles

#### Role-Based Access Control (RBAC)
```java
Roles:
- KHACH_HANG: Đặt hàng, xem đơn, đánh giá
- NHAN_VIEN: Xử lý đơn, nhập kho
- QUAN_LY_KHO: Quản lý kho, phê duyệt nhập
- QUAN_LY: Toàn quyền admin
```

#### Protected Endpoints
- `/api/admin/**`: Chỉ NHAN_VIEN, QUAN_LY_KHO, QUAN_LY
- `/api/user/**`: Authenticated users
- `/api/public/**`: Public access

---

## 💻 FRONTEND - REACT

### Cấu Trúc Thư Mục
```
src/
├── assets/              # Images, icons
├── components/          # Reusable components
├── contexts/            # React Context (AuthContext)
├── hooks/               # Custom hooks
├── layouts/             # Layout components (Header, Sidebar)
├── pages/               # Page components
│   ├── admin/          # Admin pages
│   └── public/         # Public pages
├── services/            # API services
│   └── api/            # API modules
├── styles/              # CSS files
└── utils/               # Utility functions
```

### Dependencies

#### Core Libraries
- **react**: 19.2.0 - UI framework
- **react-dom**: 19.2.0 - DOM rendering
- **react-router-dom**: 7.9.6 - Routing
- **react-scripts**: 5.0.1 - Build tools

#### Styling
- **tailwindcss**: 3.4.19 - Utility-first CSS
- **@tailwindcss/forms**: 0.5.11 - Form styling
- **autoprefixer**: 10.5.0 - CSS vendor prefixes

#### Additional
- **qrcode**: 1.5.3 - QR code generation (cho tra cứu đơn hàng)

### Custom Hooks

| Hook | Mô Tả |
|------|-------|
| **useAuth** | Quản lý authentication state |
| **useProducts** | Fetch & manage products |
| **useOrderDetail** | Fetch order details |
| **useCheckoutData** | Handle checkout logic |
| **useAdminUsers** | Manage users (admin) |
| **useAdminCategories** | Manage categories |
| **useCategoryProducts** | Products by category |
| **useReceipt** | Generate receipt/QR |

### API Services Structure
```javascript
services/api/
├── index.js              # API client config
├── baseApi.js            # Base API functions
├── authApi.js            # Authentication
├── categoryApi.js        # Categories
├── productApi.js         # Products
├── orderApi.js           # Orders
├── customerApi.js        # Customer management
├── userApi.js            # User profile
└── ... (others)
```

### Pages

#### Public Pages
- `/` - Trang chủ (danh sách sản phẩm)
- `/product/:id` - Chi tiết sản phẩm
- `/cart` - Giỏ hàng
- `/checkout` - Thanh toán
- `/login` - Đăng nhập
- `/register` - Đăng ký
- `/profile` - Thông tin cá nhân
- `/orders` - Đơn hàng của tôi
- `/order/:id` - Chi tiết đơn hàng
- `/supplier-portal` - Portal nhà cung cấp

#### Admin Pages
- `/admin/dashboard` - Tổng quan
- `/admin/products` - Quản lý sản phẩm
- `/admin/orders` - Quản lý đơn hàng
- `/admin/categories` - Quản lý danh mục
- `/admin/users` - Quản lý khách hàng
- `/admin/employees` - Quản lý nhân viên
- `/admin/kho` - Quản lý kho
- `/admin/procurement` - Đấu thầu & nhập hàng
- `/admin/returns` - Quản lý đổi trả
- `/admin/campaigns` - Quản lý khuyến mãi
- `/admin/reports` - Báo cáo thống kê
- `/admin/reviews` - Quản lý đánh giá
- `/admin/near-expiry` - Cảnh báo HSD

---

## 🗄️ CƠ SỞ DỮ LIỆU

### Database: MySQL

### 19 Bảng Chính

#### 1. User Management
- **nguoi_dung**: Thông tin khách hàng
- **nhan_vien**: Thông tin nhân viên
- **login_log**: Lịch sử đăng nhập

#### 2. Product Management
- **san_pham**: Sản phẩm (tên, giá, tồn kho, HSD)
- **danh_muc**: Danh mục sản phẩm
- **thuong_hieu**: Thương hiệu
- **danh_gia_san_pham**: Đánh giá & rating

#### 3. Order Management
- **don_hang**: Đơn hàng
- **chi_tiet_don_hang**: Chi tiết đơn hàng
- **phieu_doi_tra**: Phiếu đổi trả

#### 4. Procurement (Đấu Thầu & Nhập Hàng)
- **phieu_goi_thau**: Phiếu gọi thầu
- **chi_tiet_goi_thau**: Chi tiết gọi thầu
- **bao_gia_ncc**: Báo giá nhà cung cấp
- **san_pham_de_xuat**: Sản phẩm NCC đề xuất

#### 5. Warehouse Management
- **phieu_nhap_kho**: Phiếu nhập kho
- **chi_tiet_phieu_nhap**: Chi tiết nhập (HSD, số lô)
- **phieu_nhap_tam**: Phiếu nhập tạm (session)
- **bien_dong_kho**: Biến động kho (audit)

#### 6. Promotion
- **su_kien**: Sự kiện khuyến mãi

### Key Constraints
- Primary Keys: Auto-increment INT
- Foreign Keys: ON DELETE CASCADE/SET NULL
- Indexes: Created on FK columns
- Unique Constraints: Username, Email

---

## 🌟 CÁC TÍNH NĂNG NỔI BẬT

### 1. FEFO (First Expired First Out)
**Mô tả**: Tự động xuất hàng có HSD sớm nhất trước
**Quy trình**:
```
Xác nhận đơn hàng
    ↓
Lấy tất cả lô hàng của sản phẩm
    ↓
Sắp xếp theo HSD (ASC)
    ↓
Phân bổ số lượng theo từng lô
    ↓
Tạo Pick List (danh sách lấy hàng)
    ↓
Xuất kho & tạo biến động kho
```

**Implementation**: `FEFOService.java`

### 2. Hệ Thống Đấu Thầu & Báo Giá NCC
**Quy trình**:
```
1. Nhân viên tạo Phiếu Gọi Thầu
   - Chọn sản phẩm cần nhập
   - Đặt hạn chót báo giá
   
2. NCC submit báo giá qua Supplier Portal
   - Giá nhập đề xuất
   - HSD, số lô
   - Đề xuất sản phẩm mới (nếu có)
   
3. Nhân viên đánh giá & chọn NCC
   - So sánh giá
   - Kiểm tra % biến động giá
   - Chốt giá bán
   
4. Tạo Phiếu Nhập Kho
   - Chờ duyệt (QUAN_LY_KHO)
   - Nhập thực tế (ghi nhận lỗi)
   - Tự động cập nhật tồn kho
```

**Implementation**: `ProcurementService.java`, `ProcurementController.java`

### 3. Định Lượng Đặt Hàng (DSV Formula)
**Công thức**:
```
Q = (V × T) + SS - I

Trong đó:
- Q: Số lượng cần đặt
- V: Tốc độ bán trung bình (units/ngày)
- T: Thời gian giao hàng = 30 ngày
- SS: Safety Stock = V × 5 (dự trữ an toàn 5 ngày)
- I: Tồn kho hiện tại
```

**Ví dụ**:
```
V = 10 chai/ngày
T = 30 ngày
SS = 10 × 5 = 50 chai
I = 120 chai

Q = (10 × 30) + 50 - 120
Q = 300 + 50 - 120 = 230 chai
```

**Implementation**: `ProcurementService.tinhBienDoBan()`

### 4. Tích Hợp Thanh Toán PayOS
**Luồng thanh toán**:
```
1. Khách chọn "Thanh toán online"
2. Backend tạo payment link (PayOS API)
3. Redirect đến trang thanh toán PayOS
4. Khách thanh toán (QR/Card/Banking)
5. PayOS gửi webhook về backend
6. Backend verify signature & update trạng thái
7. Redirect về trang xác nhận
```

**Payment Methods**:
- COD (Tiền mặt khi nhận hàng)
- PayOS (QR, Card, Banking)

**Implementation**: `PaymentService.java`, `CheckoutService.java`

### 5. Hệ Thống Đổi Trả Hàng
**Quy trình**:
```
1. Khách tạo yêu cầu đổi trả
   - Chọn sản phẩm trong đơn
   - Số lượng đổi trả
   - Lý do & hình ảnh minh chứng
   
2. Nhân viên xem & xử lý
   - Duyệt: Hoàn tiền + nhập hàng lỗi
   - Từ chối: Ghi rõ lý do
   
3. Tự động cập nhật:
   - Số lượng hàng lỗi (+)
   - Biến động kho (NHAP_LOI)
```

**Implementation**: `DoiTraService.java`, `DoiTraController.java`

### 6. QR Code Tra Cứu Đơn Hàng
**Tính năng**:
- Mỗi đơn hàng có QR code duy nhất
- Scan QR → Xem trạng thái đơn real-time
- Không cần đăng nhập

**Implementation**: Frontend `qrcode` library

### 7. Email Automation
**Các email tự động**:
- Email xác thực đăng ký (verification token)
- Email xác nhận đơn hàng
- Email thông báo trạng thái đơn (đang giao, hoàn thành)

**Implementation**: `EmailService.java` + Spring Mail

### 8. Báo Cáo & Thống Kê
**Dashboard Admin**:
- Doanh thu theo ngày/tháng/năm
- Top sản phẩm bán chạy
- Tồn kho theo danh mục
- Số đơn hàng theo trạng thái
- Cảnh báo sản phẩm sắp hết hạn (< 30 ngày)

**Implementation**: `ReportService.java`, `DashboardController.java`

---

## 🔌 API ENDPOINTS

### Authentication (`/api/auth`)
```
POST   /api/auth/register          # Đăng ký tài khoản
POST   /api/auth/login             # Đăng nhập
GET    /api/auth/verify            # Xác thực email (token)
```

### Products (`/api/public/products`, `/api/admin/products`)
```
GET    /api/public/products                    # Danh sách SP (public)
GET    /api/public/products/{id}               # Chi tiết SP
GET    /api/public/products/search             # Tìm kiếm SP
GET    /api/admin/products                     # Quản lý SP (admin)
POST   /api/admin/products                     # Tạo SP mới
PUT    /api/admin/products/{id}                # Cập nhật SP
DELETE /api/admin/products/{id}                # Xóa SP
PUT    /api/admin/products/{id}/discount       # Giảm giá SP
```

### Orders (`/api/user/orders`, `/api/admin/orders`)
```
POST   /api/user/checkout                      # Tạo đơn hàng
GET    /api/user/orders                        # Đơn của tôi
GET    /api/user/orders/{id}                   # Chi tiết đơn
PUT    /api/user/orders/{id}/cancel            # Hủy đơn

GET    /api/admin/orders                       # Tất cả đơn (admin)
GET    /api/admin/orders/{id}                  # Chi tiết đơn (admin)
PUT    /api/admin/orders/{id}/confirm          # Xác nhận đơn (tạo pick list)
PUT    /api/admin/orders/{id}/ship             # Giao hàng (mã vận đơn)
PUT    /api/admin/orders/{id}/complete         # Hoàn thành
PUT    /api/admin/orders/{id}/cancel           # Hủy đơn (admin)
```

### Procurement (`/api/admin/procurement`)
```
GET    /api/admin/procurement/goi-thau              # Danh sách gọi thầu
POST   /api/admin/procurement/goi-thau              # Tạo gọi thầu
GET    /api/admin/procurement/goi-thau/{id}         # Chi tiết
PUT    /api/admin/procurement/goi-thau/{id}/close   # Đóng thầu

GET    /api/admin/procurement/bao-gia               # Danh sách báo giá
POST   /api/admin/procurement/bao-gia               # Submit báo giá (NCC)
PUT    /api/admin/procurement/bao-gia/{id}/approve  # Duyệt báo giá

GET    /api/admin/procurement/de-xuat-dsv           # Gợi ý DSV
```

### Warehouse (`/api/admin/kho`)
```
GET    /api/admin/kho/phieu-nhap                # Danh sách phiếu nhập
POST   /api/admin/kho/phieu-nhap                # Tạo phiếu nhập
GET    /api/admin/kho/phieu-nhap/{id}           # Chi tiết
PUT    /api/admin/kho/phieu-nhap/{id}/approve   # Duyệt phiếu
POST   /api/admin/kho/phieu-nhap/import         # Import Excel/CSV

GET    /api/admin/kho/bien-dong                 # Lịch sử biến động
GET    /api/admin/kho/ton-kho                   # Báo cáo tồn kho
GET    /api/admin/kho/near-expiry               # Cảnh báo HSD
```

### Returns (`/api/user/returns`, `/api/admin/returns`)
```
POST   /api/user/returns                        # Tạo yêu cầu đổi trả
GET    /api/user/returns                        # Đổi trả của tôi

GET    /api/admin/returns                       # Tất cả đổi trả
PUT    /api/admin/returns/{id}/approve          # Duyệt đổi trả
PUT    /api/admin/returns/{id}/reject           # Từ chối
```

### Categories & Brands (`/api/admin/categories`, `/api/admin/brands`)
```
GET    /api/public/categories               # Danh sách danh mục
POST   /api/admin/categories                # Tạo danh mục
PUT    /api/admin/categories/{id}           # Cập nhật
DELETE /api/admin/categories/{id}           # Xóa

GET    /api/public/brands                   # Danh sách thương hiệu
POST   /api/admin/brands                    # Tạo thương hiệu
```

### Campaigns (`/api/admin/campaigns`)
```
GET    /api/admin/campaigns                 # Danh sách sự kiện
POST   /api/admin/campaigns                 # Tạo sự kiện KM
PUT    /api/admin/campaigns/{id}            # Cập nhật
PUT    /api/admin/campaigns/{id}/toggle     # Bật/tắt
```

### Reports (`/api/admin/reports`)
```
GET    /api/admin/reports/revenue           # Báo cáo doanh thu
GET    /api/admin/reports/top-products      # SP bán chạy
GET    /api/admin/reports/inventory         # Báo cáo tồn kho
GET    /api/admin/reports/orders-status     # Đơn hàng theo trạng thái
```

### Payment (`/api/payment`)
```
POST   /api/payment/create-link             # Tạo link thanh toán PayOS
POST   /api/payment/webhook                 # Webhook callback PayOS
GET    /api/payment/status/{orderId}        # Kiểm tra trạng thái
```

---

## 📊 QUY TRÌNH NGHIỆP VỤ

### 1. Quy Trình Đặt Hàng (Customer Journey)
```
[KHÁCH HÀNG]
1. Browse sản phẩm / Tìm kiếm
2. Thêm vào giỏ hàng
3. Checkout (nhập địa chỉ, SĐT)
4. Chọn phương thức thanh toán
   ├─ COD: Tạo đơn → Chờ xác nhận
   └─ PayOS: Tạo payment link → Thanh toán → Webhook → Chờ xác nhận
5. Nhận email xác nhận đơn hàng
```

### 2. Quy Trình Xử Lý Đơn Hàng (Admin)
```
[NHÂN VIÊN]
1. Xem đơn mới (CHO_XAC_NHAN)
2. Xác nhận đơn
   ├─ Kiểm tra tồn kho
   ├─ FEFO: Tạo pick list (lô hàng sắp hết hạn)
   ├─ Trừ tồn kho
   ├─ Tạo biến động kho (XUAT)
   └─ Chuyển trạng thái: DA_XAC_NHAN
3. Đóng gói & giao vận chuyển
   ├─ Nhập mã vận đơn
   └─ Chuyển trạng thái: DANG_GIAO
4. Khách nhận hàng
   └─ Chuyển trạng thái: HOAN_THANH
   
[TRƯỜNG HỢP HỦY]
- Khách hủy (trước xác nhận): OK
- Admin hủy: Hoàn tồn kho + Tạo biến động NHAP
```

### 3. Quy Trình Nhập Hàng
```
[NHÂN VIÊN KHO]
1. Tạo Phiếu Gọi Thầu
   ├─ Chọn SP cần nhập (hoặc dùng gợi ý DSV)
   ├─ Số lượng yêu cầu
   └─ Hạn chót báo giá
   
2. Chờ NCC submit báo giá
   
3. Đánh giá & chọn NCC
   ├─ So sánh giá
   ├─ Kiểm tra % biến động
   └─ Chốt giá bán
   
4. Tạo Phiếu Nhập Kho
   ├─ Nhập thông tin: HSD, số lô, giá nhập
   └─ Trạng thái: CHO_DUYET
   
[QUẢN LÝ KHO]
5. Duyệt phiếu nhập
   ├─ Kiểm tra thông tin
   └─ Approve: CHO_NHAP_KHO
   
[NHÂN VIÊN KHO]
6. Nhập thực tế
   ├─ Số lượng thực nhận
   ├─ Số lượng lỗi (nếu có)
   ├─ Upload hình ảnh (optional)
   └─ Hoàn tất: DA_NHAP
   
7. Tự động cập nhật
   ├─ Tồn kho (+)
   ├─ Hàng lỗi (+)
   └─ Biến động kho (NHAP)
```

### 4. Quy Trình Đổi Trả Hàng
```
[KHÁCH HÀNG]
1. Vào "Đơn hàng của tôi"
2. Chọn đơn đã hoàn thành
3. Tạo yêu cầu đổi trả
   ├─ Chọn sản phẩm
   ├─ Số lượng đổi trả
   ├─ Lý do
   └─ Upload hình ảnh minh chứng
   
[NHÂN VIÊN]
4. Xem & xử lý
   ├─ Duyệt:
   │   ├─ Hoàn tiền khách (nếu đã thanh toán)
   │   ├─ Nhập hàng lỗi (+)
   │   ├─ Tạo biến động kho (NHAP_LOI)
   │   └─ Trạng thái: DA_DUYET
   │
   └─ Từ chối:
       ├─ Ghi rõ lý do
       └─ Trạng thái: TU_CHOI
       
5. Khách nhận thông báo (email/notification)
```

### 5. Trạng Thái Đơn Hàng (State Machine)
```
[CHO_XAC_NHAN]
    ↓ (Nhân viên xác nhận)
[DA_XAC_NHAN]
    ↓ (Nhập mã vận đơn)
[DANG_GIAO]
    ↓ (Giao thành công)
[HOAN_THANH]

[Có thể hủy từ bất kỳ trạng thái nào]
    ↓
[DA_HUY]
```

### 6. Trạng Thái Thanh Toán
```
- CHO_THANH_TOAN: COD chưa thanh toán
- DA_THANH_TOAN: Đã thanh toán (PayOS hoặc COD khi nhận)
- THAT_BAI: Thanh toán thất bại (PayOS timeout/cancel)
```

---

## 🔐 SECURITY & AUTHENTICATION

### JWT Token Flow
```
1. Login: POST /api/auth/login
   ├─ Username + Password
   └─ Response: JWT Token
   
2. Client lưu token (localStorage/sessionStorage)

3. Mỗi request kèm header:
   Authorization: Bearer <token>
   
4. Backend:
   ├─ JwtAuthenticationFilter intercept
   ├─ Validate token (signature, expiration)
   ├─ Extract username & roles
   └─ Set SecurityContext
```

### Password Security
- **BCrypt**: Hash mật khẩu (không lưu plain text)
- **Salt**: Tự động thêm salt
- **Strength**: 10 rounds

### Email Verification
```
1. Register → Tạo verification_token (UUID)
2. Gửi email với link:
   https://domain.com/verify?token=xxx
3. Click link → Backend verify token
4. Mark is_verified = true
```

---

## 📦 DEPLOYMENT

### Backend Deployment
```bash
# Build JAR file
mvn clean package

# Run
java -jar target/perfumeshop-0.0.1-SNAPSHOT.jar

# Config
application.properties:
- server.port=8080
- spring.datasource.url=jdbc:mysql://localhost:3306/perfumeshop
- jwt.secret=your-secret-key
- payos.client-id=xxx
- payos.api-key=xxx
- spring.mail.host=smtp.gmail.com
```

### Frontend Deployment
```bash
# Build production
npm run build

# Deploy folder: build/
# Serve với Nginx/Apache/Vercel/Netlify

# Environment variables (.env.production)
REACT_APP_API_URL=https://api.yourdomainame.com
```

### Database Setup
```sql
-- Tạo database
CREATE DATABASE perfumeshop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Hibernate auto-create tables (dev)
spring.jpa.hibernate.ddl-auto=update

-- Production: export schema sau khi dev xong
spring.jpa.hibernate.ddl-auto=validate
```

---

## 📈 PERFORMANCE & OPTIMIZATION

### Backend Optimization
- **Lazy Loading**: Hibernate lazy fetch cho relationships
- **DTO Pattern**: Tránh serialize toàn bộ entity
- **Indexing**: Index trên FK columns
- **Connection Pool**: HikariCP (Spring Boot default)
- **Caching**: (Có thể implement Spring Cache)

### Frontend Optimization
- **Code Splitting**: React lazy loading
- **Custom Hooks**: Reuse logic, reduce re-renders
- **TailwindCSS**: Purge unused CSS
- **Image Optimization**: Lazy load images

---

## 🎯 DANH SÁCH CHỨC NĂNG

### Khách Hàng
- ✅ Đăng ký, đăng nhập (JWT)
- ✅ Xác thực email
- ✅ Duyệt sản phẩm theo danh mục, thương hiệu
- ✅ Tìm kiếm sản phẩm
- ✅ Xem chi tiết sản phẩm
- ✅ Thêm vào giỏ hàng
- ✅ Đặt hàng (COD, PayOS)
- ✅ Xem đơn hàng của tôi
- ✅ Tra cứu đơn hàng (QR code)
- ✅ Hủy đơn hàng (trước xác nhận)
- ✅ Tạo yêu cầu đổi trả
- ✅ Đánh giá sản phẩm (rating + review)
- ✅ Quản lý thông tin cá nhân

### Nhân Viên
- ✅ Xem danh sách đơn hàng
- ✅ Xác nhận đơn hàng (FEFO pick list)
- ✅ Cập nhật trạng thái đơn (giao hàng, hoàn thành)
- ✅ Hủy đơn hàng (với lý do)
- ✅ Quản lý sản phẩm (CRUD)
- ✅ Quản lý danh mục, thương hiệu
- ✅ Tạo phiếu gọi thầu
- ✅ Đánh giá báo giá NCC
- ✅ Tạo phiếu nhập kho
- ✅ Xử lý đổi trả (duyệt/từ chối)
- ✅ Xem báo cáo thống kê

### Quản Lý Kho
- ✅ Duyệt phiếu nhập kho
- ✅ Nhập kho thực tế (ghi nhận lỗi)
- ✅ Import Excel/CSV (bulk import)
- ✅ Xem lịch sử biến động kho
- ✅ Báo cáo tồn kho
- ✅ Cảnh báo HSD sắp hết (< 30 ngày)
- ✅ Quản lý hàng lỗi

### Quản Lý (Admin)
- ✅ Toàn quyền truy cập
- ✅ Quản lý nhân viên (CRUD, phân quyền)
- ✅ Quản lý khách hàng
- ✅ Tạo sự kiện khuyến mãi
- ✅ Báo cáo doanh thu
- ✅ Dashboard tổng quan
- ✅ Xem login logs

### Nhà Cung Cấp
- ✅ Xem phiếu gọi thầu công khai
- ✅ Submit báo giá
- ✅ Đề xuất sản phẩm mới
- ✅ Không cần đăng nhập (public portal)

---

## 🚀 TÍNH NĂNG ĐẶC BIỆT

### 1. FEFO Automation
Tự động chọn lô hàng sắp hết hạn khi xuất kho, giảm thiểu hàng hết hạn.

### 2. DSV Formula
Tính toán khoa học số lượng cần đặt hàng dựa trên:
- Tốc độ bán
- Lead time
- Safety stock
- Tồn kho hiện tại

### 3. Traceability
Mỗi chi tiết đơn hàng được liên kết với phiếu nhập kho cụ thể (HSD, số lô).

### 4. Audit Trail
Mọi biến động kho đều được ghi nhận:
- NHAP: Nhập kho từ NCC
- XUAT: Xuất kho bán hàng
- NHAP_LOI: Nhập hàng lỗi (đổi trả)
- DIEU_CHINH: Điều chỉnh tồn kho

### 5. Multi-Discount Support
- Giảm giá sản phẩm (theo %)
- Giảm giá theo sự kiện (campaign)
- Áp dụng đồng thời (multiply)

### 6. Real-time Stock Update
Tồn kho được cập nhật real-time:
- Khi xác nhận đơn: Trừ tồn
- Khi hủy đơn: Cộng tồn
- Khi nhập kho: Cộng tồn
- Khi duyệt đổi trả: Cộng hàng lỗi

---

## 🎨 UI/UX FEATURES

### Public Website
- Modern, responsive design (Tailwind CSS)
- Product grid with filters
- Product detail with image gallery
- Shopping cart with quantity controls
- Smooth checkout flow
- Order tracking with QR code

### Admin Dashboard
- Sidebar navigation
- Data tables with pagination
- Filters & search
- Modal dialogs for actions
- Status badges
- Charts & statistics (coming soon)

---

## 🛠️ DEVELOPMENT SETUP

### Prerequisites
```bash
# Backend
- Java 17
- Maven 3.8+
- MySQL 8.0+

# Frontend
- Node.js 18+
- npm 9+
```

### Backend Setup
```bash
cd perfumeshop-backend/perfumeshop-backend

# Configure database
# Edit src/main/resources/application.properties

# Install dependencies
mvn clean install

# Run
mvn spring-boot:run
# hoặc
./mvnw spring-boot:run (Windows: mvnw.cmd)
```

### Frontend Setup
```bash
cd perfumeshop-frontend-s

# Install dependencies
npm install

# Configure API URL
# Edit .env file
REACT_APP_API_URL=http://localhost:8080

# Run development server
npm start
# Truy cập: http://localhost:3000
```

### Database Initialization
```sql
-- Tạo database
CREATE DATABASE perfumeshop 
CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

-- Tables sẽ tự động được tạo bởi Hibernate
-- (spring.jpa.hibernate.ddl-auto=update)

-- Seed data (optional)
-- Thêm dữ liệu mẫu: danh mục, thương hiệu, sản phẩm, nhân viên
```

---

## 📝 CODING CONVENTIONS

### Backend (Java)
- **Naming**: camelCase cho methods/variables, PascalCase cho classes
- **Package structure**: feature-based (controller, service, repository per feature)
- **DTO Pattern**: Tách entity và response/request objects
- **Exception Handling**: Global exception handler với @ControllerAdvice
- **Validation**: Bean Validation annotations (@NotNull, @Size, etc.)
- **Lombok**: Sử dụng @Data, @Builder để giảm boilerplate

### Frontend (React)
- **Naming**: camelCase cho functions/variables, PascalCase cho components
- **File structure**: Feature-based trong pages/, reusable trong components/
- **Hooks**: Custom hooks cho logic reuse
- **API calls**: Centralized trong services/api/
- **Styling**: Tailwind utility classes, avoid inline styles
- **Props**: Destructure props in component parameters

---

## 🐛 COMMON ISSUES & SOLUTIONS

### Issue 1: CORS Error
**Problem**: Frontend không gọi được API backend
**Solution**: 
```java
// SecurityConfig.java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setAllowCredentials(true);
    // ...
}
```

### Issue 2: JWT Token Invalid
**Problem**: Token không được nhận diện
**Solution**: Kiểm tra:
- Header format: `Authorization: Bearer <token>`
- Token chưa hết hạn
- Secret key khớp giữa generate và validate

### Issue 3: Hibernate LazyInitializationException
**Problem**: Truy cập lazy-loaded entity ngoài session
**Solution**:
- Dùng DTO thay vì trả entity trực tiếp
- Hoặc: `@Transactional` trên service method
- Hoặc: `@EntityGraph` để eager fetch

### Issue 4: PayOS Webhook Not Working
**Problem**: Không nhận được callback từ PayOS
**Solution**:
- Check webhook URL accessible (public domain, không localhost)
- Verify signature đúng
- Log để debug webhook payload

---

## 📚 TÀI LIỆU THAM KHẢO

### Official Documentation
- Spring Boot: https://spring.io/projects/spring-boot
- React: https://react.dev/
- Tailwind CSS: https://tailwindcss.com/
- PayOS: https://payos.vn/docs/

### Key Libraries
- Lombok: https://projectlombok.org/
- JWT (jjwt): https://github.com/jwtk/jjwt
- Apache POI: https://poi.apache.org/
- React Router: https://reactrouter.com/

---

## 📊 THỐNG KÊ DỰ ÁN

### Backend Code Statistics
- **Total Files**: ~116 Java files
- **Controllers**: 21 files
- **Services**: 23 files
- **Repositories**: 18 files
- **Entities**: 20 files
- **DTOs**: 25 files
- **Security**: 4 files
- **Config**: 2 files

### Frontend Code Statistics
- **Components**: Multiple reusable components
- **Pages**: ~30+ pages (admin + public)
- **Custom Hooks**: ~10+ hooks
- **API Services**: ~10+ service modules

### Database
- **Tables**: 19 tables
- **Relationships**: 28+ foreign keys
- **Indexes**: Auto-generated on FKs

---

## 🎓 KẾT LUẬN

Hệ thống Perfume Shop là một ứng dụng web full-stack hoàn chỉnh với:

### ✅ Điểm Mạnh
1. **Kiến trúc rõ ràng**: Tách biệt frontend-backend, REST API chuẩn
2. **Nghiệp vụ phức tạp**: Đấu thầu NCC, FEFO, DSV formula
3. **Security**: JWT authentication, role-based access control
4. **Automation**: FEFO tự động, email automation, stock update real-time
5. **Traceability**: Audit trail cho mọi biến động kho
6. **Payment Integration**: Tích hợp cổng thanh toán PayOS
7. **UX/UI**: Modern, responsive với Tailwind CSS

### 🔧 Công Nghệ Sử Dụng
- **Backend**: Spring Boot 3.2.5 + Spring Security + JPA/Hibernate
- **Frontend**: React 19.2 + React Router + Tailwind CSS
- **Database**: MySQL 8.0
- **Authentication**: JWT (JSON Web Token)
- **Payment**: PayOS Gateway
- **Email**: Spring Mail (SMTP)
- **File Processing**: Apache POI (Excel) + Commons CSV

### 🎯 Đáp Ứng Mục Tiêu
- ✅ Quản lý sản phẩm và danh mục
- ✅ Hỗ trợ khách hàng đặt hàng online
- ✅ Quản lý đơn hàng với nhiều trạng thái
- ✅ Hệ thống nhập kho và đấu thầu NCC
- ✅ FEFO để giảm thiểu hàng hết hạn
- ✅ Định lượng đặt hàng khoa học (DSV)
- ✅ Quản lý đổi trả hàng
- ✅ Thanh toán online tích hợp
- ✅ Báo cáo thống kê & dashboard
- ✅ Email automation
- ✅ QR code tra cứu đơn hàng

### 🚀 Hướng Phát Triển Tiếp Theo
1. **Real-time Notifications**: WebSocket cho thông báo real-time
2. **Advanced Analytics**: Biểu đồ, dashboard phức tạp hơn
3. **Mobile App**: React Native cho iOS/Android
4. **AI Recommendations**: Gợi ý sản phẩm dựa trên lịch sử
5. **Inventory Forecasting**: Dự báo nhu cầu bằng ML
6. **Multi-warehouse**: Hỗ trợ nhiều kho hàng
7. **Customer Loyalty Program**: Điểm thưởng, membership
8. **Advanced Search**: Elasticsearch cho tìm kiếm nâng cao
9. **Order Tracking**: Real-time tracking với API vận chuyển
10. **Chatbot**: Customer support automation

---

## 📞 THÔNG TIN LIÊN HỆ

**Dự án**: Hệ Thống Quản Lý Cửa Hàng Nước Hoa (Perfume Shop)  
**Sinh viên**: [Tên sinh viên]  
**MSSV**: [Mã số sinh viên]  
**Lớp**: [Tên lớp]  
**Giảng viên hướng dẫn**: [Tên giảng viên]

---

*Tài liệu này được tạo tự động để phục vụ cho việc trình bày và báo cáo luận văn tốt nghiệp.*

**Ngày cập nhật**: 2026-08-09  
**Phiên bản**: 1.0
