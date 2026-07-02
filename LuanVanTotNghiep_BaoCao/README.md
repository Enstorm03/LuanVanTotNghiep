# BÁO CÁO LUẬN VĂN TỐT NGHIỆP

## HỆ THỐNG QUẢN LÝ BÁN HÀNG VÀ KHO NƯỚC HOA TRỰC TUYẾN

---

## 📚 Giới thiệu

Đây là bộ tài liệu báo cáo luận văn tốt nghiệp đầy đủ cho đề tài "Hệ thống quản lý bán hàng và kho nước hoa trực tuyến". Tài liệu được tổ chức theo chuẩn luận văn đại học, bao gồm đầy đủ các chương từ giới thiệu đến kết luận và phụ lục.

---

## 📁 Cấu trúc thư mục

```
LuanVanTotNghiep_BaoCao/
├── 00_BIA.md                          # Bìa luận văn
├── 01_LOI_CAM_ON.md                   # Lời cảm ơn
├── 02_MUC_LUC.md                      # Mục lục chi tiết
├── 03_TOM_TAT.md                      # Tóm tắt đề tài
├── 04_DANH_MUC.md                     # Danh mục hình ảnh, bảng biểu, từ viết tắt
│
├── CHUONG_1_GIOI_THIEU.md             # Chương 1: Giới thiệu
├── CHUONG_2_CO_SO_LY_THUYET.md        # Chương 2: Cơ sở lý thuyết
├── CHUONG_3_PHAN_TICH_HE_THONG.md     # Chương 3: Phân tích hệ thống
├── CHUONG_4_THIET_KE_HE_THONG.md      # Chương 4: Thiết kế hệ thống
├── CHUONG_5_TRIEN_KHAI_HE_THONG.md    # Chương 5: Triển khai hệ thống
├── CHUONG_6_KIEM_THU_VA_DANH_GIA.md   # Chương 6: Kiểm thử và đánh giá
├── CHUONG_7_KET_LUAN.md               # Chương 7: Kết luận và hướng phát triển
│
├── TAI_LIEU_THAM_KHAO.md              # Tài liệu tham khảo
│
├── PHU_LUC_A_HUONG_DAN_CAI_DAT.md     # Phụ lục A: Hướng dẫn cài đặt
├── PHU_LUC_B_HUONG_DAN_SU_DUNG.md     # Phụ lục B: Hướng dẫn sử dụng
├── PHU_LUC_C_SOURCE_CODE.md           # Phụ lục C: Source code quan trọng
├── PHU_LUC_D_API_DOCUMENTATION.md     # Phụ lục D: API Documentation
├── PHU_LUC_E_DATABASE_SCHEMA.md       # Phụ lục E: Database Schema
├── PHU_LUC_F_KHAO_SAT_NGUOI_DUNG.md   # Phụ lục F: Khảo sát người dùng
│
└── images/                            # Thư mục chứa hình ảnh minh họa
    ├── system_architecture/
    ├── database_design/
    ├── user_interface/
    ├── use_cases/
    ├── sequence_diagrams/
    └── screenshots/
```

---

## 📖 Nội dung các chương

### Chương 1: Giới thiệu
- Lý do chọn đề tài
- Mục tiêu nghiên cứu (tổng quát và cụ thể)
- Đối tượng và phạm vi nghiên cứu
- Phương pháp nghiên cứu
- Bố cục luận văn

### Chương 2: Cơ sở lý thuyết
- Tổng quan về thương mại điện tử
- Công nghệ sử dụng (React.js, Spring Boot, MySQL, VNPay)
- Các mô hình và phương pháp luận (MVC, RESTful API, Agile Scrum)
- Quản lý kho hàng (FEFO)
- Hệ thống phân quyền (RBAC)
- Tổng quan các hệ thống tương tự

### Chương 3: Phân tích hệ thống
- Phân tích yêu cầu (chức năng và phi chức năng)
- Phân tích các tác nhân (6 vai trò)
- Phân tích nghiệp vụ (quy trình chi tiết)
- Biểu đồ Use Case
- Phân tích dữ liệu và ERD

### Chương 4: Thiết kế hệ thống
- Kiến trúc tổng quan (Layered Architecture)
- Thiết kế cơ sở dữ liệu chi tiết
- Thiết kế API (RESTful)
- Thiết kế giao diện (Wireframe, Mockup)
- Thiết kế bảo mật
- Biểu đồ tuần tự và biểu đồ lớp

### Chương 5: Triển khai hệ thống
- Môi trường phát triển
- Cài đặt và cấu hình
- Triển khai các module chính
- Các tính năng nổi bật (FEFO, Sales Velocity, Procurement)
- Demo hệ thống

