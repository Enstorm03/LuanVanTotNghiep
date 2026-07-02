# Thiết Kế Phân Quyền Hệ Thống (RBAC - Role-Based Access Control)

## Tổng Quan
Dựa trên phân tích hệ thống Perfume Shop hiện tại, đây là đề xuất phân quyền cho 6 vai trò chính:
1. **ADMIN** - Quản trị viên hệ thống
2. **STORE_MANAGER** - Cửa hàng trưởng
3. **WAREHOUSE_STAFF** - Nhân viên kho
4. **SALES_STAFF** - Nhân viên bán hàng
5. **SUPPLIER** - Nhà cung cấp
6. **CUSTOMER** - Khách hàng

---

## 1. Cấu Trúc Role Hierarchy

```
ADMIN (Quyền cao nhất)
  ├── STORE_MANAGER (Quản lý toàn bộ cửa hàng)
  │     ├── WAREHOUSE_STAFF (Chuyên về kho)
  │     └── SALES_STAFF (Chuyên về bán hàng)
  │
  ├── SUPPLIER (Bên ngoài - cung cấp sản phẩm)
  │
  └── CUSTOMER (Người dùng cuối)
```

---

## 2. Ma Trận Phân Quyền Chi Tiết

### 2.1. ADMIN - Quản Trị Viên

**Quyền truy cập**: Toàn quyền hệ thống

#### Quản Lý Người Dùng
- ✅ Tạo/Sửa/Xóa tất cả tài khoản (Admin, Store Manager, Staff, Supplier)
- ✅ Phân quyền và thay đổi vai trò người dùng
- ✅ Kích hoạt/Vô hiệu hóa tài khoản
- ✅ Xem lịch sử hoạt động của tất cả người dùng
- ✅ Reset mật khẩu cho bất kỳ tài khoản nào

#### Quản Lý Sản Phẩm
- ✅ CRUD sản phẩm (Create, Read, Update, Delete)
- ✅ Quản lý danh mục sản phẩm
- ✅ Thiết lập giá, khuyến mãi đặc biệt
- ✅ Duyệt sản phẩm đề xuất từ nhà cung cấp
- ✅ Xem và phân tích Sales Velocity

#### Quản Lý Kho
- ✅ Toàn quyền quản lý phiếu nhập kho
- ✅ Xem tồn kho theo thời gian thực
- ✅ Cảnh báo hàng sắp hết hạn
- ✅ Điều chỉnh tồn kho (inventory adjustment)
- ✅ Xuất/Nhập file CSV quản lý kho

#### Quản Lý Đơn Hàng
- ✅ Xem tất cả đơn hàng
- ✅ Cập nhật trạng thái đơn hàng
- ✅ Hủy đơn hàng
- ✅ Xử lý hoàn tiền
- ✅ Xem pick list và FEFO allocation

#### Quản Lý Procurement (Đấu thầu)
- ✅ Tạo/Sửa/Xóa phiếu gọi thầu
- ✅ Duyệt/Từ chối đề xuất từ nhà cung cấp
- ✅ Quyết định trúng thầu
- ✅ Quản lý hợp đồng với nhà cung cấp

#### Báo Cáo & Phân Tích
- ✅ Xem tất cả báo cáo (doanh thu, tồn kho, profit margin)
- ✅ Dashboard toàn hệ thống
- ✅ Xuất báo cáo Excel/PDF
- ✅ Phân tích xu hướng và insights

#### Chiến Dịch Marketing
- ✅ Tạo/Sửa/Xóa sự kiện, khuyến mãi
- ✅ Thiết lập voucher và discount codes
- ✅ Gửi email marketing hàng loạt

#### Cấu Hình Hệ Thống
- ✅ Cài đặt chung (shipping, payment gateway)
- ✅ Quản lý email template
- ✅ Cấu hình bảo mật
- ✅ Audit logs

---

### 2.2. STORE_MANAGER - Cửa Hàng Trưởng

**Quyền truy cập**: Quản lý vận hành cửa hàng (không có quyền hệ thống)

#### Quản Lý Nhân Viên (Giới hạn)
- ✅ Xem danh sách nhân viên kho và bán hàng
- ✅ Phân công công việc cho nhân viên
- ⚠️ Đề xuất thêm/xóa nhân viên (cần Admin duyệt)
- ✅ Xem hiệu suất làm việc của nhân viên
- ❌ Không thể thay đổi vai trò nhân viên

