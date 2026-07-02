# TẤT CẢ SƠ ĐỒ HỆ THỐNG - ĐẦY ĐỦ

File này chứa tất cả các sơ đồ cần thiết cho luận văn, sẵn sàng sử dụng!

---

## 📊 1. ERD - Sơ đồ Database (Xem file riêng: 01_ERD_Full_Database.md)

**Đã tạo riêng với 25 bảng đầy đủ**

---

## 📊 2. SEQUENCE DIAGRAM - Đặt hàng & Thanh toán VNPay

```mermaid
sequenceDiagram
    actor KH as Khách hàng
    participant FE as React Frontend
    participant BE as Spring Boot API
    participant DB as MySQL Database
    participant FEFO as FEFO Service
    participant VNP as VNPay Gateway
    
    Note over KH,VNP: QUY TRÌNH ĐẶT HÀNG VÀ THANH TOÁN
    
    %% Chọn sản phẩm
    KH->>FE: Chọn sản phẩm + Thêm vào giỏ
    FE->>FE: Lưu giỏ hàng (LocalStorage)
    
    %% Checkout
    KH->>FE: Nhấn "Thanh toán"
    FE->>FE: Validate thông tin
    FE->>BE: POST /api/orders/create
    
    %% Kiểm tra tồn kho
    BE->>DB: SELECT tồn kho sản phẩm
    
    alt Đủ hàng
        DB-->>BE: Tồn kho OK
        
        %% Tạo đơn hàng
        BE->>DB: BEGIN TRANSACTION
        BE->>DB: INSERT INTO Don_Hang
        BE->>DB: INSERT INTO Chi_Tiet_Don_Hang
        BE->>DB: UPDATE So_Luong_Ton (Trừ kho)
        
        %% Tạo Pick List FEFO
        BE->>FEFO: generatePickList(orderId)
        FEFO->>DB: SELECT batches ORDER BY han_su_dung ASC
        FEFO->>DB: INSERT INTO Pick_List
        FEFO->>DB: INSERT INTO Pick_List_Item
        FEFO-->>BE: Pick list created
        
        BE->>DB: COMMIT TRANSACTION
        BE-->>FE: {orderId, paymentUrl}
        
        %% Thanh toán VNPay
        FE->>KH: Redirect đến VNPay
        KH->>VNP: Nhập thông tin thẻ
        VNP->>VNP: Xác thực thanh toán
        
        alt Thanh toán thành công
            VNP->>BE: IPN Callback (Success)
            BE->>DB: UPDATE trang_thai = 'Đã thanh toán'
            BE->>DB: INSERT INTO Thanh_Toan
            VNP-->>KH: Redirect về success page
            BE->>FE: WebSocket: Thông báo đơn mới
            FE->>KH: Hiển thị "Đặt hàng thành công"
            
        else Thanh toán thất bại
            VNP->>BE: IPN Callback (Failed)
            BE->>DB: UPDATE trang_thai = 'Đã hủy'
            BE->>DB: Hoàn trả tồn kho
            BE->>DB: DELETE Pick_List
            VNP-->>KH: Redirect về failure page
            FE->>KH: Hiển thị "Thanh toán thất bại"
        end
        
    else Hết hàng
        DB-->>BE: Tồn kho không đủ
        BE-->>FE: Error: "Sản phẩm hết hàng"
        FE-->>KH: Thông báo lỗi
    end
```

---

## 📊 3. FLOWCHART - Quy trình FEFO (First Expired, First Out)