### Chương 6: Kiểm thử và đánh giá
- Kế hoạch kiểm thử
- Kiểm thử đơn vị, tích hợp, hệ thống
- Kiểm thử người dùng (UAT)
- Kết quả kiểm thử
- Đánh giá ưu nhược điểm

### Chương 7: Kết luận và hướng phát triển
- Tổng kết công việc đã thực hiện
- Đánh giá kết quả đạt được
- Khó khăn và bài học kinh nghiệm
- Hướng phát triển trong tương lai

---

## 🎯 Điểm nổi bật của đề tài

### 1. **Quản lý kho thông minh với FEFO**
- Phương pháp First Expired, First Out
- Tự động cảnh báo hàng sắp hết hạn
- Pick list tự động theo hạn sử dụng
- Giảm thiểu tổn thất do hàng hết hạn

### 2. **Hệ thống phân quyền chi tiết (RBAC)**
- 6 vai trò với quyền hạn rõ ràng
- Admin, Store Manager, Warehouse Staff, Sales Staff, Supplier, Customer
- Bảo mật dựa trên Spring Security

### 3. **Procurement Portal**
- Hỗ trợ quy trình đấu thầu
- Nhà cung cấp đề xuất sản phẩm và giá
- Quản lý phiếu gọi thầu và duyệt đề xuất

### 4. **Sales Velocity Analysis**
- Phân tích tốc độ bán hàng
- Dự đoán xu hướng
- Hỗ trợ quyết định nhập hàng

### 5. **Tích hợp thanh toán VNPay**
- Thanh toán điện tử an toàn
- Hỗ trợ nhiều ngân hàng
- Xác thực giao dịch real-time

---

## 📊 Thống kê dự án

- **Tổng số trang:** ~195 trang
- **Số lượng hình ảnh:** ~85 hình
- **Số lượng bảng biểu:** ~42 bảng
- **Số API endpoints:** 78+ endpoints
- **Số bảng database:** 25+ bảng
- **Lines of Code:** ~15,000+ lines
- **Thời gian phát triển:** 4 tháng

---

## 🛠️ Công nghệ sử dụng

### Frontend
- React.js 18.x
- Material-UI & Ant Design
- Axios, React Router
- Chart.js

### Backend
- Spring Boot 3.x
- Spring Security
- Spring Data JPA
- JWT Authentication

### Database
- MySQL 8.0

### Payment
- VNPay Gateway

### Tools
- Git/GitHub
- Postman
- MySQL Workbench
- VS Code, IntelliJ IDEA

---

## 👥 Nhóm thực hiện

**Nhóm 24**
- [Tên sinh viên 1] - [MSSV 1]
- [Tên sinh viên 2] - [MSSV 2]
- [Tên sinh viên 3] - [MSSV 3]

**Giảng viên hướng dẫn:** [Tên GVHD]

---

## 📝 Hướng dẫn sử dụng tài liệu

### Đọc báo cáo
1. Bắt đầu từ file `00_BIA.md` và đọc theo thứ tự
2. Tham khảo `02_MUC_LUC.md` để nhanh chóng tìm nội dung cần thiết
3. Các file được viết bằng Markdown, có thể đọc trực tiếp hoặc convert sang PDF

### Convert sang PDF
Sử dụng các công cụ sau để convert Markdown sang PDF:
- **Pandoc:** `pandoc file.md -o file.pdf`
- **VS Code:** Cài extension "Markdown PDF"
- **Online:** [Dillinger.io](https://dillinger.io/)

### Xem hình ảnh
- Các hình ảnh minh họa được đặt trong thư mục `images/`
- Tham chiếu trong văn bản theo format: `![Mô tả](images/folder/image.png)`

---

## 🔗 Liên kết hữu ích

- **Repository chính:** [GitHub Link]
- **Demo hệ thống:** [Demo URL]
- **API Documentation:** Xem `PHU_LUC_D_API_DOCUMENTATION.md`
- **Database Schema:** Xem `PHU_LUC_E_DATABASE_SCHEMA.md`

---

## 📞 Liên hệ

Nếu có bất kỳ thắc mắc nào về luận văn, vui lòng liên hệ:
- **Email nhóm:** [email]
- **GitHub Issues:** [Link]

---

## 📄 Giấy phép

Tài liệu này thuộc bản quyền của nhóm sinh viên và được sử dụng cho mục đích học tập, nghiên cứu.

---

**© 2026 - Nhóm 24 - Khoa Công nghệ Thông tin**