#### Quản Lý Sản Phẩm
- ✅ Xem tất cả sản phẩm
- ✅ Đề xuất sản phẩm mới (cần Admin duyệt)
- ✅ Cập nhật thông tin sản phẩm (giá, mô tả)
- ⚠️ Thay đổi giá lớn cần Admin duyệt
- ❌ Không thể xóa sản phẩm

#### Quản Lý Kho
- ✅ Giám sát tồn kho
- ✅ Tạo phiếu yêu cầu nhập kho
- ✅ Duyệt phiếu nhập kho do warehouse staff tạo
- ✅ Xem cảnh báo hàng sắp hết hạn
- ✅ Điều phối FEFO allocation

#### Quản Lý Đơn Hàng
- ✅ Xem tất cả đơn hàng của cửa hàng
- ✅ Cập nhật trạng thái đơn hàng
- ✅ Xử lý đơn hàng có vấn đề
- ⚠️ Hủy đơn hàng có giá trị cao cần Admin phê duyệt
- ✅ Xem pick list

#### Quản Lý Procurement
- ✅ Tạo phiếu gọi thầu
- ✅ Xem đề xuất từ nhà cung cấp
- ⚠️ Đề xuất trúng thầu (cần Admin phê duyệt cuối)
- ✅ Liên hệ và đàm phán với supplier

#### Báo Cáo
- ✅ Dashboard cửa hàng
- ✅ Báo cáo doanh thu theo ngày/tuần/tháng
- ✅ Báo cáo tồn kho
- ✅ Báo cáo hiệu suất nhân viên
- ❌ Không xem được profit margin chi tiết

#### Chiến Dịch Marketing
- ✅ Đề xuất sự kiện/khuyến mãi
- ⚠️ Cần Admin duyệt trước khi kích hoạt
- ✅ Xem hiệu quả chiến dịch

---

### 2.3. WAREHOUSE_STAFF - Nhân Viên Kho

**Quyền truy cập**: Chuyên về quản lý kho và hàng hóa

#### Quản Lý Kho
- ✅ Tạo phiếu nhập kho (cần Store Manager duyệt)
- ✅ Cập nhật số lượng tồn kho
- ✅ Quét mã barcode/QR khi nhập hàng
- ✅ Ghi nhận hạn sử dụng (expiry date)
- ✅ Thực hiện kiểm kê kho
- ✅ Đánh dấu hàng hết hạn/hỏng
- ❌ Không thể điều chỉnh tồn kho tùy ý (cần phê duyệt)

#### Quản Lý Đơn Hàng (Khía cạnh kho)
- ✅ Xem pick list của đơn hàng
- ✅ Xác nhận lấy hàng theo FEFO
- ✅ Đóng gói đơn hàng
- ✅ Cập nhật trạng thái "đã chuẩn bị hàng"
- ❌ Không thể thay đổi thông tin đơn hàng

#### Sản Phẩm
- ✅ Xem danh sách sản phẩm và SKU
- ✅ Xem vị trí lưu kho của sản phẩm
- ❌ Không thể sửa thông tin sản phẩm

#### Báo Cáo
- ✅ Xem báo cáo tồn kho
- ✅ Xem cảnh báo hàng sắp hết hạn
- ✅ Báo cáo hàng nhập trong ngày/tuần
- ❌ Không xem báo cáo doanh thu

---

### 2.4. SALES_STAFF - Nhân Viên Bán Hàng

**Quyền truy cập**: Chuyên về bán hàng và chăm sóc khách hàng

#### Quản Lý Khách Hàng
- ✅ Xem thông tin khách hàng
- ✅ Tạo tài khoản khách hàng mới
- ✅ Cập nhật thông tin liên hệ khách hàng
- ✅ Xem lịch sử mua hàng của khách
- ❌ Không thể xóa tài khoản khách hàng

#### Quản Lý Đơn Hàng
- ✅ Tạo đơn hàng cho khách (offline/online)
- ✅ Xem đơn hàng do mình tạo hoặc được phân công
- ✅ Cập nhật thông tin giao hàng
- ✅ Xác nhận thanh toán
- ⚠️ Hủy đơn hàng cần Store Manager duyệt
- ❌ Không thể xem tất cả đơn hàng

