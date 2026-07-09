# Sơ đồ hệ thống PerfumeShop (Mermaid)

Tài liệu tổng hợp toàn bộ sơ đồ của hệ thống: kiến trúc, ERD, chức năng, luồng nghiệp vụ và trạng thái.
Nguồn: đọc trực tiếp từ source code backend (entity, service, controller) và frontend.

---

## 1. Kiến trúc tổng thể

```mermaid
flowchart LR
    subgraph Client["Người dùng"]
        KH["Khách hàng"]
        NV["Nhân viên / Admin"]
        NCC["Nhà cung cấp"]
    end

    subgraph FE["Frontend - React (perfumeshop-frontend-s)"]
        PUB["Trang public\nTrangChu, DanhMuc, ChiTietSanPham,\nGioHang, ThanhToan, LichSuDonHang"]
        ADM["Trang admin CMS\nDashboard, Orders, Products, Kho,\nProcurement, Reports, Returns..."]
        SUP["Cổng NCC\nSupplierPortal, ProcurementPortal,\nSupplierProposeProduct"]
        API_LAYER["services/api\nbaseApi + JWT Bearer"]
    end

    subgraph BE["Backend - Spring Boot (perfumeshop-backend)"]
        SEC["SecurityConfig + JwtAuthenticationFilter\nphân quyền theo ROLE"]
        CTRL["Controllers\n/api/..."]
        SVC["Services\nCheckout, DonHang, Kho, FEFO,\nProcurement, Payment, Return..."]
        REPO["Repositories - Spring Data JPA"]
    end

    DB[("MySQL\nperfumeshop")]
    PAYOS["PayOS\nCổng thanh toán"]
    MAIL["Email Service\nxác thực email"]

    KH --> PUB
    NV --> ADM
    NCC --> SUP
    PUB & ADM & SUP --> API_LAYER
    API_LAYER -->|"HTTP + JWT"| SEC --> CTRL --> SVC --> REPO --> DB
    SVC <--> PAYOS
    SVC --> MAIL
```

---

## 2. Sơ đồ thực thể quan hệ (ERD)

