# HƯỚNG DẪN VẼ 3 SƠ ĐỒ ERD TRONG DRAW.IO

## I. TỔNG QUAN 3 SƠ ĐỒ

### 1. **Sơ đồ Ý NIỆM (Conceptual Model)** - Hình 3-1
- **Mục đích:** Mô tả các thực thể chính và mối quan hệ nghiệp vụ
- **Đặc điểm:**
  - Không có thuộc tính chi tiết
  - Chỉ hiển thị tên thực thể (Entity) và mối quan hệ (Relationship)
  - Sử dụng hình chữ nhật cho Entity, hình thoi cho Relationship
  - Phù hợp để trình bày cho quản lý, khách hàng

### 2. **Sơ đồ LOGIC (Logical Model)** - Hình 3-2
- **Mục đích:** Thiết kế chi tiết cơ sở dữ liệu với thuộc tính đầy đủ
- **Đặc điểm:**
  - Hiển thị tất cả thuộc tính (attributes)
  - Đánh dấu Primary Key (PK), Foreign Key (FK)
  - Hiển thị kiểu dữ liệu (VARCHAR, INT, DECIMAL...)
  - Phù hợp cho DBA, developer

### 3. **Sơ đồ VẬT LÝ (Physical Model)** - Hình 3-3
- **Mục đích:** Mô hình thực tế triển khai trên MySQL
- **Đặc điểm:**
  - Giống Logical Model nhưng có thêm chi tiết kỹ thuật
  - Constraint (NOT NULL, UNIQUE, DEFAULT)
  - Index, auto_increment
  - Tên bảng theo chuẩn MySQL (snake_case)

---

## II. CÁCH VẼ TRONG DRAW.IO

### **BƯỚC 1: Mở Draw.io và tạo file mới**

1. Truy cập https://app.diagrams.net/
2. Chọn "Create New Diagram"
3. Chọn template "Blank Diagram" → Create

---

## III. NỘI DUNG 3 SƠ ĐỒ

### **SƠ ĐỒ 1: Ý NIỆM (CONCEPTUAL)**

#### Các thực thể cần vẽ (hình chữ nhật):
1. NGƯỜI DÙNG
2. NHÂN VIÊN
3. SẢN PHẨM
4. ĐƠN HÀNG
5. CHI TIẾT ĐƠN HÀNG
6. DANH MỤC
7. THƯƠNG HIỆU
8. PHIẾU NHẬP KHO
9. CHI TIẾT PHIẾU NHẬP
10. PHIẾU GỌI THẦU
11. BÁO GIÁ NCC
12. SỰ KIỆN
13. PHIẾU ĐỔI TRẢ
14. BIẾN ĐỘNG KHO

#### Các mối quan hệ (hình thoi):
- NGƯỜI DÙNG --[ĐẶT]--> ĐƠN HÀNG (1:N)
- NHÂN VIÊN --[XỬ LÝ]--> ĐƠN HÀNG (1:N)
- ĐƠN HÀNG --[CHỨA]--> CHI TIẾT ĐƠN HÀNG (1:N)
- SẢN PHẨM --[THUỘC]--> CHI TIẾT ĐƠN HÀNG (1:N)
- SẢN PHẨM --[THUỘC]--> DANH MỤC (N:1)
- SẢN PHẨM --[THUỘC]--> THƯƠNG HIỆU (N:1)
- SẢN PHẨM --[THAM GIA]--> SỰ KIỆN (M:N)
- PHIẾU NHẬP KHO --[CHỨA]--> CHI TIẾT PHIẾU NHẬP (1:N)
- SẢN PHẨM --[ĐƯỢC NHẬP]--> CHI TIẾT PHIẾU NHẬP (1:N)
- PHIẾU GỌI THẦU --[NHẬN]--> BÁO GIÁ NCC (1:N)
- ĐƠN HÀNG --[CÓ]--> PHIẾU ĐỔI TRẢ (1:1)
- SẢN PHẨM --[THEO DÕI]--> BIẾN ĐỘNG KHO (1:N)

