# TÓM TẮT ĐỀ TÀI

## Tên đề tài
**HỆ THỐNG QUẢN LÝ BÁN HÀNG VÀ KHO NƯỚC HOA TRỰC TUYẾN**  
*(Perfume Shop Management System)*

## Thông tin chung
- **Nhóm thực hiện:** Nhóm 24
- **Giảng viên hướng dẫn:** [Tên GVHD]
- **Thời gian thực hiện:** Học kỳ 2, Năm học 2025-2026

---

## Tóm tắt nội dung

Với sự phát triển mạnh mẽ của thương mại điện tử và nhu cầu mua sắm trực tuyến ngày càng tăng, đặc biệt trong lĩnh vực mỹ phẩm và nước hoa, việc xây dựng một hệ thống quản lý bán hàng và kho hiện đại, hiệu quả là vô cùng cần thiết. Luận văn này trình bày quá trình phân tích, thiết kế và xây dựng một hệ thống quản lý shop nước hoa toàn diện, đáp ứng nhu cầu của nhiều đối tượng người dùng khác nhau.

### Mục tiêu

Hệ thống được xây dựng nhằm:
- Cung cấp nền tảng thương mại điện tử hoàn chỉnh cho việc mua bán nước hoa trực tuyến
- Quản lý kho hàng thông minh với phương pháp FEFO (First Expired, First Out) để tối ưu hóa hạn sử dụng
- Hỗ trợ quy trình đấu thầu (procurement) giữa cửa hàng và nhà cung cấp
- Phân quyền chi tiết cho 6 vai trò: Admin, Cửa hàng trưởng, Nhân viên kho, Nhân viên bán hàng, Nhà cung cấp, và Khách hàng
- Tích hợp thanh toán điện tử qua VNPay
- Cung cấp báo cáo và phân tích kinh doanh real-time

### Phương pháp thực hiện

Đề tài được thực hiện theo quy trình phát triển phần mềm Agile Scrum, bao gồm các giai đoạn:
1. **Nghiên cứu và phân tích:** Khảo sát thị trường, phân tích yêu cầu người dùng, nghiên cứu các hệ thống tương tự
2. **Thiết kế hệ thống:** Thiết kế kiến trúc, cơ sở dữ liệu, API, và giao diện người dùng
3. **Triển khai:** Xây dựng hệ thống với công nghệ hiện đại (React.js, Spring Boot, MySQL)
4. **Kiểm thử:** Kiểm thử đơn vị, tích hợp, hệ thống và chấp nhận người dùng
5. **Triển khai và vận hành:** Deploy hệ thống và thu thập phản hồi

### Công nghệ sử dụng

**Frontend:**
- React.js 18.x
- Material-UI & Ant Design
- Axios, React Router
- Chart.js cho visualization

**Backend:**
- Spring Boot 3.x
- Spring Security
- Spring Data JPA
- JWT Authentication

**Database:**
- MySQL 8.0

**Thanh toán:**
- VNPay Payment Gateway

**Tools:**
- Git/GitHub
- Postman
- MySQL Workbench
- VS Code, IntelliJ IDEA

### Kết quả đạt được

Hệ thống đã được xây dựng thành công với đầy đủ các chức năng:

1. **Quản lý người dùng và phân quyền:**
   - Đăng ký, đăng nhập với xác thực email
   - Phân quyền chi tiết cho 6 vai trò
   - Quản lý profile và đổi mật khẩu

2. **Quản lý sản phẩm:**
   - CRUD sản phẩm với hình ảnh, mô tả chi tiết
   - Phân loại theo danh mục, thương hiệu
   - Tìm kiếm và lọc sản phẩm

3. **Quản lý kho thông minh:**
   - Nhập kho với ghi nhận batch và hạn sử dụng
   - Phương pháp FEFO tự động
   - Cảnh báo hàng sắp hết hạn
   - Pick list tự động cho đơn hàng
   - Import/Export CSV

4. **Bán hàng trực tuyến:**
   - Giỏ hàng và checkout
   - Thanh toán VNPay
   - Theo dõi đơn hàng
   - Đánh giá sản phẩm

5. **Procurement (Đấu thầu):**
   - Tạo phiếu gọi thầu
   - Nhà cung cấp đề xuất giá
   - Quản lý và duyệt đề xuất
   - Portal riêng cho supplier

6. **Báo cáo và thống kê:**
   - Dashboard real-time
   - Báo cáo doanh thu, tồn kho
   - Sales velocity analysis
   - Xuất báo cáo Excel

7. **Chiến dịch Marketing:**
   - Quản lý sự kiện, khuyến mãi
   - Voucher và discount codes
   - Email marketing

### Đóng góp và ý nghĩa

Hệ thống mang lại những đóng góp thiết thực:
- **Về mặt thực tiễn:** Cung cấp giải pháp quản lý toàn diện cho cửa hàng nước hoa, giúp tối ưu hóa quy trình bán hàng và quản lý kho
- **Về mặt công nghệ:** Áp dụng các công nghệ và kiến trúc hiện đại, có thể mở rộng và bảo trì dễ dàng
- **Về mặt kinh doanh:** Giảm thiểu tổn thất do hàng hết hạn, tăng hiệu quả quản lý, cải thiện trải nghiệm khách hàng

### Hạn chế và hướng phát triển

**Hạn chế:**
- Chưa tích hợp nhiều phương thức thanh toán quốc tế
- Chưa có tính năng chat trực tuyến
- Chưa tối ưu cho mobile app

**Hướng phát triển:**
- Phát triển mobile app (React Native)
- Tích hợp AI/ML cho recommendation system
- Mở rộng sang các sản phẩm khác
- Tích hợp CRM và loyalty program
- Multi-warehouse support
- Internationalization (i18n)

---

## Từ khóa

E-commerce, Perfume Shop, Inventory Management, FEFO, Spring Boot, React.js, Procurement, Role-Based Access Control, VNPay, Sales Velocity

---

**Số trang:** ~195 trang  
**Số hình ảnh:** ~85 hình  
**Số bảng biểu:** ~42 bảng  
**Số tài liệu tham khảo:** ~35 tài liệu