```mermaid
erDiagram
    NGUOI_DUNG {
        int id_nguoi_dung PK
        string ten_dang_nhap UK
        string mat_khau_bam
        string ho_ten
        string so_dien_thoai
        string dia_chi
        string email
        boolean is_verified
        string vai_tro "CUSTOMER | SUPPLIER"
        string verification_token
        datetime token_expiry_time
    }

    NHAN_VIEN {
        int id_nhan_vien PK
        string ten_dang_nhap UK
        string mat_khau_bam
        string ho_ten
        string vai_tro "ADMIN | DIRECTOR | STORE_MANAGER | WAREHOUSE_STAFF"
    }

    DANH_MUC {
        int id_danh_muc PK
        string ten_danh_muc
    }

    THUONG_HIEU {
        int id_thuong_hieu PK
        string ten_thuong_hieu UK
        string url_hinh_anh
    }

    SAN_PHAM {
        int id_san_pham PK
        string ten_san_pham
        string mo_ta
        string url_hinh_anh
        decimal gia_ban
        int dung_tich_ml
        int nong_do
        int so_luong_ton_kho
        int so_luong_hang_loi
        int phan_tram_giam
        datetime ngay_bat_dau_giam
        datetime ngay_ket_thuc_giam
        int id_danh_muc FK
        int id_thuong_hieu FK
    }

    SU_KIEN {
        int id_su_kien PK
        string ten_su_kien
        string banner_url
        datetime ngay_bat_dau
        datetime ngay_ket_thuc
        boolean trang_thai_active
        decimal giam_gia_hang_loat
    }

    SU_KIEN_SAN_PHAM {
        int id_su_kien FK
        int id_san_pham FK
    }

    DON_HANG {
        int id_don_hang PK
        int id_nguoi_dung FK
        int id_nhan_vien FK
        string trang_thai_van_hanh "Dang cho | Da xac nhan | Dang giao | Hoan thanh | Da huy | Cho hang"
        string trang_thai_thanh_toan "Chua TT | Cho TT | Da TT | Da hoan tien"
        decimal tong_tien
        string ma_van_don
        string so_dien_thoai
        string phuong_thuc_thanh_toan "COD | online"
        string ten_nguoi_nhan
        string dia_chi_giao_hang
        datetime ngay_dat_hang
        datetime ngay_hoan_thanh
        string ly_do_huy
        string ghi_chu
        int id_su_kien FK
        decimal giam_gia_hang_loat
    }

    CHI_TIET_DON_HANG {
        int id_chi_tiet_don_hang PK
        int id_don_hang FK
        int id_san_pham FK
        int so_luong
        decimal gia_tai_thoi_diem_mua
        int id_phieu FK "lô nhập FEFO - traceability"
    }

    PHIEU_NHAP_KHO {
        int id_phieu PK
        string ma_phieu UK
        int id_nhan_vien FK
        string nha_cung_cap
        datetime ngay_nhap
        string ghi_chu
        decimal gia_ban_chot
        string trang_thai "CHO_KHO_KIEM_TRA | CHO_ADMIN_DUYET | DA_NHAP | BI_TU_CHOI"
    }

    CHI_TIET_PHIEU_NHAP {
        int id PK
        int id_phieu FK
        int id_san_pham FK
        string ten_san_pham_snapshot
        int so_luong
        decimal gia_nhap
        int so_luong_thuc_nhan
        int so_luong_loi
        int so_luong_con_lai "FEFO"
        date han_su_dung
        string so_lo
        string url_hinh_anh_moi
        string ghi_chu_kho
    }

    PHIEU_NHAP_TAM {
        int id PK
        string id_session "UUID nhom upload"
        string ten_san_pham_csv
        int id_san_pham FK
        int so_luong
        decimal gia_nhap
        date han_su_dung
        string so_lo
        string trang_thai "OK | CHUA_MAP | LOI"
        string loi
        int dong_so
        datetime ngay_tao
    }

    BIEN_DONG_KHO {
        int id PK
        int id_san_pham FK
        string ten_san_pham_snapshot
        string loai "NHAP | XUAT_BAN | HOAN_KHO | XUAT_LOI | DIEU_CHINH"
        int so_luong
        int ton_kho_sau
        string ly_do
        int id_don_hang FK
        int id_phieu_nhap FK
        int id_nhan_vien FK
        datetime ngay_tao
    }

    PHIEU_GOI_THAU {
        int id_phieu_goi_thau PK
        string ma_phieu UK
        string trang_thai "OPEN | CLOSED"
        string ghi_chu
        date han_chot
        int id_nhan_vien_tao FK
        datetime ngay_tao
        datetime ngay_cap_nhat
    }

    CHI_TIET_GOI_THAU {
        int id_chi_tiet PK
        int id_phieu_goi_thau FK
        int id_san_pham FK
        string ten_san_pham_snapshot
        int so_luong_can_nhap
        int ton_kho_hien_tai
        decimal gia_ban_hien_tai
        string ghi_chu
    }

    BAO_GIA_NCC {
        int id_bao_gia PK
        int id_phieu_goi_thau FK
        string ten_ncc
        string lien_he_ncc
        string trang_thai "CHO_DUYET | TRUNG_THAU | ROT_THAU"
        decimal gia_nhap_de_xuat
        decimal phan_tram_bien_do
        decimal gia_ban_chot
        date han_su_dung
        string so_lo
        datetime ngay_tao
    }

    SAN_PHAM_DE_XUAT {
        int id_san_pham_de_xuat PK
        int id_phieu_goi_thau FK "null neu de xuat doc lap"
        string ten_ncc
        string lien_he_ncc
        string ten_san_pham
        string mo_ta
        string url_hinh_anh
        decimal gia_de_xuat
        int so_luong_co_the_cung_cap
        int dung_tich_ml
        int nong_do
        string trang_thai "PENDING | APPROVED | REJECTED"
        int id_san_pham_tao_ra FK
        int id_san_pham_khop FK
        date han_su_dung
        string so_lo
        string phan_hoi_admin
        datetime ngay_tao
        datetime ngay_xu_ly
        int id_nhan_vien_xu_ly FK
    }

    PHIEU_DOI_TRA {
        int id_doi_tra PK
        int id_don_hang FK
        int id_nguoi_dung FK
        int id_nhan_vien FK
        string ly_do
        string ly_do_tu_choi
        string ghi_chu_noi_bo
        decimal so_tien_hoan
        datetime ngay_hoan_tien
        string trang_thai "Cho duyet | Cho hoan tien | Hoan tien thanh cong | Tu choi"
        datetime ngay_tao
    }

    DANH_GIA_SAN_PHAM {
        int id_danh_gia PK
        int id_san_pham FK
        int id_nguoi_dung FK
        int diem_danh_gia
        string binh_luan
        datetime ngay_tao
    }

    %% ── Quan hệ ──
    DANH_MUC ||--o{ SAN_PHAM : "phan loai"
    THUONG_HIEU ||--o{ SAN_PHAM : "thuoc"

    NGUOI_DUNG ||--o{ DON_HANG : "dat"
    NHAN_VIEN ||--o{ DON_HANG : "xu ly"
    DON_HANG ||--|{ CHI_TIET_DON_HANG : "gom"
    SAN_PHAM ||--o{ CHI_TIET_DON_HANG : "duoc mua"
    PHIEU_NHAP_KHO ||--o{ CHI_TIET_DON_HANG : "lo FEFO gan khi dat"
    SU_KIEN ||--o{ DON_HANG : "ap dung"
    SU_KIEN ||--o{ SU_KIEN_SAN_PHAM : ""
    SAN_PHAM ||--o{ SU_KIEN_SAN_PHAM : ""

    NHAN_VIEN ||--o{ PHIEU_NHAP_KHO : "tao / duyet"
    PHIEU_NHAP_KHO ||--|{ CHI_TIET_PHIEU_NHAP : "gom"
    SAN_PHAM ||--o{ CHI_TIET_PHIEU_NHAP : "duoc nhap"
    SAN_PHAM ||--o{ PHIEU_NHAP_TAM : "map"

    SAN_PHAM ||--o{ BIEN_DONG_KHO : "lich su ton kho"
    DON_HANG ||--o{ BIEN_DONG_KHO : "phat sinh"
    PHIEU_NHAP_KHO ||--o{ BIEN_DONG_KHO : "phat sinh"

    NHAN_VIEN ||--o{ PHIEU_GOI_THAU : "tao"
    PHIEU_GOI_THAU ||--|{ CHI_TIET_GOI_THAU : "gom"
    SAN_PHAM ||--o{ CHI_TIET_GOI_THAU : "can nhap"
    PHIEU_GOI_THAU ||--o{ BAO_GIA_NCC : "nhan bao gia"
    PHIEU_GOI_THAU |o--o{ SAN_PHAM_DE_XUAT : "de xuat trong phieu"
    SAN_PHAM |o--o{ SAN_PHAM_DE_XUAT : "tao ra / khop"
    NHAN_VIEN ||--o{ SAN_PHAM_DE_XUAT : "duyet"

    DON_HANG ||--o{ PHIEU_DOI_TRA : "yeu cau"
    NGUOI_DUNG ||--o{ PHIEU_DOI_TRA : "tao"
    NHAN_VIEN ||--o{ PHIEU_DOI_TRA : "xu ly"

    SAN_PHAM ||--o{ DANH_GIA_SAN_PHAM : "duoc danh gia"
    NGUOI_DUNG ||--o{ DANH_GIA_SAN_PHAM : "viet"
```