```mermaid
flowchart TD
    Start([Nhận đơn hàng mới<br/>ID: #12345]) --> CheckStock{Kiểm tra<br/>tồn kho}
    
    CheckStock -->|Đủ hàng| GetBatches[SELECT * FROM Chi_Tiet_Phieu_Nhap<br/>WHERE id_san_pham = X<br/>AND so_luong_con_lai > 0]
    CheckStock -->|Hết hàng| NotifyOOS[Thông báo hết hàng<br/>cho khách]
    
    GetBatches --> SortByExpiry[ORDER BY han_su_dung ASC<br/>Ưu tiên batch hết hạn sớm nhất]
    
    SortByExpiry --> InitPickList[Tạo Pick List mới<br/>Khởi tạo biến:<br/>so_luong_can = số lượng đặt]
    
    InitPickList --> LoopBatch{Duyệt từng batch<br/>so_luong_can > 0?}
    
    LoopBatch -->|Còn thiếu| GetNextBatch[Lấy batch tiếp theo]
    
    GetNextBatch --> CheckBatchQty{so_luong_con_lai<br/>của batch >= so_luong_can?}
    
    CheckBatchQty -->|Đủ| AllocateFull[Phân bổ đủ từ batch này<br/>INSERT Pick_List_Item<br/>so_luong = so_luong_can]
    CheckBatchQty -->|Không đủ| AllocatePartial[Phân bổ hết batch này<br/>INSERT Pick_List_Item<br/>so_luong = so_luong_con_lai]
    
    AllocateFull --> UpdateFull[UPDATE so_luong_con_lai<br/>so_luong_can = 0]
    AllocatePartial --> UpdatePartial[UPDATE so_luong_con_lai = 0<br/>so_luong_can -= allocated]
    
    UpdateFull --> LoopBatch
    UpdatePartial --> LoopBatch
    
    LoopBatch -->|Đã đủ hàng| GeneratePDF[Generate Pick List PDF<br/>với thông tin:<br/>- Sản phẩm<br/>- Batch number<br/>- Vị trí kho<br/>- Hạn sử dụng]
    
    GeneratePDF --> NotifyWarehouse[Gửi thông báo<br/>cho nhân viên kho<br/>Email + Dashboard]
    
    NotifyWarehouse --> End([Hoàn thành])
    NotifyOOS --> End
    
    style Start fill:#90EE90
    style End fill:#FFB6C1
    style CheckStock fill:#FFE4B5
    style SortByExpiry fill:#87CEEB
    style GeneratePDF fill:#DDA0DD
    style CheckBatchQty fill:#F0E68C
```

---

## 📊 4. SEQUENCE DIAGRAM - Nhập kho FEFO

```mermaid
sequenceDiagram
    actor NV as Nhân viên kho
    participant FE as Admin Frontend
    participant BE as Spring Boot
    participant FEFO as FEFO Service
    participant DB as Database
    
    Note over NV,DB: QUY TRÌNH NHẬP KHO VỚI BATCH & HẠN SỬ DỤNG
    
    NV->>FE: Upload CSV nhập kho
    FE->>FE: Parse CSV file
    
    loop Mỗi dòng trong CSV
        FE->>FE: Validate dữ liệu<br/>(SKU, số lượng, hạn SD, batch)
    end
    
    FE->>BE: POST /api/warehouse/import
    
    BE->>DB: BEGIN TRANSACTION
    BE->>DB: INSERT INTO Phieu_Nhap_Kho
    
    loop Từng sản phẩm
        BE->>DB: INSERT INTO Chi_Tiet_Phieu_Nhap<br/>(id_san_pham, so_luong,<br/>han_su_dung, batch_number)
        BE->>DB: UPDATE San_Pham<br/>SET so_luong_ton += so_luong
    end
    
    BE->>DB: COMMIT TRANSACTION
    
    %% Kiểm tra hàng sắp hết hạn
    BE->>FEFO: checkNearExpiry()
    FEFO->>DB: SELECT * WHERE<br/>han_su_dung < NOW() + INTERVAL 30 DAY
    
    alt Có hàng sắp hết hạn
        FEFO->>DB: INSERT INTO Canh_Bao_Het_Han
        FEFO-->>BE: Near expiry list
        BE->>FE: WebSocket: Cảnh báo hết hạn
        FE->>NV: Hiển thị notification
    end
    
    BE-->>FE: Import thành công
    FE-->>NV: Hiển thị kết quả<br/>"Đã nhập 150 sản phẩm"
```

---

## 📊 5. CLASS DIAGRAM - Domain Model

