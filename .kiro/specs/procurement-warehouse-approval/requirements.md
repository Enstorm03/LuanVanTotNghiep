# Requirements Document

## Introduction

Tính năng này cải tiến quy trình đấu thầu và nhập kho hiện tại của hệ thống Perfume Shop theo ba hướng chính:

1. **Luồng 3 bước sau chốt thầu**: Thay vì cộng kho ngay khi admin chốt NCC, hệ thống áp dụng quy trình trung gian — kho xác nhận hàng thực nhận → admin duyệt cuối → mới cộng tồn kho và cập nhật giá bán.
2. **Mở rộng entity PhieuNhapKho / ChiTietPhieuNhap**: Bổ sung trường `trangThai` vào `PhieuNhapKho` và 4 trường mới vào `ChiTietPhieuNhap` để lưu thông tin kiểm hàng từ kho.
3. **Trang portal công khai cho NCC chào hàng độc lập**: NCC có thể chủ động đề xuất sản phẩm mà không cần admin mở đợt gọi thầu, thông qua trang không yêu cầu đăng nhập.

---

## Glossary

- **ProcurementService**: Service Spring Boot xử lý nghiệp vụ đấu thầu (`ProcurementService.java`)
- **KhoService**: Service Spring Boot xử lý nghiệp vụ kho (`KhoService.java`)
- **KhoController**: REST Controller cho module kho (`KhoController.java`)
- **ProcurementController**: REST Controller cho module đấu thầu (`ProcurementController.java`)
- **PhieuNhapKho**: Entity đại diện phiếu nhập kho chính thức (bảng `phieu_nhap_kho`)
- **ChiTietPhieuNhap**: Entity đại diện chi tiết từng sản phẩm trong phiếu nhập (bảng `chi_tiet_phieu_nhap`)
- **SanPhamDeXuat**: Entity đại diện sản phẩm NCC đề xuất (bảng `san_pham_de_xuat`)
- **PhieuGoiThau**: Entity đại diện đợt mời thầu (bảng `phieu_goi_thau`)
- **BaoGiaNCC**: Entity báo giá từ NCC (bảng `bao_gia_ncc`)
- **SanPham**: Entity sản phẩm (bảng `san_pham`)
- **AdminKhoPage**: Trang React quản lý kho tại `/admin/kho`
- **AdminProcurementPage**: Trang React quản lý đấu thầu tại `/admin/procurement`
- **SupplierPortalPage**: Trang React công khai cho NCC tại `/supplier-portal`
- **NCC**: Nhà Cung Cấp
- **PO**: Purchase Order — Đơn đặt hàng phát sinh sau chốt thầu
- **CHO_KHO_KIEM_TRA**: Trạng thái PO vừa được tạo từ chốt thầu, chờ kho kiểm tra hàng
- **CHO_ADMIN_DUYET**: Trạng thái PO sau khi kho đã xác nhận, chờ admin duyệt cuối
- **DA_NHAP**: Trạng thái PO sau khi admin duyệt — tồn kho đã được cộng
- **BI_TU_CHOI**: Trạng thái PO bị admin từ chối sau khi kho xác nhận

---

## Requirements

### Yêu Cầu 1: Refactor Quy Trình Chốt Thầu — Không Cộng Kho Ngay

**User Story:** Là một admin, tôi muốn hệ thống không cộng tồn kho và không cập nhật giá bán ngay khi chốt NCC, để đảm bảo chỉ cộng số lượng hàng thực tế kho đã kiểm nhận.

#### Tiêu Chí Chấp Nhận