**Hướng dẫn vẽ:**
- Kéo "Rectangle" vào canvas → đặt tên thực thể
- Fill color: #dae8fc (xanh nhạt)
- Kéo "Diamond" (hình thoi) vào → đặt tên mối quan hệ
- Fill color: #ffe6cc (vàng nhạt)
- Nối các shape bằng connector (đường thẳng)
- Đánh dấu cardinality: 1, N, M trên đường nối

---

### **SƠ ĐỒ 2: LOGIC (LOGICAL)**

#### Vẽ các bảng với thuộc tính đầy đủ:

**Bảng 1: NguoiDung**
```
┌─────────────────────────────┐
│      NguoiDung             │
├─────────────────────────────┤
│ 🔑 id_nguoi_dung: INT      │
│ 🔒 ten_dang_nhap: VARCHAR(50) UNIQUE │
│    mat_khau_bam: VARCHAR(255) │
│    ho_ten: VARCHAR(100)     │
│    email: VARCHAR(100) UNIQUE │
│    so_dien_thoai: VARCHAR(15) │
│    dia_chi: TEXT            │
│    vai_tro: ENUM            │
│    is_verified: BOOLEAN     │
│    verification_token: VARCHAR(255) │
│    token_expiry_time: DATETIME │
│    created_at: DATETIME     │
└─────────────────────────────┘
```

**Bảng 2: NhanVien**
```
┌─────────────────────────────┐
│       NhanVien             │
├─────────────────────────────┤
│ 🔑 id_nhan_vien: INT       │
│ 🔒 ten_dang_nhap: VARCHAR(50) UNIQUE │
│    mat_khau_bam: VARCHAR(255) │
│    ho_ten: VARCHAR(100)     │
│    vai_tro: ENUM            │
│    created_at: DATETIME     │
└─────────────────────────────┘
```

**Bảng 3: SanPham**
```
┌─────────────────────────────┐
│       SanPham              │
├─────────────────────────────┤
│ 🔑 id_san_pham: INT        │
│    ten_san_pham: VARCHAR(200) │
│    mo_ta: TEXT              │
│    url_hinh_anh: VARCHAR(500) │
│    gia_ban: DECIMAL(10,2)  │
│    dung_tich_ml: INT        │
│    nong_do: INT             │
│    so_luong_ton_kho: INT    │
│    so_luong_hang_loi: INT   │
│    phan_tram_giam: INT      │
│    ngay_bat_dau_giam: DATETIME │
│    ngay_ket_thuc_giam: DATETIME │
│ 🔗 id_danh_muc: INT (FK)   │
│ 🔗 id_thuong_hieu: INT (FK) │
│ 🔗 id_su_kien: INT (FK)    │
│    created_at: DATETIME     │
└─────────────────────────────┘
```

**Bảng 4: DonHang**
```
┌─────────────────────────────┐
│       DonHang              │
├─────────────────────────────┤
│ 🔑 id_don_hang: INT        │
│ 🔗 id_nguoi_dung: INT (FK) │
│ 🔗 id_nhan_vien: INT (FK)  │
│    trang_thai_van_hanh: VARCHAR(50) │
│    trang_thai_thanh_toan: VARCHAR(50) │
│    tong_tien: DECIMAL(15,2) │
│ 🔒 ma_van_don: VARCHAR(100) UNIQUE │
│    so_dien_thoai: VARCHAR(15) │
│    phuong_thuc_thanh_toan: VARCHAR(50) │
│    ten_nguoi_nhan: VARCHAR(100) │
│    dia_chi_giao_hang: TEXT  │
│    ngay_dat_hang: DATETIME  │
│    ly_do_huy: TEXT          │
│    ghi_chu: TEXT            │
│    ngay_hoan_thanh: DATETIME │
│ 🔗 id_su_kien: INT (FK)    │
│    giam_gia_hang_loat: DECIMAL(15,2) │
└─────────────────────────────┘
```