---

## 3. Sơ đồ chức năng theo vai trò (Use Case)

```mermaid
flowchart TB
    subgraph KH["🛒 Khách hàng (CUSTOMER)"]
        K1["Đăng ký / Đăng nhập / Xác thực email"]
        K2["Xem catalog: tìm kiếm, lọc theo danh mục,\nthương hiệu, nồng độ, dung tích, giá"]
        K3["Giỏ hàng: thêm / sửa / xóa"]
        K4["Đặt hàng: COD hoặc PayOS online"]
        K5["Lịch sử đơn hàng, hủy đơn"]
        K6["Yêu cầu đổi trả"]
        K7["Đánh giá sản phẩm đã mua"]
        K8["Cập nhật hồ sơ, đổi mật khẩu"]
    end

    subgraph NCC["🏭 Nhà cung cấp (SUPPLIER)"]
        S1["Xem phiếu gọi thầu đang mở"]
        S2["Gửi báo giá cho phiếu gọi thầu\n(kèm HSD, số lô)"]
        S3["Đề xuất sản phẩm trong phiếu"]
        S4["Đề xuất sản phẩm độc lập"]
        S5["Đề xuất hàng loạt qua Excel/CSV\n(preview → confirm)"]
    end

    subgraph QL["👔 ADMIN / DIRECTOR / STORE_MANAGER"]
        A1["Dashboard: thống kê, cảnh báo"]
        A2["Quản lý sản phẩm / danh mục / thương hiệu\n(DELETE chỉ ADMIN)"]
        A3["Quản lý đơn hàng: xác nhận (trừ kho FEFO),\ngiao hàng, hoàn thành, hủy, hoàn tiền"]
        A4["Gọi thầu: tạo phiếu (gợi ý SP sắp hết kho\n+ sales velocity), so sánh báo giá, chốt thầu"]
        A5["Duyệt / từ chối SP đề xuất của NCC\n(đơn lẻ + hàng loạt) → sinh PO"]
        A6["Duyệt cuối PO: cộng kho + áp giá bán"]
        A7["Duyệt đổi trả: hoàn tiền / từ chối"]
        A8["Campaign khuyến mãi (sự kiện, giảm giá loạt)"]
        A9["Báo cáo doanh thu, top SP, xuất Excel\n(ADMIN + DIRECTOR)"]
        A10["Quản lý nhân viên (chỉ ADMIN)\nQuản lý khách hàng (ADMIN + DIRECTOR)"]
        A11["Quản lý đánh giá sản phẩm"]
    end

    subgraph KHO["📦 WAREHOUSE_STAFF (+ cấp trên)"]
        W1["Kiểm hàng PO: nhập số thực nhận,\nsố lỗi, HSD, số lô"]
        W2["Nhập kho CSV/Excel: preview staging,\nsửa dòng, confirm cộng kho"]
        W3["Xem lô hàng (FEFO), cảnh báo cận date"]
        W4["Lịch sử biến động kho, hàng bán chậm"]
        W5["Xuất hàng lỗi trả NCC"]
    end
```

