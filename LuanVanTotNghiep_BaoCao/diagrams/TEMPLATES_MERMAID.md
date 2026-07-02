# TEMPLATES SƠ ĐỒ MERMAID

Tất cả các sơ đồ cho luận văn được viết bằng Mermaid - có thể hiển thị trực tiếp trong Markdown!

---

## 🎨 Cách xem sơ đồ Mermaid

### Trong VS Code:
1. Cài extension: "Markdown Preview Mermaid Support"
2. Mở file .md chứa sơ đồ
3. Nhấn `Ctrl+Shift+V` để preview

### Online:
- Truy cập: https://mermaid.live/
- Copy code vào và xem ngay

---

## 📊 1. ERD - Entity Relationship Diagram

### Xem file: `01_ERD_Database.md`

```mermaid
erDiagram
    NGUOI_DUNG ||--o{ DON_HANG : "đặt"
    NGUOI_DUNG {
        int id_nguoi_dung PK
        string ten_dang_nhap
        string mat_khau_bam
        string ho_ten
        string email
        string so_dien_thoai
        string dia_chi
        boolean is_verified
        int id_role FK
    }
    
    DON_HANG ||--|{ CHI_TIET_DON_HANG : "có"
    DON_HANG {
        int id_don_hang PK
        int id_khach_hang FK
        datetime ngay_dat_hang
        decimal tong_tien
        string trang_thai
        string dia_chi_giao_hang
        string phuong_thuc_thanh_toan
    }
    
    SAN_PHAM ||--o{ CHI_TIET_DON_HANG : "trong"
    SAN_PHAM {
        int id_san_pham PK
        string ten_san_pham
        decimal gia
        string mo_ta
        int id_danh_muc FK
        int id_thuong_hieu FK
    }
    
    CHI_TIET_DON_HANG {
        int id_chi_tiet PK
        int id_don_hang FK
        int id_san_pham FK
        int so_luong
        decimal gia_tai_thoi_diem
        decimal thanh_tien
    }
```

---

## 📊 2. Sequence Diagram - Quy trình đặt hàng

### Xem file: `02_Sequence_DatHang.md`

```mermaid
sequenceDiagram
    actor KH as Khách hàng
    participant FE as Frontend
    participant BE as Backend
    participant DB as Database
    participant VNP as VNPay
    
    KH->>FE: Chọn sản phẩm
    FE->>FE: Thêm vào giỏ hàng
    KH->>FE: Nhấn "Thanh toán"
    
    FE->>BE: POST /api/orders (thông tin đơn hàng)
    BE->>DB: Kiểm tra tồn kho
    
    alt Đủ hàng
        DB-->>BE: Tồn kho OK
        BE->>DB: Tạo đơn hàng (trạng thái: Chờ thanh toán)
        BE->>DB: Trừ tồn kho
        BE-->>FE: Order ID + Payment URL
        
        FE->>VNP: Redirect đến VNPay
        KH->>VNP: Nhập thông tin thẻ
        VNP->>BE: IPN Callback (kết quả thanh toán)
        
        alt Thanh toán thành công
            BE->>DB: Cập nhật trạng thái: Đã thanh toán
            VNP-->>KH: Redirect về trang thành công
            BE->>FE: WebSocket: Thông báo đơn hàng mới
        else Thanh toán thất bại
            BE->>DB: Hoàn trả tồn kho
            BE->>DB: Cập nhật trạng thái: Đã hủy
            VNP-->>KH: Redirect về trang thất bại
        end
    else Hết hàng
        DB-->>BE: Tồn kho không đủ
        BE-->>FE: Lỗi: Sản phẩm hết hàng
        FE-->>KH: Hiển thị thông báo lỗi
    end
```

---

## 📊 3. Flowchart - Quy trình FEFO

### Xem file: `03_Flowchart_FEFO.md`

```mermaid
flowchart TD
    Start([Nhận đơn hàng mới]) --> CheckStock{Kiểm tra<br/>tồn kho}
    
    CheckStock -->|Đủ hàng| GetBatches[Lấy danh sách<br/>các batch có sản phẩm]
    CheckStock -->|Hết hàng| NotifyOOS[Thông báo<br/>hết hàng]
    
    GetBatches --> SortByExpiry[Sắp xếp theo<br/>hạn sử dụng<br/>FEFO]
    
    SortByExpiry --> CreatePickList[Tạo Pick List]
    
    CreatePickList --> LoopBatch{Duyệt từng batch}
    
    LoopBatch -->|Còn thiếu hàng| CheckQuantity{Batch có đủ<br/>số lượng cần?}
    
    CheckQuantity -->|Đủ| AllocateFull[Phân bổ đủ<br/>từ batch này]
    CheckQuantity -->|Không đủ| AllocatePartial[Phân bổ hết<br/>batch này]
    
    AllocateFull --> UpdateQty[Cập nhật<br/>số lượng còn lại]
    AllocatePartial --> UpdateQty
    
    UpdateQty --> LoopBatch
    
    LoopBatch -->|Đã đủ hàng| GeneratePickList[Generate<br/>Pick List PDF]
    
    GeneratePickList --> NotifyWarehouse[Thông báo<br/>nhân viên kho]
    
    NotifyWarehouse --> End([Kết thúc])
    NotifyOOS --> End
    
    style Start fill:#90EE90
    style End fill:#FFB6C1
    style CheckStock fill:#FFE4B5
    style GeneratePickList fill:#87CEEB
```

---

## 📊 4. Class Diagram - Domain Model

### Xem file: `04_Class_Domain_Model.md`

