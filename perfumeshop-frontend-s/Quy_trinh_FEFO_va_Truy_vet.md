# Quy trình Nghiệp vụ: Xuất kho theo chuẩn FEFO và Truy vết Lô hàng (Traceability)

Để đảm bảo nguyên tắc **Hết hạn trước, Xuất trước (FEFO - First Expired, First Out)** và tối ưu hóa hiệu năng hệ thống, nghiệp vụ xuất kho được thiết kế kết hợp giữa kỹ thuật Phi chuẩn hóa (Denormalization) và Truy vết chi tiết.

## 1. Tổ chức Dữ liệu (Database Design)

Hệ thống duy trì trạng thái tồn kho ở hai cấp độ:

* **Bảng `SanPham` (Cấp độ Tổng):** Giữ lại cột `soLuongTonKho`. Cột này đóng vai trò như bộ nhớ đệm (Cache) giúp API đọc dữ liệu hiển thị lên trang chủ và các bộ lọc (Filter) hoạt động cực nhanh mà không cần JOIN bảng phức tạp.
* **Bảng `ChiTietPhieuNhap` (Cấp độ Lô hàng):** Bổ sung trường `hanSuDung` (Hạn sử dụng) và `soLuongConLai` (Số lượng tồn thực tế của riêng lô này). 
* **Bảng `ChiTietDonHang` (Lịch sử Xuất):** Bổ sung trường `phieuNhapId` (Khóa ngoại trỏ về Phiếu nhập kho) để lưu vết chính xác sản phẩm được xuất ra từ đợt nhập nào.

## 2. Kịch bản Xử lý Giao dịch (Transaction)

Mọi thao tác xuất/trừ kho đều được đặt trong một `@Transactional` của Spring Boot để đảm bảo tính toàn vẹn dữ liệu (ACID) – tức là nếu có bất kỳ bước nào lỗi, hệ thống sẽ tự động Rollback lại toàn bộ.

**Ví dụ:** Khách hàng đặt mua **5 chai Dior Sauvage**. Hệ thống sẽ chạy ngầm 4 bước sau:

### Bước 1: Quét và Ưu tiên Lô hàng (FEFO)
Hệ thống truy vấn các đợt nhập của sản phẩm Dior Sauvage có `soLuongConLai > 0`, sắp xếp theo `ORDER BY hanSuDung ASC`:
* **Đợt nhập 1** (Mã phiếu: PN001, HSD: 12/2026) $\rightarrow$ `soLuongConLai` = **2**
* **Đợt nhập 2** (Mã phiếu: PN005, HSD: 12/2027) $\rightarrow$ `soLuongConLai` = **100**

### Bước 2: Trừ tồn kho Chi tiết (Bảng `ChiTietPhieuNhap`)
Hệ thống thực hiện vòng lặp trừ dần số lượng khách mua từ đợt nhập cũ nhất đến mới nhất:
* Lấy **2 chai** từ Đợt nhập 1 $\rightarrow$ `UPDATE soLuongConLai = 0` cho PN001. (Khách còn thiếu 3 chai).
* Lấy tiếp **3 chai** từ Đợt nhập 2 $\rightarrow$ `UPDATE soLuongConLai = 97` cho PN005. (Đã lấy đủ 5 chai).

### Bước 3: Trừ tồn kho Tổng (Bảng `SanPham`)
Hệ thống cập nhật lại bộ đệm tổng để đồng bộ dữ liệu hiển thị cho khách hàng khác:
* `UPDATE SanPham SET soLuongTonKho = soLuongTonKho - 5 WHERE id = [Mã Dior]`

### Bước 4: Ghi nhận Truy vết vào Đơn hàng (Nghiệp vụ Nâng cao)
Thay vì chỉ lưu 1 dòng dữ liệu "Khách mua 5 chai", hệ thống sẽ tách thành 2 dòng trong bảng `ChiTietDonHang` để ánh xạ chính xác với lô hàng đã xuất kho:

| Mã Đơn Hàng | Mã Sản Phẩm | Số Lượng Mua | Đơn Giá | Lô Xuất (PhieuNhapId) |
| :--- | :--- | :--- | :--- | :--- |
| DH1024 | Dior Sauvage | **2** | 3.500.000đ | **PN001** |
| DH1024 | Dior Sauvage | **3** | 3.500.000đ | **PN005** |

> **🌟 Giá trị của nghiệp vụ nâng cao này:** > Việc lưu lại `phieuNhapId` ở bảng Chi tiết đơn hàng giúp hệ thống đạt chuẩn **Truy xuất nguồn gốc 100% (Full Traceability)**. 
> Nếu sau này khách hàng khiếu nại nước hoa bị hỏng, lỗi vòi xịt hoặc cận date, Admin chỉ cần mở chi tiết đơn hàng là biết ngay những chai đó được bốc ra từ phiếu nhập nào, do nhân viên nào nhập vào kho, và nhà cung cấp nào giao hàng để có phương án khiếu nại chéo với nhà cung cấp hoặc thu hồi toàn bộ lô hàng đó.
