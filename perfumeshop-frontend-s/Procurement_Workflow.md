# Tài Liệu Nghiệp Vụ: Quy Trình Đấu Thầu & Yêu Cầu Thu Mua (Procurement)

## 1. Mô tả Tổng quan
Quy trình này áp dụng mô hình **Đấu thầu cạnh tranh (Competitive Bidding)** nhằm tối ưu hóa chi phí nhập hàng. Thay vì chờ đợi Nhà cung cấp (NCC) gửi báo giá một cách thụ động, hệ thống cho phép **Admin chủ động đăng thông báo mời thầu** công khai đối với các mặt hàng sắp hết.

Các NCC sẽ dựa vào thông báo này để gửi báo giá cạnh tranh. Admin tiến hành so sánh, chọn ra NCC có giá tốt nhất, đồng thời **thiết lập % biên độ lợi nhuận** để hệ thống tự động tính toán giá bán ra. Sau khi chốt thầu, hệ thống sẽ tự động chuyển đổi thành Đơn đặt hàng (Purchase Order - PO) để nhập kho.

---

## 2. Luồng Nghiệp Vụ Chi Tiết (4 Giai Đoạn)

### Giai đoạn 1: Admin tạo Yêu cầu Thu mua (Procurement Request)
1. **Giao diện:** Admin truy cập màn hình Quản lý Sản phẩm.
2. **Thao tác:** Bấm nút **"Đăng yêu cầu nhập hàng"**.
3. **Hiển thị Modal:** Hệ thống tự động lọc và hiển thị danh sách các sản phẩm đang có số lượng tồn kho ở mức cảnh báo (VD: Tồn kho < 5).
4. **Nhập liệu:** Admin tick chọn các mặt hàng cần nhập đợt này, điền số lượng cần nhập cho mỗi loại và chọn ngày hạn chót (Deadline).
5. **Xử lý Backend:**
   * Hệ thống tạo 1 bản ghi phiếu yêu cầu trong bảng `procurement_requests` với trạng thái `OPEN`.
   * Tạo các bản ghi chi tiết từng sản phẩm cần nhập vào bảng `procurement_request_items`.

### Giai đoạn 2: Nhà cung cấp xem và Chào giá (Phía Public / Supplier)
1. **Giao diện:** NCC truy cập vào cổng thông tin đối tác (`/procurement`).
2. **Hiển thị:** Trình duyệt gọi API lấy danh sách toàn bộ các Yêu cầu thu mua đang có trạng thái `OPEN`.
3. **Thao tác:** NCC mở xem chi tiết phiếu yêu cầu, điền mức **Giá nhập** đề xuất cho từng sản phẩm, thêm ghi chú (nếu có) và bấm **"Chào giá"**.
4. **Xử lý Backend:**
   * Lưu thông tin chào giá của NCC vào bảng `supplier_offers` với trạng thái ban đầu là `PENDING`.
   * Báo giá này được gắn khóa ngoại `request_id` để hệ thống định danh nó thuộc về đợt gọi thầu nào.

### Giai đoạn 3: Admin duyệt báo giá & Cấu hình Giá bán
1. **Giao diện:** Admin vào màn hình Quản lý Yêu cầu thu mua, mở chi tiết đợt gọi thầu.
2. **Hiển thị:** Hệ thống liệt kê toàn bộ các báo giá (`supplier_offers`) từ các NCC khác nhau gửi lên để Admin dễ dàng so sánh.
3. **Thao tác chọn & Cấu hình giá:** Admin chọn NCC có mức giá tốt nhất và bấm **"Duyệt"**. Một form cấu hình giá xuất hiện:
   * **Giá nhập:** Lấy trực tiếp từ báo giá của NCC vừa chọn.
   * **% Điều chỉnh:** Admin nhập tỷ lệ phần trăm muốn tăng/giảm (VD: nhập `20` nghĩa là bán chênh lệch 20% so với giá nhập).
   * **Giá bán dự kiến:** Hệ thống tự động tính theo công thức: 
     `Giá bán = Giá nhập * (1 + (% Điều chỉnh / 100))`
4. **Xử lý Backend (Core Logic):**
   * Đổi trạng thái báo giá của NCC được chọn thành `ACCEPTED`, lưu lại mức tỷ lệ `%` và `gia_ban_chot` vừa tính.
   * Tự động quét và đổi trạng thái toàn bộ các báo giá cạnh tranh khác (của các NCC rớt thầu) thành `REJECTED`.
   * Cập nhật trạng thái của Phiếu yêu cầu (`procurement_requests`) thành `CLOSED`.