#### Sản Phẩm
- ✅ Xem tất cả sản phẩm và giá
- ✅ Kiểm tra tồn kho có sẵn
- ✅ Xem khuyến mãi đang áp dụng
- ❌ Không thể sửa giá hoặc thông tin sản phẩm

#### Chiến Dịch Marketing
- ✅ Xem các chương trình khuyến mãi
- ✅ Áp dụng voucher/discount cho khách
- ✅ Đề xuất ý tưởng khuyến mãi
- ❌ Không thể tạo voucher

#### Báo Cáo
- ✅ Xem doanh số cá nhân
- ✅ Xem mục tiêu bán hàng
- ✅ Báo cáo khách hàng thân thiết
- ❌ Không xem được doanh thu toàn cửa hàng

---

### 2.5. SUPPLIER - Nhà Cung Cấp

**Quyền truy cập**: Portal riêng biệt cho nhà cung cấp

#### Quản Lý Sản Phẩm Đề Xuất
- ✅ Đề xuất sản phẩm mới qua Supplier Portal
- ✅ Cập nhật thông tin sản phẩm đề xuất
- ✅ Upload hình ảnh, chứng nhận sản phẩm
- ✅ Xem trạng thái duyệt sản phẩm
- ❌ Không thể trực tiếp thêm sản phẩm vào hệ thống

#### Quản Lý Procurement
- ✅ Xem phiếu gọi thầu công khai
- ✅ Gửi đề xuất giá và điều kiện
- ✅ Tải lên tài liệu đấu thầu
- ✅ Xem kết quả trúng thầu
- ✅ Xác nhận hợp đồng
- ❌ Không thể xem đề xuất của supplier khác

#### Quản Lý Đơn Hàng Nhập
- ✅ Xem đơn hàng nhập từ hệ thống (khi trúng thầu)
- ✅ Xác nhận giao hàng
- ✅ Upload hóa đơn và chứng từ
- ✅ Theo dõi thanh toán
- ❌ Không thể xem đơn hàng bán ra

#### Thông Tin Cá Nhân
- ✅ Cập nhật thông tin công ty
- ✅ Thêm/sửa người liên hệ
- ✅ Cập nhật chứng chỉ, giấy phép kinh doanh
- ✅ Xem lịch sử giao dịch với cửa hàng

#### Báo Cáo
- ✅ Xem báo cáo đơn hàng của mình
- ✅ Thống kê sản phẩm được mua nhiều
- ❌ Không xem báo cáo kinh doanh của cửa hàng

---

### 2.6. CUSTOMER - Khách Hàng

**Quyền truy cập**: Mua hàng và quản lý tài khoản cá nhân

#### Tài Khoản Cá Nhân
- ✅ Đăng ký tài khoản
- ✅ Xác thực email
- ✅ Cập nhật thông tin cá nhân (tên, SĐT, địa chỉ)
- ✅ Đổi mật khẩu
- ✅ Quản lý địa chỉ giao hàng

#### Mua Sắm
- ✅ Xem tất cả sản phẩm
- ✅ Tìm kiếm và lọc sản phẩm
- ✅ Xem chi tiết sản phẩm
- ✅ Thêm vào giỏ hàng
- ✅ Thanh toán (online/COD)
- ✅ Áp dụng voucher/mã giảm giá

#### Quản Lý Đơn Hàng
- ✅ Xem lịch sử đơn hàng của mình
- ✅ Theo dõi trạng thái đơn hàng
- ✅ Hủy đơn hàng (trong thời gian cho phép)
- ✅ Đánh giá sản phẩm đã mua
- ✅ Yêu cầu hoàn tiền
- ❌ Không thể xem đơn hàng của người khác

#### Khuyến Mãi
- ✅ Xem các chương trình khuyến mãi
- ✅ Nhận voucher
- ✅ Tham gia sự kiện

#### Liên Hệ
- ✅ Gửi yêu cầu hỗ trợ
- ✅ Chat với bộ phận CSKH
- ✅ Đánh giá và phản hồi

---

## 3. API Endpoints và Phân Quyền

### 3.1. Authentication & User Management

| Endpoint | ADMIN | STORE_MGR | WAREHOUSE | SALES | SUPPLIER | CUSTOMER |
|----------|-------|-----------|-----------|-------|----------|----------|
| POST /api/auth/register | ✅ | ❌ | ❌ | ❌ | ✅* | ✅ |
| POST /api/auth/login | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| POST /api/auth/verify-email | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| GET /api/users | ✅ | ✅** | ❌ | ❌ | ❌ | ❌ |
| POST /api/users | ✅ | ⚠️*** | ❌ | ❌ | ❌ | ❌ |
| PUT /api/users/{id} | ✅ | ⚠️ | ❌ | ❌ | ❌ | Own only |
| DELETE /api/users/{id} | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