---

## 4. Luồng đặt hàng & thanh toán

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    participant FE as Frontend
    participant CO as CheckoutService
    participant FEFO as FEFOService
    participant PAY as PaymentService
    participant PayOS as PayOS
    participant DB as MySQL

    KH->>FE: Chọn SP → Giỏ hàng → Thanh toán
    FE->>CO: POST /api/dat-hang (items, địa chỉ, PTTT)
    CO->>DB: Kiểm tra tồn kho từng SP
    CO->>FEFO: allocateOrderItemFromBatch (gắn lô cận date - traceability)
    Note over CO: KHÔNG trừ kho lúc đặt<br/>Giá = giaHienTai (đã áp khuyến mãi)
    CO->>DB: Lưu DonHang + ChiTietDonHang<br/>trạng thái "Đang chờ" (đủ hàng) / "Chờ hàng"
    CO->>DB: Xóa giỏ hàng

    alt Thanh toán online (PayOS)
        FE->>PAY: POST /api/payment/create-link
        PAY->>PayOS: Tạo payment link
        PayOS-->>FE: checkoutUrl → redirect
        KH->>PayOS: Quét VietQR / thanh toán
        PayOS->>PAY: Webhook /api/payment/webhook
        PAY->>DB: trangThaiThanhToan = "Đã thanh toán"
    else COD
        Note over KH,DB: trangThaiThanhToan = "Chưa thanh toán"<br/>thu tiền khi giao
    end