```mermaid
classDiagram
    %% Core Entities
    class NguoiDung {
        -int idNguoiDung
        -string tenDangNhap
        -string matKhauBam
        -string hoTen
        -string email
        -Role role
        +login()
        +register()
        +verifyEmail()
        +updateProfile()
    }
    
    class SanPham {
        -int idSanPham
        -string tenSanPham
        -decimal gia
        -int soLuongTon
        -DanhMuc danhMuc
        -ThuongHieu thuongHieu
        +checkAvailability()
        +updateStock(int quantity)
        +calculatePrice()
    }
    
    class DonHang {
        -int idDonHang
        -NguoiDung khachHang
        -decimal tongTien
        -string trangThai
        -List~ChiTietDonHang~ chiTiet
        +createOrder()
        +updateStatus(string status)
        +cancelOrder()
        +calculateTotal()
    }
    
    class ChiTietDonHang {
        -int idChiTiet
        -SanPham sanPham
        -int soLuong
        -decimal giaTaiThoiDiem
        +calculateSubtotal()
    }
    
    %% FEFO Related
    class ChiTietPhieuNhap {
        -int idChiTiet
        -SanPham sanPham
        -int soLuong
        -int soLuongConLai
        -Date hanSuDung
        -string batchNumber
        +allocateFEFO(int quantity)
        +isNearExpiry()
        +getRemainingDays()
    }
    
    class PickList {
        -int idPickList
        -DonHang donHang
        -List~PickListItem~ items
        -string trangThai
        +generate()
        +print()
        +markComplete()
    }
    
    class PickListItem {
        -int idItem
        -SanPham sanPham
        -ChiTietPhieuNhap batch
        -int soLuong
        -string viTriKho
        +getExpiryDate()
    }
    
    %% FEFO Service
    class FEFOService {
        +generatePickList(DonHang order)
        +allocateStock(List~OrderItem~ items)
        +checkNearExpiry()
        +getExpiringBatches(int days)
    }
    
    %% Payment
    class ThanhToan {
        -int idThanhToan
        -DonHang donHang
        -decimal soTien
        -string phuongThuc
        -string trangThai
        +processVNPay()
        +verifyPayment()
        +refund()
    }
    
    %% Procurement
    class PhieuGoiThau {
        -int idPhieu
        -string tieuDe
        -Date ngayKetThuc
        -string trangThai
        +publish()
        +close()
        +selectWinner()
    }
    
    class SanPhamDeXuat {
        -int idDeXuat
        -PhieuGoiThau phieuGoiThau
        -NhaCungCap nhaCungCap
        -decimal giaDeXuat
        -string trangThai
        +submit()
        +approve()
        +reject()
    }
    
    %% Relationships
    NguoiDung "1" --> "*" DonHang : places
    DonHang "1" --> "*" ChiTietDonHang : contains
    SanPham "1" --> "*" ChiTietDonHang : in
    SanPham "1" --> "*" ChiTietPhieuNhap : tracked_by
    DonHang "1" --> "0..1" PickList : has
    PickList "1" --> "*" PickListItem : contains
    ChiTietPhieuNhap "1" --> "*" PickListItem : allocated_from
    DonHang "1" --> "1" ThanhToan : pays_with
    PhieuGoiThau "1" --> "*" SanPhamDeXuat : receives
    FEFOService ..> PickList : creates
    FEFOService ..> ChiTietPhieuNhap : queries
```

---

## 📊 6. STATE DIAGRAM - Trạng thái Đơn hàng

```mermaid
stateDiagram-v2
    [*] --> DangCho: Tạo đơn mới<br/>createOrder()
    
    DangCho --> DaXacNhan: Nhân viên xác nhận<br/>confirmOrder()
    DangCho --> DaHuy: Khách/NV hủy<br/>cancelOrder()
    
    DaXacNhan --> DangChuanBi: Tạo pick list<br/>generatePickList()
    DaXacNhan --> DaHuy: Hủy (cần duyệt)<br/>cancelWithApproval()
    
    DangChuanBi --> DangGiaoHang: Đóng gói xong<br/>markReadyForShipping()
    DangChuanBi --> DaHuy: Hủy khẩn<br/>(Admin only)
    
    DangGiaoHang --> HoanThanh: Giao thành công<br/>markDelivered()
    DangGiaoHang --> BiTra: Khách từ chối<br/>customerRefused()
    
    BiTra --> DangXuLyTra: Nhận hàng trả<br/>processReturn()
    DangXuLyTra --> DaHoanTien: Hoàn tiền<br/>refundMoney()
    DangXuLyTra --> DaDoiHang: Đổi hàng mới<br/>exchangeProduct()
    
    HoanThanh --> YeuCauDoiTra: Khách yêu cầu<br/>(trong 7 ngày)<br/>requestReturn()
    YeuCauDoiTra --> DangXuLyTra: Chấp nhận<br/>approveReturn()
    YeuCauDoiTra --> HoanThanh: Từ chối<br/>rejectReturn()
    
    DaHuy --> [*]: Kết thúc
    DaHoanTien --> [*]: Kết thúc
    DaDoiHang --> [*]: Kết thúc
    HoanThanh --> [*]: Kết thúc
    
    note right of DangCho
        Đơn mới tạo
        Chờ xác nhận từ NV
        Có thể hủy tự do
    end note
    
    note right of DangChuanBi
        Nhân viên kho đang
        lấy hàng theo pick list
        Áp dụng FEFO
    end note
    
    note right of DangGiaoHang
        Đang vận chuyển
        Có mã tracking
        Không thể hủy
    end note
    
    note right of HoanThanh
        Giao thành công
        Có thể đánh giá SP
        Đổi trả trong 7 ngày
    end note
```