*Supplier register qua portal riêng  
**Store Manager chỉ xem staff của mình  
***Đề xuất, cần Admin duyệt

### 3.2. Product Management

| Endpoint | ADMIN | STORE_MGR | WAREHOUSE | SALES | SUPPLIER | CUSTOMER |
|----------|-------|-----------|-----------|-------|----------|----------|
| GET /api/products | ✅ | ✅ | ✅ | ✅ | Read only | ✅ |
| POST /api/products | ✅ | ⚠️ | ❌ | ❌ | ❌ | ❌ |
| PUT /api/products/{id} | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| DELETE /api/products/{id} | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| GET /api/products/near-expiry | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| GET /api/categories | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| POST /api/categories | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |

### 3.3. Warehouse Management

| Endpoint | ADMIN | STORE_MGR | WAREHOUSE | SALES | SUPPLIER | CUSTOMER |
|----------|-------|-----------|-----------|-------|----------|----------|
| GET /api/warehouse/inventory | ✅ | ✅ | ✅ | Read only | ❌ | ❌ |
| POST /api/warehouse/phieu-nhap | ✅ | ✅ | ✅* | ❌ | ❌ | ❌ |
| PUT /api/warehouse/phieu-nhap/{id} | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| POST /api/warehouse/import-csv | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| GET /api/warehouse/near-expiry | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| POST /api/warehouse/adjust | ✅ | ⚠️** | ❌ | ❌ | ❌ | ❌ |

*Warehouse tạo, cần Store Manager approve  
**Store Manager adjust cần Admin approve nếu > ngưỡng

### 3.4. Order Management

| Endpoint | ADMIN | STORE_MGR | WAREHOUSE | SALES | SUPPLIER | CUSTOMER |
|----------|-------|-----------|-----------|-------|----------|----------|
| GET /api/orders | ✅ | ✅ | Own tasks | Own only | ❌ | Own only |
| POST /api/orders | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ |
| GET /api/orders/{id} | ✅ | ✅ | ✅*** | ✅*** | ❌ | Own only |
| PUT /api/orders/{id}/status | ✅ | ✅ | ✅**** | ✅***** | ❌ | Cancel only |
| GET /api/orders/{id}/picklist | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| DELETE /api/orders/{id} | ✅ | ⚠️ | ❌ | ❌ | ❌ | Cancel only |

***Chỉ xem pick list  
****Chỉ update "đã chuẩn bị hàng"  
*****Chỉ update các trạng thái bán hàng

### 3.5. Procurement Management

| Endpoint | ADMIN | STORE_MGR | WAREHOUSE | SALES | SUPPLIER | CUSTOMER |
|----------|-------|-----------|-----------|-------|----------|----------|
| GET /api/procurement/phieu-goi-thau | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ |
| POST /api/procurement/phieu-goi-thau | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| PUT /api/procurement/phieu-goi-thau/{id} | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| POST /api/procurement/de-xuat | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| PUT /api/procurement/de-xuat/{id}/approve | ✅ | ⚠️* | ❌ | ❌ | ❌ | ❌ |
| GET /api/supplier/products/proposed | ❌ | ❌ | ❌ | ❌ | Own only | ❌ |

*Store Manager đề xuất, Admin phê duyệt cuối

### 3.6. Campaign & Marketing

| Endpoint | ADMIN | STORE_MGR | WAREHOUSE | SALES | SUPPLIER | CUSTOMER |
|----------|-------|-----------|-----------|-------|----------|----------|
| GET /api/campaigns | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ |
| POST /api/campaigns | ✅ | ⚠️ | ❌ | ❌ | ❌ | ❌ |
| PUT /api/campaigns/{id} | ✅ | ⚠️ | ❌ | ❌ | ❌ | ❌ |
| DELETE /api/campaigns/{id} | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| POST /api/vouchers | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| POST /api/vouchers/apply | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ |

### 3.7. Reports & Analytics