**Bảng 5: ChiTietDonHang**
```
┌─────────────────────────────┐
│    ChiTietDonHang          │
├─────────────────────────────┤
│ 🔑 id_chi_tiet_don_hang: INT │
│ 🔗 id_don_hang: INT (FK)   │
│ 🔗 id_san_pham: INT (FK)   │
│    so_luong: INT            │
│    gia_tai_thoi_diem_mua: DECIMAL(15,2) │
│ 🔗 id_phieu_nhap: INT (FK) │
└─────────────────────────────┘
```

**Bảng 6: PhieuNhapKho**
```
┌─────────────────────────────┐
│     PhieuNhapKho           │
├─────────────────────────────┤
│ 🔑 id_phieu: INT           │
│ 🔒 ma_phieu: VARCHAR(50) UNIQUE │
│ 🔗 id_nhan_vien: INT (FK)  │
│    nha_cung_cap: VARCHAR(200) │
│    ngay_nhap: DATETIME      │
│    ghi_chu: TEXT            │
│    gia_ban_chot: DECIMAL(15,2) │
│    trang_thai: VARCHAR(30)  │
└─────────────────────────────┘
```

**Bảng 7: ChiTietPhieuNhap**
```
┌─────────────────────────────┐
│   ChiTietPhieuNhap         │
├─────────────────────────────┤
│ 🔑 id_chi_tiet_phieu_nhap: INT │
│ 🔗 id_phieu_nhap: INT (FK) │
│ 🔗 id_san_pham: INT (FK)   │
│    han_su_dung: DATE        │
│    so_lo: VARCHAR(50)       │
│    so_luong_con_lai: INT    │
│    gia_nhap: DECIMAL(10,2)  │
└─────────────────────────────┘
```

**Bảng 8: PhieuGoiThau**
```
┌─────────────────────────────┐
│     PhieuGoiThau           │
├─────────────────────────────┤
│ 🔑 id_phieu_goi_thau: INT  │
│ 🔒 ma_phieu: VARCHAR(50) UNIQUE │
│    trang_thai: ENUM         │
│    ngay_tao: DATETIME       │
│    ngay_het_han: DATETIME   │
│ 🔗 id_nhan_vien_tao: INT (FK) │
└─────────────────────────────┘
```

**Bảng 9: BaoGiaNCC**
```
┌─────────────────────────────┐
│       BaoGiaNCC            │
├─────────────────────────────┤
│ 🔑 id_bao_gia: INT         │
│ 🔗 id_phieu_goi_thau: INT (FK) │
│ 🔗 id_nguoi_dung: INT (FK) │
│ 🔗 id_san_pham: INT (FK)   │
│    gia_nhap: DECIMAL(10,2)  │
│    han_su_dung: DATE        │
│    so_lo: VARCHAR(50)       │
│    trang_thai: ENUM         │
│    phan_tram_bien_do: DECIMAL(5,2) │
│    gia_ban_chot: DECIMAL(10,2) │
│    ngay_bao_gia: DATETIME   │
└─────────────────────────────┘
```

**Bảng 10: PhieuDoiTra**
```
┌─────────────────────────────┐
│      PhieuDoiTra           │
├─────────────────────────────┤
│ 🔑 id_doi_tra: INT         │
│ 🔗 id_don_hang: INT (FK)   │
│ 🔗 id_nguoi_dung: INT (FK) │
│ 🔗 id_nhan_vien: INT (FK)  │
│    ly_do: TEXT              │
│    ly_do_tu_choi: TEXT      │
│    ghi_chu_noi_bo: TEXT     │
│    so_tien_hoan: DECIMAL(15,2) │
│    ngay_hoan_tien: DATETIME │
│    trang_thai: VARCHAR(50)  │
│    ngay_tao: DATETIME       │
└─────────────────────────────┘
```