```mermaid
classDiagram
    class NguoiDung {
        +int idNguoiDung
        +string tenDangNhap
        +string matKhauBam
        +string hoTen
        +string email
        +string soDienThoai
        +boolean isVerified
        +login()
        +register()
        +updateProfile()
    }
    
    class DonHang {
        +int idDonHang
        +int idKhachHang
        +datetime ngayDatHang
        +decimal tongTien
        +string trangThai
        +createOrder()
        +updateStatus()
        +cancelOrder()
    }
    
    class SanPham {
        +int idSanPham
        +string tenSanPham
        +decimal gia
        +string moTa
        +int soLuongTon
        +updateStock()
        +checkAvailability()
    }
    
    class ChiTietPhieuNhap {
        +int idChiTiet
        +int idPhieuNhap
        +int idSanPham
        +int soLuong
        +date hanSuDung
        +string batchNumber
        +allocateFEFO()
    }
    
    class PickList {
        +int idPickList
        +int idDonHang
        +datetime ngayTao
        +List~PickListItem~ items
        +generate()
        +print()
    }
    
    NguoiDung "1" --> "*" DonHang : places
    DonHang "1" --> "*" ChiTietDonHang : contains
    SanPham "1" --> "*" ChiTietDonHang : in
    SanPham "1" --> "*" ChiTietPhieuNhap : tracked_by
    DonHang "1" --> "1" PickList : has
    PickList "1" --> "*" PickListItem : contains
    ChiTietPhieuNhap "1" --> "*" PickListItem : allocated_from
```

---

## 📊 5. State Diagram - Trạng thái đơn hàng

### Xem file: `05_State_DonHang.md`

```mermaid
stateDiagram-v2
    [*] --> DangCho: Tạo đơn mới
    
    DangCho --> DaXacNhan: Nhân viên xác nhận
    DangCho --> DaHuy: Khách/NV hủy
    
    DaXacNhan --> DangChuanBi: Tạo pick list
    DaXacNhan --> DaHuy: Hủy (cần duyệt)
    
    DangChuanBi --> DangGiaoHang: Hoàn tất đóng gói
    
    DangGiaoHang --> HoanThanh: Giao thành công
    DangGiaoHang --> BiTra: Khách từ chối nhận
    
    BiTra --> DangXuLyTra: Xử lý đổi trả
    DangXuLyTra --> DaHoanTien: Hoàn tiền
    DangXuLyTra --> DaDoiHang: Đổi hàng mới
    
    HoanThanh --> YeuCauDoiTra: Khách yêu cầu (trong 7 ngày)
    YeuCauDoiTra --> DangXuLyTra: Chấp nhận
    YeuCauDoiTra --> HoanThanh: Từ chối
    
    DaHuy --> [*]
    DaHoanTien --> [*]
    DaDoiHang --> [*]
    HoanThanh --> [*]
    
    note right of DangCho
        Đơn mới tạo
        Chờ xác nhận
    end note
    
    note right of DangGiaoHang
        Đang vận chuyển
        Có mã tracking
    end note
```

---

## 📊 6. Architecture Diagram - Kiến trúc hệ thống

### Xem file: `06_Architecture_System.md`

```mermaid
graph TB
    subgraph "Client Layer"
        Web[Web Browser<br/>React.js]
        Mobile[Mobile App<br/>React Native]
    end
    
    subgraph "API Gateway"
        Gateway[Nginx<br/>Load Balancer]
    end
    
    subgraph "Application Layer"
        API1[Spring Boot<br/>Instance 1]
        API2[Spring Boot<br/>Instance 2]
        API3[Spring Boot<br/>Instance 3]
    end
    
    subgraph "Service Layer"
        Auth[Authentication<br/>Service]
        Order[Order<br/>Service]
        Inventory[Inventory<br/>FEFO Service]
        Payment[Payment<br/>Service]
        Notification[Notification<br/>Service]
    end
    
    subgraph "Data Layer"
        DB[(MySQL<br/>Database)]
        Redis[(Redis<br/>Cache)]
        S3[AWS S3<br/>File Storage]
    end
    
    subgraph "External Services"
        VNPay[VNPay<br/>Payment Gateway]
        Email[Email<br/>Service]
        SMS[SMS<br/>Gateway]
    end
    
    Web --> Gateway
    Mobile --> Gateway
    
    Gateway --> API1
    Gateway --> API2
    Gateway --> API3
    
    API1 --> Auth
    API1 --> Order
    API1 --> Inventory
    API2 --> Payment
    API3 --> Notification
    
    Auth --> DB
    Order --> DB
    Inventory --> DB
    Payment --> DB
    
    Auth --> Redis
    Order --> Redis
    
    Inventory --> S3
    
    Payment --> VNPay
    Notification --> Email
    Notification --> SMS
    
    style Web fill:#E3F2FD
    style Mobile fill:#E3F2FD
    style Gateway fill:#FFF9C4
    style DB fill:#FFCCBC
    style Redis fill:#FFE0B2
```

---

## 🚀 Hướng dẫn sử dụng

### 1. Xem trong Markdown:
- Mở file .md trong VS Code
- Preview với `Ctrl+Shift+V`
- Sơ đồ hiển thị trực tiếp!

### 2. Export ảnh:
```bash
# Cài mmdc CLI
npm install -g @mermaid-js/mermaid-cli

# Export PNG
mmdc -i diagram.md -o diagram.png

# Export SVG
mmdc -i diagram.md -o diagram.svg
```

### 3. Chỉnh sửa online:
- Vào https://mermaid.live/
- Paste code
- Chỉnh sửa và download

---

## 📝 Tips

1. **Màu sắc**: Thêm `style NodeName fill:#color` ở cuối
2. **Font tiếng Việt**: Mermaid hỗ trợ tốt Unicode
3. **Complexity**: Nếu sơ đồ quá phức tạp, chia nhỏ ra
4. **Version control**: File text nên Git friendly

---

**Happy Diagramming with Mermaid!** 🎨