```

---

## 5. Luồng admin xác nhận đơn - trừ kho FEFO multi-batch

```mermaid
sequenceDiagram
    autonumber
    actor AD as Admin/Quản lý
    participant DH as DonHangService
    participant SP as SanPhamRepository
    participant FEFO as FEFOService
    participant DB as MySQL

    AD->>DH: POST /api/don-hang/{id}/xac-nhan
    DH->>DH: Kiểm tra trạng thái "Đang chờ"
    alt Đơn online chưa thanh toán
        DH-->>AD: ❌ Chặn: chờ khách thanh toán
    end
    loop Từng sản phẩm trong đơn
        DH->>SP: decrementStock (atomic, WHERE tồn >= qty)
        alt Không đủ tồn
            SP-->>DH: 0 rows → ❌ BusinessException
        end
        DH->>FEFO: deductFEFOOnConfirm(idSanPham, soLuong)
        Note over FEFO: Lấy các dòng lô của ĐÚNG SP,<br/>sắp theo HSD tăng dần.<br/>Lô 1 hết → trừ tiếp lô 2...
        FEFO->>DB: UPDATE so_luong_con_lai theo từng dòng lô
    end
    DH->>DB: trangThaiVanHanh = "Đã xác nhận"

    Note over AD,DB: Tiếp theo: giao hàng → hoàn thành<br/>(tự đánh dấu đã thanh toán COD)
```

---

## 6. Luồng NCC chào hàng → Admin duyệt → Kho kiểm → Cộng kho

```mermaid
sequenceDiagram
    autonumber
    actor NCC as Nhà cung cấp
    actor AD as Admin/Quản lý
    actor KHO as Nhân viên kho
    participant PS as ProcurementService
    participant KS as KhoService
    participant DB as MySQL

    rect rgb(235, 245, 255)
    Note over NCC,DB: GIAI ĐOẠN 1 — NCC chào hàng (public)
    alt Đề xuất đơn lẻ
        NCC->>PS: POST /de-xuat-san-pham-doc-lap<br/>(tên SP, giá, SL, HSD, số lô)
    else Hàng loạt Excel/CSV
        NCC->>PS: POST /bulk-preview (file)
        PS-->>NCC: sessionId + preview (OK/LOI)
        NCC->>PS: POST /bulk-confirm
    end
    PS->>DB: SanPhamDeXuat trạng thái PENDING<br/>(tự khớp idSanPhamKhop nếu trùng tên)
    end

    rect rgb(235, 255, 240)
    Note over AD,DB: GIAI ĐOẠN 2 — Admin duyệt đề xuất
    AD->>PS: POST /san-pham-de-xuat/{id}/duyet<br/>(% biên độ, SL nhập, danh mục, thương hiệu)
    PS->>PS: giaBanChot = giáNhập × (1 + %/100)
    alt SP chưa tồn tại
        PS->>DB: Tạo SanPham mới, tồn kho = 0
    else SP đã có (trùng tên)
        PS->>DB: Dùng SP có sẵn
    end
    PS->>DB: Tạo PO trạng thái CHO_KHO_KIEM_TRA<br/>(chưa cộng kho, chưa áp giá)
    PS->>DB: Đề xuất → APPROVED
    end

    rect rgb(255, 250, 235)
    Note over KHO,DB: GIAI ĐOẠN 3 — Kho kiểm hàng thực tế
    KHO->>KS: POST /api/kho/po/{id}/kho-xac-nhan<br/>(soLuongThucNhan, soLuongLoi, HSD, số lô)
    KS->>KS: Validate: lỗi ≤ thực nhận
    KS->>DB: PO → CHO_ADMIN_DUYET
    end

    rect rgb(255, 240, 240)
    Note over AD,DB: GIAI ĐOẠN 4 — Admin duyệt cuối → CỘNG KHO
    AD->>KS: POST /api/kho/po/{id}/admin-duyet-cuoi
    loop Từng dòng chi tiết PO
        KS->>DB: soLuongTonKho += (thựcNhận − lỗi)
        KS->>DB: soLuongConLai = hàng tốt (lô FEFO)
        KS->>DB: soLuongHangLoi += lỗi
        KS->>DB: giaBan = giaBanChot
        KS->>DB: Ghi BienDongKho: NHAP + XUAT_LOI
    end
    KS->>DB: PO → DA_NHAP ✅
    end

    opt Admin từ chối
        AD->>KS: POST /admin-tu-choi (lý do)
        KS->>DB: PO → BI_TU_CHOI (không cộng kho)
    end