1. WHEN admin gọi `chotThau` thành công, THE ProcurementService SHALL tạo một bản ghi `PhieuNhapKho` mới với `trangThai = "CHO_KHO_KIEM_TRA"` mà không thay đổi `soLuongTonKho` của bất kỳ `SanPham` nào trong phiếu, và toàn bộ thao tác tạo phiếu SHALL được thực hiện trong một transaction nguyên tử.
2. WHEN admin gọi `chotThau` thành công, THE ProcurementService SHALL không ghi nhận bất kỳ bản ghi `BienDongKho` nào có loại `"NHAP"` cho các sản phẩm trong phiếu đó.
3. WHEN admin gọi `chotThau` thành công, THE ProcurementService SHALL không cập nhật `giaBan` của bất kỳ `SanPham` nào trong phiếu đó.
4. WHEN admin gọi `chotThau` thành công, THE ProcurementService SHALL lưu `giaNhapDeXuat` từ `BaoGiaNCC` được chọn vào `ChiTietPhieuNhap.giaNhap` cho từng sản phẩm trong phiếu, để sử dụng cho bước duyệt cuối sau này.
5. WHEN admin gọi `chotThau` thành công, THE ProcurementService SHALL lưu `soLuongCanNhap` từ `ChiTietGoiThau` tương ứng vào `ChiTietPhieuNhap.soLuong` để kho tham chiếu khi kiểm hàng.
6. IF `PhieuGoiThau` không có bất kỳ `BaoGiaNCC` nào tồn tại với `idBaoGia` được truyền vào, THEN THE ProcurementService SHALL ném `BusinessException` và không tạo `PhieuNhapKho`.
7. IF bất kỳ bước nào trong quá trình tạo `PhieuNhapKho` thất bại, THEN THE ProcurementService SHALL rollback toàn bộ transaction và không để lại trạng thái không nhất quán.

---

### Yêu Cầu 2: Mở Rộng Entity PhieuNhapKho — Thêm trangThai

**User Story:** Là một nhà phát triển, tôi muốn `PhieuNhapKho` có trường `trangThai` để phân biệt các giai đoạn xử lý của một PO, giúp các thành phần hệ thống lọc và hành động đúng theo trạng thái.

#### Tiêu Chí Chấp Nhận

1. THE PhieuNhapKho SHALL có trường `trangThai` kiểu `String` NOT NULL, được ánh xạ sang cột `trang_thai` trong bảng `phieu_nhap_kho`, với giá trị mặc định là `"CHO_KHO_KIEM_TRA"` khi không được gán tường minh.
2. IF bất kỳ thao tác nào cố gắng persist một `PhieuNhapKho` với `trangThai` không thuộc 4 giá trị hợp lệ (`"CHO_KHO_KIEM_TRA"`, `"CHO_ADMIN_DUYET"`, `"DA_NHAP"`, `"BI_TU_CHOI"`), THEN THE KhoService SHALL ném `BusinessException` và không lưu bản ghi.
3. WHEN một `PhieuNhapKho` được tạo từ luồng chốt thầu, THE ProcurementService SHALL gán `trangThai = "CHO_KHO_KIEM_TRA"` trước khi persist phiếu đó.
4. IF một `PhieuNhapKho` được tạo từ luồng nhập thủ công (CSV/Excel qua `KhoService.confirmImport`), THEN THE KhoService SHALL gán `trangThai = "DA_NHAP"` trước khi persist phiếu đó để tương thích ngược.

---

### Yêu Cầu 3: Mở Rộng Entity ChiTietPhieuNhap — Thêm Các Trường Kiểm Hàng

**User Story:** Là một nhân viên kho, tôi muốn ghi lại số lượng thực nhận, số lượng hàng lỗi, URL ảnh sản phẩm mới và ghi chú riêng của kho trên từng dòng chi tiết phiếu nhập, để admin có đủ thông tin trước khi duyệt cuối.

#### Tiêu Chí Chấp Nhận

1. THE ChiTietPhieuNhap SHALL có trường `soLuongThucNhan` kiểu `Integer`, ánh xạ sang cột `so_luong_thuc_nhan`, cho phép giá trị null trước khi kho kiểm tra; khi kho xác nhận giá trị SHALL nằm trong khoảng `[0, 10000]`.
2. THE ChiTietPhieuNhap SHALL có trường `soLuongLoi` kiểu `Integer`, ánh xạ sang cột `so_luong_loi`, với giá trị mặc định là `0`; khi kho xác nhận giá trị SHALL nằm trong khoảng `[0, 10000]`.
3. THE ChiTietPhieuNhap SHALL có trường `urlHinhAnhMoi` kiểu `String` tối đa 2048 ký tự, ánh xạ sang cột `url_hinh_anh_moi`, cho phép null.
4. THE ChiTietPhieuNhap SHALL có trường `ghiChuKho` kiểu `String` tối đa 1000 ký tự, ánh xạ sang cột `ghi_chu_kho`, cho phép null.
5. WHEN kho xác nhận kiểm hàng, THE KhoService SHALL yêu cầu `soLuongThucNhan` có giá trị không null và ≥ 0 cho mỗi `ChiTietPhieuNhap` trong phiếu; IF không đạt THEN SHALL ném `BusinessException` với thông báo nêu rõ `idChiTiet` vi phạm.
6. WHEN kho xác nhận kiểm hàng, THE KhoService SHALL yêu cầu `soLuongLoi ≤ soLuongThucNhan` cho mỗi `ChiTietPhieuNhap`; IF không đạt THEN SHALL ném `BusinessException`.