**Bảng 11: BienDongKho**
```
┌─────────────────────────────┐
│      BienDongKho           │
├─────────────────────────────┤
│ 🔑 id_bien_dong: INT       │
│ 🔗 id_san_pham: INT (FK)   │
│    loai: ENUM               │
│    so_luong: INT            │
│    ton_kho_sau: INT         │
│    ly_do: TEXT              │
│    created_at: DATETIME     │
└─────────────────────────────┘
```

**Bảng 12: DanhMuc**
```
┌─────────────────────────────┐
│       DanhMuc              │
├─────────────────────────────┤
│ 🔑 id_danh_muc: INT        │
│    ten_danh_muc: VARCHAR(100) │
└─────────────────────────────┘
```

**Bảng 13: ThuongHieu**
```
┌─────────────────────────────┐
│     ThuongHieu             │
├─────────────────────────────┤
│ 🔑 id_thuong_hieu: INT     │
│ 🔒 ten_thuong_hieu: VARCHAR(100) UNIQUE │
│    url_hinh_anh: VARCHAR(500) │
└─────────────────────────────┘
```

**Bảng 14: SuKien**
```
┌─────────────────────────────┐
│       SuKien               │
├─────────────────────────────┤
│ 🔑 id_su_kien: INT         │
│    ten_su_kien: VARCHAR(200) │
│    banner_url: TEXT         │
│    ngay_bat_dau: DATETIME   │
│    ngay_ket_thuc: DATETIME  │
│    trang_thai_active: BOOLEAN │
│    giam_gia_hang_loat: DECIMAL(5,2) │
└─────────────────────────────┘
```

**Bảng 15: DanhGiaSanPham**
```
┌─────────────────────────────┐
│    DanhGiaSanPham          │
├─────────────────────────────┤
│ 🔑 id_danh_gia: INT        │
│ 🔗 id_san_pham: INT (FK)   │
│ 🔗 id_nguoi_dung: INT (FK) │
│    diem_danh_gia: INT       │
│    binh_luan: TEXT          │
│    ngay_tao: DATETIME       │
└─────────────────────────────┘
```

**Bảng 16: LoginLog**
```
┌─────────────────────────────┐
│       LoginLog             │
├─────────────────────────────┤
│ 🔑 id_log: INT             │
│    ten_dang_nhap: VARCHAR(50) │
│    loai_nguoi_dung: ENUM    │
│    trang_thai: ENUM         │
│    ip_address: VARCHAR(45)  │
│    user_agent: TEXT         │
│    ly_do_that_bai: TEXT     │
│    thoi_gian: DATETIME      │
└─────────────────────────────┘
```

**Các bảng còn lại:** PhieuNhapTam, ChiTietGoiThau, SanPhamDeXuat (vẽ tương tự)