```

---

## 7. Luồng gọi thầu cạnh tranh

```mermaid
sequenceDiagram
    autonumber
    actor AD as Admin
    actor NCC as Các NCC
    participant PS as ProcurementService
    participant DB as MySQL

    AD->>PS: GET /sap-het-kho?nguong=5
    PS-->>AD: SP sắp hết + Sales Velocity<br/>(tốc độ bán V, SL gợi ý Q = V×30 + V×5 − tồn)
    AD->>PS: POST /tao-phieu (danh sách SP, SL cần, hạn chót)
    PS->>DB: PhieuGoiThau OPEN + ChiTietGoiThau

    NCC->>PS: GET /public — xem phiếu đang mở
    NCC->>PS: POST /{id}/bao-gia (giá nhập, HSD, số lô)
    PS->>DB: BaoGiaNCC CHO_DUYET

    AD->>PS: GET /{id}/bao-gia — so sánh các báo giá
    AD->>PS: POST /{id}/chot-thau/{idBaoGia} (% biên độ)
    PS->>DB: Báo giá chọn → TRUNG_THAU<br/>các báo giá khác → ROT_THAU
    PS->>DB: Phiếu → CLOSED
    PS->>DB: Sinh PO CHO_KHO_KIEM_TRA<br/>(toàn bộ SP trong phiếu, giá nhập trúng thầu)
    Note over PS,DB: Tiếp tục Giai đoạn 3-4 như luồng NCC chào hàng
```

---

## 8. Luồng nhập kho thủ công qua CSV/Excel

```mermaid
flowchart TD
    A["Kho upload file CSV/Excel"] --> B["POST /api/kho/import-preview"]
    B --> C["Parse file → PhieuNhapTam (staging)\ngắn sessionId UUID"]
    C --> D{"Map sản phẩm?"}
    D -->|"Có id_san_pham hợp lệ"| E["Trạng thái OK"]
    D -->|"Khớp tên (exact / contains)"| E
    D -->|"Không tìm thấy"| F["CHUA_MAP"]
    D -->|"Thiếu SL / sai format"| G["LOI"]
    E & F & G --> H["Màn hình preview"]
    H --> I["Sửa dòng: PUT /row/{id}\nXóa dòng: DELETE /row/{id}\nThêm dòng: POST /{session}/row"]
    I --> H
    H --> J["POST /api/kho/import-confirm"]
    J --> K["Chỉ các dòng OK:\n- Cộng soLuongTonKho\n- Tạo PhieuNhapKho DA_NHAP + chi tiết\n- soLuongConLai = SL (lô FEFO)\n- Ghi BienDongKho NHAP"]
    K --> L["Xóa staging theo sessionId"]