---

### Yêu Cầu 4: Nhân Viên Kho Xác Nhận Hàng Thực Nhận

**User Story:** Là một nhân viên kho, tôi muốn xem danh sách các PO đang chờ kiểm tra, điền thông tin kiểm hàng, và bấm xác nhận, để hệ thống chuyển PO sang trạng thái chờ admin duyệt.

#### Tiêu Chí Chấp Nhận

1. THE KhoController SHALL cung cấp endpoint `GET /api/kho/po-cho-kiem-tra` trả về danh sách tất cả `PhieuNhapKho` có `trangThai = "CHO_KHO_KIEM_TRA"` kèm chi tiết các `ChiTietPhieuNhap` (gồm `idChiTiet`, `idSanPham`, `tenSanPhamSnapshot`, `soLuong`, `giaNhap`) thuộc phiếu đó, sắp xếp theo `ngayNhap` giảm dần.
2. THE KhoController SHALL cung cấp endpoint `POST /api/kho/po/{id}/kho-xac-nhan` nhận payload gồm danh sách `[{ idChiTiet, soLuongThucNhan, soLuongLoi, urlHinhAnhMoi, ghiChuKho }]`.
3. WHEN KhoService nhận yêu cầu `khoXacNhan` cho một `PhieuNhapKho`, THE KhoService SHALL kiểm tra `trangThai` của phiếu là `"CHO_KHO_KIEM_TRA"` trước khi xử lý.
4. IF `trangThai` của `PhieuNhapKho` không phải `"CHO_KHO_KIEM_TRA"` khi kho gọi `khoXacNhan`, THEN THE KhoService SHALL ném `BusinessException` với thông báo mô tả trạng thái hiện tại của phiếu.
5. IF `PhieuNhapKho` không tồn tại với `id` được truyền, THEN THE KhoService SHALL ném `BusinessException` với mã lỗi not-found.
6. IF payload chứa `idChiTiet` không thuộc `PhieuNhapKho` tương ứng, hoặc `soLuongThucNhan` null hoặc < 0, hoặc `soLuongLoi` > `soLuongThucNhan`, THEN THE KhoService SHALL ném `BusinessException` trước khi thay đổi bất kỳ dữ liệu nào.
7. WHEN KhoService xử lý `khoXacNhan` thành công, THE KhoService SHALL lưu `soLuongThucNhan`, `soLuongLoi`, `urlHinhAnhMoi`, `ghiChuKho` vào từng `ChiTietPhieuNhap` tương ứng và cập nhật `trangThai` của `PhieuNhapKho` thành `"CHO_ADMIN_DUYET"` trong một transaction nguyên tử.
8. WHEN KhoService xử lý `khoXacNhan` thành công, THE KhoService SHALL không thay đổi `soLuongTonKho` của bất kỳ `SanPham` nào.

---

### Yêu Cầu 5: Admin Duyệt Cuối — Cộng Kho và Áp Giá Bán

**User Story:** Là một admin, tôi muốn xem báo cáo kiểm hàng từ kho và bấm duyệt cuối, để hệ thống chính thức cộng số lượng thực nhận vào tồn kho và áp dụng giá bán mới.

#### Tiêu Chí Chấp Nhận