### Giai đoạn 4: Chuyển giao sang Luồng Nhập Kho (Purchase Order)
1. Hệ thống tự động trích xuất dữ liệu từ báo giá đã được duyệt (`ACCEPTED`) để sinh ra một **Đơn đặt hàng (Purchase Order)** chính thức gửi cho NCC trúng thầu. Trạng thái đơn hàng: *Đang chuyển về kho*.
2. Khi hàng về đến nơi, quy trình kho được kích hoạt:
   * **Nhân viên kho:** Kiểm đếm số lượng thực nhận, phân loại hàng đạt tiêu chuẩn và hàng lỗi. Đối với sản phẩm hoàn toàn mới, nhân viên kho cập nhật hình ảnh thực tế lên hệ thống, sau đó nhấn **Xác nhận**.
   * **Admin duyệt cuối:** Admin kiểm tra đối chiếu báo cáo từ kho và nhấn **Duyệt cuối**.
   * **Hệ thống:** Cộng số lượng thực nhận vào **Tồn kho** và chính thức áp dụng **Giá bán** mới lên giao diện cửa hàng.

---

## 3. Thiết Kế Cơ Sở Dữ Liệu (Spring Boot Entities)

Để đáp ứng luồng trên, hệ thống sử dụng 3 bảng dữ liệu chính (2 bảng tạo mới, 1 bảng mở rộng):

### 3.1. Bảng `procurement_requests` (Phiếu Yêu cầu Thu mua)
* `id` (PK)
* `request_code` (Mã phiếu, VD: PRQ-20260617-001 - Unique)
* `status` (Trạng thái: `OPEN`, `CLOSED`)
* `note` (Ghi chú chung của Admin)
* `deadline` (Ngày hạn chót nhận báo giá)
* `created_by` (FK trỏ đến User Admin)
* `created_at` / `updated_at`

### 3.2. Bảng `procurement_request_items` (Chi tiết SP cần nhập)
* `id` (PK)
* `request_id` (FK trỏ đến `procurement_requests`)
* `product_id` (FK trỏ đến `SanPham`)
* `product_name` (Tên sản phẩm - lưu dạng text dự phòng)
* `qty_needed` (Số lượng cần nhập)
* `note` (Ghi chú riêng cho sản phẩm)

### 3.3. Bảng `supplier_offers` (Bảng Chào giá - Cập nhật mở rộng)
* `id` (PK)
* `request_id` (FK trỏ đến `procurement_requests`)
* `supplier_id` (FK trỏ đến Nhà cung cấp)
* `status` (Trạng thái: `PENDING`, `ACCEPTED`, `REJECTED`)
* `gia_nhap_chao_hang` (Giá nhập do NCC đề xuất)
* `phan_tram_dieu_chinh` (Tỷ lệ % lợi nhuận Admin thiết lập)
* `gia_ban_chot` (Giá bán ra cuối cùng sau khi tính toán)

---

## 4. Danh sách REST API (Backend - Spring Boot)

* `POST /api/procurement/order-request`
    * **Quyền:** Admin
    * **Chức năng:** Tạo đợt mời thầu mới (Nhận payload mảng các sản phẩm chọn từ Modal).
* `GET /api/procurement/public`
    * **Quyền:** Public / Supplier
    * **Chức năng:** Lấy danh sách các đợt gọi thầu đang `OPEN`.
* `POST /api/procurement/{id}/offer`
    * **Quyền:** Supplier
    * **Payload:** `{ "supplierId": 1, "giaNhapChaoHang": 500000, "note": "Hàng có sẵn" }`
    * **Chức năng:** Submit giá chào thầu của NCC vào hệ thống.
* `GET /api/procurement/{id}/offers`
    * **Quyền:** Admin
    * **Chức năng:** Lấy toàn bộ danh sách báo giá cạnh tranh của 1 đợt để so sánh.
* `POST /api/procurement/{id}/choose-offer/{offerId}`
    * **Quyền:** Admin
    * **Payload:** `{ "phanTramDieuChinh": 20 }`
    * **Chức năng:** Chốt thầu NCC. Hệ thống tự động tính `gia_ban_chot`, duyệt offer thành `ACCEPTED`, từ chối các offer khác, đóng Request và tự động sinh Đơn đặt hàng (PO).

---

## 5. Danh sách Giao diện (Frontend - ReactJS)

### Phía Admin (Quản trị viên)
1. **Modal Cảnh báo & Tạo Yêu cầu:** Tích hợp nút cảnh báo tại trang Quản lý Sản phẩm, hiển thị Modal danh sách SP (tồn < 5) có checkbox để tick chọn gọi hàng.
2. **Trang Quản lý Đấu thầu:** Liệt kê các Yêu cầu thu mua (`/admin/procurement`).
3. **Trang Chi tiết & Chốt giá:** Nơi xem chi tiết các báo giá từ NCC, form nhập `% Điều chỉnh` và nút xác nhận duyệt thầu.

### Phía Supplier (Nhà cung cấp)
1. **Cổng Thông tin Yêu cầu:** Trang hiển thị các đợt đang gọi hàng (`/procurement`).
2. **Form Báo giá:** Popup hoặc Trang chi tiết cho phép NCC điền giá nhập đề xuất và gửi lên hệ thống.