| Endpoint | ADMIN | STORE_MGR | WAREHOUSE | SALES | SUPPLIER | CUSTOMER |
|----------|-------|-----------|-----------|-------|----------|----------|
| GET /api/reports/revenue | ✅ | ✅* | ❌ | Own only | ❌ | ❌ |
| GET /api/reports/inventory | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| GET /api/reports/profit-margin | ✅ | ❌** | ❌ | ❌ | ❌ | ❌ |
| GET /api/reports/sales-velocity | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |
| GET /api/dashboard | ✅ | ✅*** | ❌ | Own perf | Own stats | ❌ |

*Store Manager xem revenue không có profit margin chi tiết  
**Thông tin nhạy cảm chỉ Admin  
***Dashboard giới hạn theo role

---

## 4. Implementation Guide

### 4.1. Database Schema Changes

```sql
-- Bảng Vai Trò (Roles)
CREATE TABLE Roles (
    id_role INT PRIMARY KEY AUTO_INCREMENT,
    ten_role VARCHAR(50) NOT NULL UNIQUE,
    mo_ta TEXT,
    muc_do_quyen INT DEFAULT 0, -- Hierarchy level: 0=Customer, 1=Supplier, 2=Sales/Warehouse, 3=Store Manager, 4=Admin
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Quyền (Permissions)
CREATE TABLE Permissions (
    id_permission INT PRIMARY KEY AUTO_INCREMENT,
    ten_permission VARCHAR(100) NOT NULL UNIQUE,
    mo_ta TEXT,
    resource VARCHAR(50), -- Ví dụ: 'product', 'order', 'user'
    action VARCHAR(20), -- Ví dụ: 'create', 'read', 'update', 'delete'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bảng Phân Quyền Vai Trò (Role_Permissions)
CREATE TABLE Role_Permissions (
    id_role INT,
    id_permission INT,
    PRIMARY KEY (id_role, id_permission),
    FOREIGN KEY (id_role) REFERENCES Roles(id_role),
    FOREIGN KEY (id_permission) REFERENCES Permissions(id_permission)
);

-- Cập nhật bảng Nguoi_Dung
ALTER TABLE Nguoi_Dung ADD COLUMN id_role INT;
ALTER TABLE Nguoi_Dung ADD FOREIGN KEY (id_role) REFERENCES Roles(id_role);
ALTER TABLE Nguoi_Dung ADD COLUMN trang_thai ENUM('active', 'inactive', 'suspended') DEFAULT 'active';

-- Bảng Audit Log
CREATE TABLE Audit_Logs (
    id_log BIGINT PRIMARY KEY AUTO_INCREMENT,
    id_nguoi_dung INT,
    action VARCHAR(100),
    resource VARCHAR(50),
    resource_id INT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_nguoi_dung) REFERENCES Nguoi_Dung(id_nguoi_dung)
);
```

### 4.2. Spring Security Configuration

```java
package com.example.perfumeshop.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable()
            .authorizeHttpRequests(auth -> auth
                // Public endpoints
                .requestMatchers("/api/auth/**", "/api/products/public/**").permitAll()
                
                // Admin only
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/users/create", "/api/users/delete/**").hasRole("ADMIN")
                .requestMatchers("/api/reports/profit-margin").hasRole("ADMIN")
                
                // Admin + Store Manager
                .requestMatchers("/api/procurement/**").hasAnyRole("ADMIN", "STORE_MANAGER")
                .requestMatchers("/api/reports/revenue").hasAnyRole("ADMIN", "STORE_MANAGER")
                
                // Warehouse staff
                .requestMatchers("/api/warehouse/**").hasAnyRole("ADMIN", "STORE_MANAGER", "WAREHOUSE_STAFF")
                
                // Sales staff
                .requestMatchers("/api/orders/create").hasAnyRole("ADMIN", "STORE_MANAGER", "SALES_STAFF", "CUSTOMER")
                
                // Supplier
                .requestMatchers("/api/supplier/**").hasRole("SUPPLIER")
                
                // Authenticated users
                .anyRequest().authenticated()
            )
            .sessionManagement()
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS);
            
        return http.build();
    }
}
```

### 4.3. Role-Based Access in Controllers

```java
@RestController
@RequestMapping("/api/orders")
public class DonHangController {

    @PreAuthorize("hasAnyRole('ADMIN', 'STORE_MANAGER', 'SALES_STAFF', 'CUSTOMER')")
    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody PlaceOrderRequest request) {
        // Logic tạo đơn hàng
    }