**Hướng dẫn vẽ Logical:**
- Sử dụng shape "Entity" từ thư viện Entity Relationship
- Hoặc dùng Rectangle với định dạng:
  - Header: Tên bảng (bold, background #dae8fc)
  - Body: Danh sách thuộc tính với ký hiệu:
    - 🔑 = Primary Key
    - 🔗 = Foreign Key
    - 🔒 = Unique Key
- Nối các bảng bằng connector có mũi tên chỉ quan hệ
- Ghi cardinality (1:1, 1:N, M:N) trên đường nối

---

### **SƠ ĐỒ 3: VẬT LÝ (PHYSICAL)**

**Giống sơ đồ Logic nhưng thêm:**
- Constraint: NOT NULL, DEFAULT value
- Auto Increment cho PK
- Index (KEY, INDEX)
- Kiểu dữ liệu MySQL cụ thể

**Ví dụ bảng NguoiDung (Physical):**
```
┌─────────────────────────────────────┐
│         nguoi_dung                 │
├─────────────────────────────────────┤
│ 🔑 id_nguoi_dung: INT AUTO_INCREMENT │
│ 🔒 ten_dang_nhap: VARCHAR(50) NOT NULL UNIQUE │
│    mat_khau_bam: VARCHAR(255) NOT NULL │
│    ho_ten: VARCHAR(100) NOT NULL    │
│    email: VARCHAR(100) NOT NULL UNIQUE │
│    so_dien_thoai: VARCHAR(15)       │
│    dia_chi: TEXT                    │
│    vai_tro: ENUM('CUSTOMER','SUPPLIER') DEFAULT 'CUSTOMER' │
│    is_verified: BOOLEAN DEFAULT FALSE │
│    verification_token: VARCHAR(255) │
│    token_expiry_time: DATETIME      │
│    created_at: DATETIME DEFAULT CURRENT_TIMESTAMP │
│                                     │
│ INDEX idx_email (email)             │
│ INDEX idx_vai_tro (vai_tro)         │
└─────────────────────────────────────┘
```

**Hướng dẫn vẽ Physical:**
- Giống Logical nhưng thêm section "Constraints & Indexes" ở cuối mỗi bảng
- Đánh dấu NOT NULL cho các trường bắt buộc
- Ghi DEFAULT value
- List các INDEX

---

## IV. LƯU Ý KHI VẼ

### **Màu sắc gợi ý:**
- **Entity/Table:** #dae8fc (xanh nhạt)
- **Relationship:** #ffe6cc (vàng nhạt)
- **Primary Key:** #ffcccc (đỏ nhạt)
- **Foreign Key:** #d5e8d4 (xanh lá nhạt)

### **Font chữ:**
- Tên bảng: Arial Bold 12pt
- Thuộc tính: Arial Regular 10pt
- Ký hiệu: Arial 9pt

### **Layout:**
- Sắp xếp các bảng theo nhóm nghiệp vụ:
  - Nhóm User: NguoiDung, NhanVien, LoginLog
  - Nhóm Sản phẩm: SanPham, DanhMuc, ThuongHieu
  - Nhóm Đơn hàng: DonHang, ChiTietDonHang, PhieuDoiTra
  - Nhóm Kho: PhieuNhapKho, ChiTietPhieuNhap, BienDongKho
  - Nhóm Đấu thầu: PhieuGoiThau, BaoGiaNCC, SanPhamDeXuat

### **Export:**
- Export as PNG (300 DPI) để chèn vào Word
- Hoặc export as SVG để giữ chất lượng vector

---

## V. TEMPLATE CODE MẪU (Copy vào Draw.io)

Bạn có thể tạo sơ đồ nhanh bằng cách:
1. Mở Draw.io
2. Chọn Arrange → Insert → Advanced → CSV
3. Paste code sau (ví dụ cho Conceptual):

```csv
# Conceptual Model
## Entity
id,shape,label,x,y,width,height,fill
1,rectangle,NGƯỜI DÙNG,100,200,120,60,#dae8fc
2,rectangle,NHÂN VIÊN,100,350,120,60,#dae8fc
3,rectangle,SẢN PHẨM,500,200,120,60,#dae8fc
4,rectangle,ĐƠN HÀNG,300,300,120,60,#dae8fc
5,rectangle,DANH MỤC,700,100,120,60,#dae8fc

## Relationships
from,to,label,style
1,4,ĐẶT,diamond;fillColor=#ffe6cc
2,4,XỬ LÝ,diamond;fillColor=#ffe6cc
4,3,CHỨA,diamond;fillColor=#ffe6cc
3,5,THUỘC,diamond;fillColor=#ffe6cc
```

---

## VI. KẾT QUẢ CUỐI CÙNG

Sau khi vẽ xong 3 sơ đồ, bạn sẽ có:

1. **Hình 3-1:** Sơ đồ ERD Ý niệm (Conceptual_Model.png)
2. **Hình 3-2:** Sơ đồ ERD Logic (Logical_Model.png)
3. **Hình 3-3:** Sơ đồ ERD Vật lý (Physical_Model.png)

Chèn 3 hình này vào phần **3.1.1 Sơ đồ ERD** trong luận văn.

---

**Chúc bạn vẽ sơ đồ thành công! 🎨**