1. THE KhoController SHALL cung cấp endpoint `GET /api/kho/po-cho-admin-duyet` trả về danh sách tất cả `PhieuNhapKho` có `trangThai = "CHO_ADMIN_DUYET"` kèm toàn bộ chi tiết kiểm hàng (`soLuongThucNhan`, `soLuongLoi`, `urlHinhAnhMoi`, `ghiChuKho`) từ kho.
2. THE KhoController SHALL cung cấp endpoint `POST /api/kho/po/{id}/admin-duyet-cuoi` để admin duyệt cuối một PO; body có thể trống hoặc chứa `idNhanVien`.
3. WHEN KhoService nhận yêu cầu `adminDuyetCuoi` cho một `PhieuNhapKho`, THE KhoService SHALL kiểm tra `trangThai` của phiếu là `"CHO_ADMIN_DUYET"` trước khi xử lý.
4. IF `trangThai` của `PhieuNhapKho` không phải `"CHO_ADMIN_DUYET"` khi admin gọi `adminDuyetCuoi`, THEN THE KhoService SHALL ném `BusinessException` với thông báo mô tả trạng thái hiện tại của phiếu.
5. WHEN KhoService xử lý `adminDuyetCuoi` thành công, THE KhoService SHALL trong một transaction nguyên tử: cộng `soLuongThucNhan` vào `soLuongTonKho` của từng `SanPham`, cập nhật `giaBan`, cập nhật `urlHinhAnh` nếu có, ghi `BienDongKho`, và chuyển `trangThai` thành `"DA_NHAP"`.
6. WHEN KhoService xử lý `adminDuyetCuoi` thành công, THE KhoService SHALL cập nhật `giaBan` của từng `SanPham` bằng `giaBanChot` đã được tính và lưu trong `BaoGiaNCC` khi chốt thầu; IF `giaBanChot` của `BaoGiaNCC` là null, THEN SHALL ném `BusinessException` và không cộng kho.
7. IF `urlHinhAnhMoi` của một `ChiTietPhieuNhap` có giá trị không null và không rỗng sau trim, THEN THE KhoService SHALL cập nhật `urlHinhAnh` của `SanPham` tương ứng bằng giá trị đó.
8. WHEN KhoService xử lý `adminDuyetCuoi` thành công, THE KhoService SHALL ghi một bản ghi `BienDongKho` với loại `"NHAP"`, số lượng bằng `soLuongThucNhan`, và `lyDo` ghi rõ mã phiếu PO cho mỗi sản phẩm trong phiếu.
9. WHEN KhoService xử lý `adminDuyetCuoi` thành công, THE KhoService SHALL cập nhật `trangThai` của `PhieuNhapKho` thành `"DA_NHAP"`.
10. IF bất kỳ bước nào trong transaction thất bại, THEN THE KhoService SHALL rollback toàn bộ và ném `BusinessException`, đảm bảo không có thay đổi nào được persist.
11. IF `adminDuyetCuoi` được gọi lại cho một `PhieuNhapKho` đã có `trangThai = "DA_NHAP"`, THEN THE KhoService SHALL ném `BusinessException` và không cộng kho thêm lần thứ hai (đảm bảo idempotency).

---

### Yêu Cầu 6: Admin Từ Chối PO Sau Khi Kho Xác Nhận

**User Story:** Là một admin, tôi muốn có khả năng từ chối một PO ở trạng thái `CHO_ADMIN_DUYET`, kèm lý do, để thông báo cho kho biết và ngăn tồn kho bị cộng sai.

#### Tiêu Chí Chấp Nhận

1. THE KhoController SHALL cung cấp endpoint `POST /api/kho/po/{id}/admin-tu-choi` nhận payload `{ lyDo: String }` trong đó `lyDo` là bắt buộc, không được rỗng, và có độ dài từ 1 đến 500 ký tự.
2. WHEN KhoService nhận yêu cầu `adminTuChoi` cho một `PhieuNhapKho`, THE KhoService SHALL kiểm tra `trangThai` của phiếu là `"CHO_ADMIN_DUYET"` trước khi xử lý.
3. IF `trangThai` của `PhieuNhapKho` không phải `"CHO_ADMIN_DUYET"` khi admin gọi `adminTuChoi`, THEN THE KhoService SHALL ném `BusinessException` với thông báo mô tả trạng thái hiện tại của phiếu.
4. IF `lyDo` là null hoặc rỗng sau trim, THEN THE KhoService SHALL ném `BusinessException` với thông báo yêu cầu cung cấp lý do từ chối, trước khi thay đổi bất kỳ dữ liệu nào.
5. WHEN KhoService xử lý `adminTuChoi` thành công, THE KhoService SHALL cập nhật `trangThai` của `PhieuNhapKho` thành `"BI_TU_CHOI"` và ghi đè `ghiChu` của phiếu bằng lý do từ chối được cung cấp.
6. WHEN KhoService xử lý `adminTuChoi` thành công, THE KhoService SHALL không thay đổi `soLuongTonKho` hoặc `giaBan` của bất kỳ `SanPham` nào.

---

### Yêu Cầu 7: Giao Diện Kho — Tab Quản Lý PO Đang Xử Lý

**User Story:** Là một nhân viên kho, tôi muốn có tab riêng trong trang Quản lý Kho (`/admin/kho`) để xem và xử lý các PO đang chờ kiểm tra, thay vì phải tìm kiếm trong danh sách phiếu nhập chung.