---

## 📊 7. ARCHITECTURE DIAGRAM - Kiến trúc hệ thống

```mermaid
graph TB
    subgraph "Client Layer - Presentation Tier"
        Web[Web Browser<br/>React.js 18<br/>Material-UI]
        Mobile[Mobile App<br/>React Native<br/>Coming soon]
        Admin[Admin Dashboard<br/>React.js<br/>Chart.js]
    end
    
    subgraph "Load Balancer"
        LB[Nginx<br/>Load Balancer<br/>SSL Termination]
    end
    
    subgraph "Application Tier - Spring Boot"
        API1[Spring Boot Instance 1<br/>Port 8080]
        API2[Spring Boot Instance 2<br/>Port 8081]
        API3[Spring Boot Instance 3<br/>Port 8082]
    end
    
    subgraph "Business Logic - Services"
        direction TB
        AuthSvc[Authentication<br/>Service<br/>JWT + Email Verify]
        OrderSvc[Order Service<br/>Place/Track Orders]
        InvSvc[Inventory Service<br/>FEFO Logic]
        PaySvc[Payment Service<br/>VNPay Integration]
        ProcSvc[Procurement<br/>Service<br/>Tender Process]
        NotifSvc[Notification<br/>Service<br/>Email/SMS]
        ReportSvc[Report Service<br/>Analytics]
    end
    
    subgraph "Data Persistence Layer"
        DB[(MySQL 8.0<br/>Primary Database<br/>25 Tables)]
        DBSlave[(MySQL Replica<br/>Read Operations)]
        Redis[(Redis Cache<br/>Session Store<br/>Cart Data)]
        S3[AWS S3<br/>Images<br/>Documents]
    end
    
    subgraph "External Services"
        VNPay[VNPay Gateway<br/>Payment Processing]
        EmailSvc[SendGrid<br/>Email Service]
        SMSGw[SMS Gateway<br/>Twilio]
    end
    
    subgraph "Monitoring & Logging"
        Prometheus[Prometheus<br/>Metrics]
        Grafana[Grafana<br/>Dashboards]
        ELK[ELK Stack<br/>Centralized Logs]
    end
    
    %% Connections - Client to LB
    Web --> LB
    Mobile -.-> LB
    Admin --> LB
    
    %% LB to App Servers
    LB --> API1
    LB --> API2
    LB --> API3
    
    %% App to Services
    API1 --> AuthSvc
    API1 --> OrderSvc
    API2 --> InvSvc
    API2 --> PaySvc
    API3 --> ProcSvc
    API3 --> NotifSvc
    API3 --> ReportSvc
    
    %% Services to Data
    AuthSvc --> DB
    AuthSvc --> Redis
    OrderSvc --> DB
    OrderSvc --> Redis
    InvSvc --> DB
    InvSvc --> Redis
    PaySvc --> DB
    ProcSvc --> DB
    ReportSvc --> DBSlave
    
    %% File Storage
    OrderSvc --> S3
    InvSvc --> S3
    ProcSvc --> S3
    
    %% External Integrations
    PaySvc --> VNPay
    NotifSvc --> EmailSvc
    NotifSvc --> SMSGw
    
    %% Monitoring
    API1 -.-> Prometheus
    API2 -.-> Prometheus
    API3 -.-> Prometheus
    Prometheus --> Grafana
    API1 -.-> ELK
    API2 -.-> ELK
    API3 -.-> ELK
    
    %% Styling
    style Web fill:#E3F2FD
    style Admin fill:#E3F2FD
    style LB fill:#FFF9C4
    style DB fill:#FFCCBC
    style Redis fill:#FFE0B2
    style S3 fill:#C8E6C9
    style VNPay fill:#F8BBD0
    style InvSvc fill:#BBDEFB
    style OrderSvc fill:#BBDEFB
```

---

## 🎯 Cách sử dụng

### 1. Xem trong VS Code:
```bash
# Cài extension
"Markdown Preview Mermaid Support"

# Mở file này
# Nhấn Ctrl+Shift+V
# Tất cả sơ đồ hiển thị!
```

### 2. Export PNG:
```bash
npm install -g @mermaid-js/mermaid-cli
mmdc -i ALL_DIAGRAMS_COMPLETE.md -o diagrams.png
```

### 3. Copy từng sơ đồ:
- Copy code của sơ đồ cần dùng
- Paste vào https://mermaid.live/
- Chỉnh sửa và download

---

**Đã hoàn thành: 7 loại sơ đồ chính cho luận văn!**