```

---

## 9. Luồng đổi trả & hoàn tiền

```mermaid
sequenceDiagram
    autonumber
    actor KH as Khách hàng
    actor AD as Admin/Quản lý
    participant RS as ReturnService
    participant DB as MySQL

    KH->>RS: POST /api/doi-tra (đơn "Hoàn thành", lý do)
    RS->>DB: PhieuDoiTra "Chờ duyệt"
    AD->>RS: GET /api/doi-tra/cho-duyet
    alt Duyệt
        AD->>RS: POST /{id}/duyet (hoanKho true/false, số tiền hoàn)
        alt Hàng tốt - hoàn kho
            RS->>DB: soLuongTonKho += SL, ghi BienDongKho HOAN_KHO
        else Hàng lỗi - không hoàn kho
            RS->>DB: soLuongHangLoi += SL (chờ trả NCC)
        end
        RS->>DB: Phiếu → "Chờ hoàn tiền"
        AD->>RS: POST /{id}/xac-nhan-hoan-tien
        RS->>DB: Phiếu → "Hoàn tiền thành công"
    else Từ chối
        AD->>RS: POST /{id}/tu-choi (lý do)
        RS->>DB: Phiếu → "Từ chối"
    end
```

---

## 10. Trạng thái đơn hàng

```mermaid
stateDiagram-v2
    [*] --> DangCho : Đặt hàng (đủ tồn kho)
    [*] --> ChoHang : Đặt hàng (thiếu tồn kho)

    DangCho : Đang chờ
    ChoHang : Chờ hàng
    DaXacNhan : Đã xác nhận (đã trừ kho FEFO)
    DangGiao : Đang giao hàng
    HoanThanh : Hoàn thành (auto đã thanh toán)
    DaHuy : Đã hủy

    ChoHang --> DangCho : Có hàng lại
    DangCho --> DaXacNhan : Admin xác nhận<br/>(online phải đã thanh toán)
    DaXacNhan --> DangGiao : Giao hàng + mã vận đơn
    DangGiao --> HoanThanh : Giao thành công
    DangCho --> DaHuy : Khách / Admin hủy
    DaXacNhan --> DaHuy : Hủy → HOÀN KHO<br/>(tồn + lô FEFO)
    HoanThanh --> [*]
    DaHuy --> [*] : Có thể đánh dấu hoàn tiền<br/>nếu đã thanh toán

    note right of DaXacNhan
        Trừ kho tại đây:
        1. decrementStock (atomic)
        2. FEFO multi-batch deduct
    end note
```

### Trạng thái thanh toán

```mermaid
stateDiagram-v2
    [*] --> ChuaTT : COD
    [*] --> ChoTT : Online (PayOS)
    ChuaTT : Chưa thanh toán
    ChoTT : Chờ thanh toán
    DaTT : Đã thanh toán
    HoanTien : Đã hoàn tiền

    ChoTT --> DaTT : PayOS webhook
    ChuaTT --> DaTT : Đơn hoàn thành (COD)
    DaTT --> HoanTien : Đơn đã hủy + admin hoàn tiền
```

---

## 11. Trạng thái phiếu nhập kho (PO)

```mermaid
stateDiagram-v2
    [*] --> CHO_KHO_KIEM_TRA : Chốt thầu / Duyệt đề xuất NCC
    [*] --> DA_NHAP : Import CSV/Excel thủ công<br/>(cộng kho ngay)

    CHO_KHO_KIEM_TRA --> CHO_ADMIN_DUYET : Kho xác nhận<br/>(thực nhận, lỗi, HSD, số lô)
    CHO_ADMIN_DUYET --> DA_NHAP : Admin duyệt cuối<br/>✅ Cộng kho + áp giá bán
    CHO_ADMIN_DUYET --> BI_TU_CHOI : Admin từ chối (kèm lý do)

    DA_NHAP --> [*]
    BI_TU_CHOI --> [*]