#### Tiêu Chí Chấp Nhận

1. THE AdminKhoPage SHALL hiển thị thêm tab "PO chờ kiểm tra" trong thanh tab điều hướng, liệt kê các `PhieuNhapKho` có `trangThai = "CHO_KHO_KIEM_TRA"`.
2. WHEN nhân viên kho mở chi tiết một PO đang chờ kiểm tra, THE AdminKhoPage SHALL hiển thị danh sách sản phẩm trong phiếu kèm trường nhập liệu cho `soLuongThucNhan`, `soLuongLoi`, `urlHinhAnhMoi`, `ghiChuKho` của từng dòng.
3. WHEN nhân viên kho bấm "Xác nhận kiểm hàng", THE AdminKhoPage SHALL gọi API `POST /api/kho/po/{id}/kho-xac-nhan` với dữ liệu đã nhập và hiển thị thông báo thành công hoặc lỗi tương ứng.
4. THE AdminKhoPage SHALL hiển thị thêm tab "Chờ admin duyệt" liệt kê các `PhieuNhapKho` có `trangThai = "CHO_ADMIN_DUYET"` kèm thông tin kiểm hàng từ kho.
5. WHEN admin bấm "Duyệt cuối" trên một PO trong tab "Chờ admin duyệt", THE AdminKhoPage SHALL gọi API `POST /api/kho/po/{id}/admin-duyet-cuoi` và làm mới danh sách sau khi xử lý.
6. WHEN admin bấm "Từ chối" trên một PO trong tab "Chờ admin duyệt", THE AdminKhoPage SHALL hiển thị form nhập lý do và gọi API `POST /api/kho/po/{id}/admin-tu-choi`.

---

### Yêu Cầu 8: Trang Công Khai Supplier Portal — Form Chào Hàng Độc Lập

**User Story:** Là một nhà cung cấp, tôi muốn truy cập trang công khai không cần đăng nhập để chủ động đề xuất sản phẩm và xem danh sách đợt gọi thầu đang mở, giúp tôi biết nhu cầu hiện tại của cửa hàng.

#### Tiêu Chí Chấp Nhận

1. THE SupplierPortalPage SHALL có thể truy cập tại đường dẫn `/supplier-portal` mà không yêu cầu xác thực.
2. THE SupplierPortalPage SHALL hiển thị form chào hàng với các trường: `tenNCC` (bắt buộc), `lienHeNCC` (bắt buộc), `tenSanPham` (bắt buộc), `moTa`, `urlHinhAnh`, `giaDeXuat` (bắt buộc, số dương), `soLuongCoTheCungCap`, `dungTichMl`, `nongDo`, `ghiChu`.
3. THE SupplierPortalPage SHALL chỉ cho phép NCC nhập URL hình ảnh dạng text, không cung cấp chức năng upload file.
4. WHEN NCC bấm gửi form, THE SupplierPortalPage SHALL validate các trường bắt buộc (`tenNCC`, `lienHeNCC`, `tenSanPham`, `giaDeXuat`) trước khi gọi API.
5. IF bất kỳ trường bắt buộc nào bị bỏ trống hoặc `giaDeXuat` ≤ 0, THEN THE SupplierPortalPage SHALL hiển thị thông báo lỗi inline tương ứng và không gửi request.
6. WHEN NCC gửi form hợp lệ, THE SupplierPortalPage SHALL gọi `POST /api/procurement/de-xuat-san-pham-doc-lap` và hiển thị thông báo gửi thành công.
7. THE SupplierPortalPage SHALL hiển thị danh sách các `PhieuGoiThau` đang `OPEN` được lấy từ `GET /api/procurement/public` để NCC tham khảo.

---

### Yêu Cầu 9: Backend Validate Đề Xuất Độc Lập

**User Story:** Là một nhà phát triển, tôi muốn backend từ chối các đề xuất độc lập thiếu thông tin bắt buộc, để dữ liệu trong hệ thống luôn nhất quán và có thể xử lý được.

#### Tiêu Chí Chấp Nhận

