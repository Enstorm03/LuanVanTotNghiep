# Hướng dẫn Triển khai Tính năng Quản lý Sự Kiện / Lễ Hội (Campaign Management)

## 1. Mục tiêu Nghiệp vụ (Business Objective)
Xây dựng hệ thống quản lý các chiến dịch bán hàng (ví dụ: Bộ sưu tập Mùa Hè, Siêu Sale Black Friday, Lễ Tình Nhân...).
* **Tự động hóa:** Hệ thống tự động kích hoạt sự kiện khi đến `ngay_bat_dau` và tự động tắt khi đến `ngay_ket_thuc`.
* **Trải nghiệm khách hàng:** Khi sự kiện ĐANG DIỄN RA, Trang chủ sẽ tự động thay đổi Banner theo sự kiện và CHỈ HIỂN THỊ các sản phẩm thuộc bộ sưu tập đó. Khi không có sự kiện, hệ thống trả về banner và danh sách sản phẩm mặc định.
* **Tối ưu DB:** Không thêm cột thừa vào bảng `san_pham`. Sử dụng thiết kế bảng trung gian (Many-to-Many).

---

## 2. Thiết kế Cơ sở dữ liệu (Database Design)

Cần chạy script SQL để tạo thêm 2 bảng mới:

### 2.1. Bảng `su_kien` (Lưu thông tin chiến dịch)
| Tên cột | Kiểu dữ liệu | Ghi chú |
| :--- | :--- | :--- |
| `id_su_kien` | INT (PK) | Tự tăng |
| `ten_su_kien` | VARCHAR(255) | Tên hiển thị (VD: Sale Mùa Hè) |
| `banner_url` | TEXT | Link ảnh Banner hiển thị trên Trang chủ |
| `ngay_bat_dau` | DATETIME | Khung giờ bắt đầu sự kiện |
| `ngay_ket_thuc` | DATETIME | Khung giờ kết thúc sự kiện |
| `trang_thai_active`| BOOLEAN | Công tắc bật/tắt khẩn cấp (Mặc định: true) |

### 2.2. Bảng `su_kien_san_pham` (Bảng trung gian)
| Tên cột | Kiểu dữ liệu | Ghi chú |
| :--- | :--- | :--- |
| `id_su_kien` | INT (FK) | Trỏ tới bảng `su_kien` |
| `id_san_pham` | INT (FK) | Trỏ tới bảng `san_pham` |

---

## 3. Triển khai Backend (Spring Boot)

### Bước 3.1. Khởi tạo Entity `SuKien.java`
```java
@Entity
@Table(name = "su_kien")
@Data // Của Lombok
public class SuKien {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer idSuKien;

    private String tenSuKien;
    private String bannerUrl;
    private LocalDateTime ngayBatDau;
    private LocalDateTime ngayKetThuc;
    private Boolean trangThaiActive = true;

    // Quan hệ Many-to-Many với Sản Phẩm
    @ManyToMany
    @JoinTable(
        name = "su_kien_san_pham",
        joinColumns = @JoinColumn(name = "id_su_kien"),
        inverseJoinColumns = @JoinColumn(name = "id_san_pham")
    )
    private List<SanPham> danhSachSanPham;
}