```

---

## 12. Trạng thái gọi thầu / báo giá / đề xuất / đổi trả

```mermaid
stateDiagram-v2
    state "Phiếu gọi thầu" as PGT {
        [*] --> OPEN : Admin tạo
        OPEN --> CLOSED : Chốt thầu
        CLOSED --> [*]
    }

    state "Báo giá NCC" as BG {
        [*] --> CHO_DUYET : NCC gửi
        CHO_DUYET --> TRUNG_THAU : Được chọn → sinh PO
        CHO_DUYET --> ROT_THAU : Không được chọn
    }

    state "Sản phẩm đề xuất" as DX {
        [*] --> PENDING : NCC đề xuất
        PENDING --> APPROVED : Duyệt → tạo SP + PO
        PENDING --> REJECTED : Từ chối (kèm phản hồi)
    }

    state "Phiếu đổi trả" as DT {
        [*] --> ChoDuyet : Khách yêu cầu
        ChoDuyet : Chờ duyệt
        ChoHoanTien : Chờ hoàn tiền
        HoanTienOK : Hoàn tiền thành công
        TuChoi : Từ chối
        ChoDuyet --> ChoHoanTien : Duyệt (hoàn kho / hàng lỗi)
        ChoHoanTien --> HoanTienOK : Xác nhận đã chuyển tiền
        ChoDuyet --> TuChoi : Từ chối
    }
```

---

## 13. Phân quyền hệ thống (RBAC)

```mermaid
flowchart TD
    subgraph Roles["Vai trò"]
        ADMIN["ADMIN (root)"]
        DIR["DIRECTOR"]
        SM["STORE_MANAGER"]
        WH["WAREHOUSE_STAFF"]
        SUP["SUPPLIER"]
        CUS["CUSTOMER"]
        PUB["Public (không login)"]
    end

    ADMIN -->|"tất cả quyền dưới +"| P1["Quản lý nhân viên<br/>DELETE SP / danh mục / thương hiệu / campaign"]
    DIR -->|"kế thừa xuống"| P2["Quản lý khách hàng · Dashboard · Báo cáo"]
    SM --> P3["CRUD sản phẩm (POST/PUT) · Gọi thầu · Duyệt đề xuất<br/>Campaign · Duyệt đổi trả · Duyệt cuối PO · Quản lý review"]
    WH --> P4["Kho: kiểm hàng PO, import CSV,<br/>lô hàng, biến động (KHÔNG duyệt cuối PO)"]
    CUS --> P5["Giỏ hàng · Đặt hàng · Lịch sử ·<br/>Đổi trả · Đánh giá · Hồ sơ"]
    SUP --> P6["Cổng NCC (các endpoint public)"]
    PUB --> P7["Xem catalog · Đăng ký/Đăng nhập ·<br/>Chào giá & đề xuất NCC · PayOS webhook"]

    style ADMIN fill:#fecaca
    style DIR fill:#fed7aa
    style SM fill:#fef08a
    style WH fill:#bbf7d0
    style CUS fill:#bfdbfe
    style SUP fill:#e9d5ff
    style PUB fill:#e5e7eb
```

---

## 14. Cảnh báo & phân tích kho (FEFO / Sales Velocity)

```mermaid
flowchart LR
    subgraph Input["Dữ liệu"]
        L["Lô hàng<br/>(chi_tiet_phieu_nhap:<br/>HSD, số lô, còn lại)"]
        B["Bán hàng<br/>(chi_tiet_don_hang<br/>đơn Hoàn thành)"]
        T["Tồn kho<br/>(san_pham)"]
    end

    subgraph Analytics["Phân tích"]
        FEFO["FEFO<br/>xuất lô cận date trước"]
        NE["Cảnh báo cận date<br/>HSD < 3 tháng"]
        SV["Sales Velocity<br/>V = bán ra / số ngày<br/>Q gợi ý = V×30 + V×5 − tồn"]
        LOW["Sắp hết kho<br/>tồn < ngưỡng"]
        SLOW["Bán chậm<br/>tồn cao"]
    end

    subgraph Output["Hành động"]
        O1["Trừ kho đúng lô khi xác nhận đơn"]
        O2["Widget dashboard cận date"]
        O3["Gợi ý SL khi tạo phiếu gọi thầu"]
        O4["Đề xuất khuyến mãi xả hàng"]
    end

    L --> FEFO --> O1
    L --> NE --> O2
    B & T --> SV --> O3
    T --> LOW --> O3
    T --> SLOW --> O4
```