1. WHEN `ProcurementController` nhận yêu cầu `deXuatSanPhamDocLap`, THE ProcurementService SHALL kiểm tra `tenNCC` không null và không rỗng sau khi trim.
2. WHEN `ProcurementController` nhận yêu cầu `deXuatSanPhamDocLap`, THE ProcurementService SHALL kiểm tra `tenSanPham` không null và không rỗng sau khi trim.
3. WHEN `ProcurementController` nhận yêu cầu `deXuatSanPhamDocLap`, THE ProcurementService SHALL kiểm tra `giaDeXuat` không null và có giá trị lớn hơn `0`.
4. IF bất kỳ điều kiện validate nào không đạt, THEN THE ProcurementService SHALL ném `BusinessException` với thông báo mô tả trường vi phạm.

---

### Yêu Cầu 10: Admin Xem Đề Xuất Độc Lập Tại Trang Procurement

**User Story:** Là một admin, tôi muốn xem tất cả đề xuất sản phẩm độc lập từ NCC trong một tab riêng tại trang `/admin/procurement`, để xử lý mà không bị lẫn với các đề xuất gắn với đợt gọi thầu.

#### Tiêu Chí Chấp Nhận

1. THE AdminProcurementPage SHALL hiển thị thêm tab "Đề xuất độc lập" liệt kê các `SanPhamDeXuat` có `phieuGoiThau = null`, được lấy từ `GET /api/procurement/de-xuat-doc-lap`.
2. THE AdminProcurementPage SHALL cho phép lọc danh sách đề xuất độc lập theo `trangThai` (`PENDING`, `APPROVED`, `REJECTED`).
3. WHEN admin xem một đề xuất độc lập có `trangThai = "PENDING"`, THE AdminProcurementPage SHALL hiển thị nút "Duyệt" và nút "Từ chối".

---

## Thuộc Tính Đúng Đắn (Correctness Properties)

Các thuộc tính dưới đây được dùng làm cơ sở cho kiểm thử dựa trên thuộc tính (Property-Based Testing):

### P1 — Bất biến tồn kho sau chốt thầu (Invariant)
FOR ALL lệnh gọi `chotThau` hợp lệ, tồn kho (`soLuongTonKho`) của mọi `SanPham` trong phiếu SHALL bằng tồn kho trước khi gọi `chotThau`, cho đến khi `adminDuyetCuoi` được gọi thành công.

### P2 — Giới hạn hợp lệ của soLuongThucNhan (Range)
FOR ALL giá trị `soLuongThucNhan` do kho nhập vào `ChiTietPhieuNhap`, THE KhoService SHALL chấp nhận khi `0 ≤ soLuongThucNhan ≤ soLuong * 2` và từ chối khi `soLuongThucNhan < 0`.

### P3 — Cộng kho chính xác sau duyệt cuối (Round-trip / Aggregate)
WHEN `adminDuyetCuoi` được gọi thành công cho một `PhieuNhapKho`, tồn kho của mỗi `SanPham` liên quan SHALL tăng đúng bằng `soLuongThucNhan` của `ChiTietPhieuNhap` tương ứng (nghĩa là `tonKhoSau = tonKhoTruoc + soLuongThucNhan`).

### P4 — Bất biến chuyển trạng thái PO (State machine)
THE KhoService SHALL chỉ cho phép chuyển `trangThai` của `PhieuNhapKho` theo đúng các chuyển tiếp hợp lệ:
- `CHO_KHO_KIEM_TRA` → `CHO_ADMIN_DUYET` (chỉ khi kho xác nhận)
- `CHO_ADMIN_DUYET` → `DA_NHAP` (chỉ khi admin duyệt cuối)
- `CHO_ADMIN_DUYET` → `BI_TU_CHOI` (chỉ khi admin từ chối)
- Bất kỳ chuyển tiếp nào khác SHALL bị từ chối bằng `BusinessException`.

### P5 — Idempotence: duyệt cuối chỉ cộng kho một lần
FOR ANY `PhieuNhapKho` đã có `trangThai = "DA_NHAP"`, THE KhoService SHALL ném `BusinessException` nếu `adminDuyetCuoi` được gọi lại, đảm bảo tồn kho không bị cộng thêm lần hai.

### P6 — Validate đề xuất độc lập (Error condition)
FOR ALL input của `deXuatSanPhamDocLap`, THE ProcurementService SHALL:
- Chấp nhận khi `tenNCC` không rỗng, `tenSanPham` không rỗng, `giaDeXuat > 0`
- Từ chối (ném `BusinessException`) khi `tenNCC` rỗng, hoặc `tenSanPham` rỗng, hoặc `giaDeXuat ≤ 0`
