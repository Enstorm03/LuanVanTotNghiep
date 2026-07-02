# MỤC LỤC

## LỜI CẢM ƠN

## TÓM TẮT ĐỀ TÀI

## DANH MỤC HÌNH ẢNH

## DANH MỤC BẢNG BIỂU

## DANH MỤC TỪ VIẾT TẮT

---

## **CHƯƠNG 1: GIỚI THIỆU** ......................................................... 1

**1.1. Lý do chọn đề tài** ......................................................... 1

**1.2. Mục tiêu đề tài** ......................................................... 2
- 1.2.1. Mục tiêu tổng quát
- 1.2.2. Mục tiêu cụ thể

**1.3. Đối tượng và phạm vi nghiên cứu** ......................................................... 3
- 1.3.1. Đối tượng nghiên cứu
- 1.3.2. Phạm vi nghiên cứu

**1.4. Phương pháp nghiên cứu** ......................................................... 4

**1.5. Bố cục luận văn** ......................................................... 5

---

## **CHƯƠNG 2: CƠ SỞ LÝ THUYẾT** ......................................................... 6

**2.1. Tổng quan về thương mại điện tử** ......................................................... 6
- 2.1.1. Khái niệm thương mại điện tử
- 2.1.2. Xu hướng phát triển
- 2.1.3. Thị trường nước hoa trực tuyến

**2.2. Các công nghệ và công cụ sử dụng** ......................................................... 10
- 2.2.1. Kiến trúc hệ thống
- 2.2.2. Frontend Technologies (React.js)
- 2.2.3. Backend Technologies (Spring Boot)
- 2.2.4. Cơ sở dữ liệu (MySQL)
- 2.2.5. Công cụ thanh toán (VNPay)

**2.3. Các mô hình và phương pháp luận** ......................................................... 15
- 2.3.1. Mô hình MVC (Model-View-Controller)
- 2.3.2. RESTful API
- 2.3.3. Agile Scrum

**2.4. Quản lý kho hàng** ......................................................... 18
- 2.4.1. Phương pháp FEFO (First Expired, First Out)
- 2.4.2. Quản lý hạn sử dụng
- 2.4.3. Tối ưu hóa tồn kho

**2.5. Hệ thống phân quyền (RBAC)** ......................................................... 21
- 2.5.1. Role-Based Access Control
- 2.5.2. Spring Security

**2.6. Tổng quan các hệ thống tương tự** ......................................................... 23
- 2.6.1. Hệ thống trong nước
- 2.6.2. Hệ thống quốc tế
- 2.6.3. So sánh và rút kinh nghiệm

---

## **CHƯƠNG 3: PHÂN TÍCH HỆ THỐNG** ......................................................... 28

**3.1. Phân tích yêu cầu hệ thống** ......................................................... 28
- 3.1.1. Yêu cầu chức năng
- 3.1.2. Yêu cầu phi chức năng

**3.2. Phân tích các tác nhân (Actors)** ......................................................... 32
- 3.2.1. Admin
- 3.2.2. Cửa hàng trưởng
- 3.2.3. Nhân viên kho
- 3.2.4. Nhân viên bán hàng
- 3.2.5. Nhà cung cấp
- 3.2.6. Khách hàng

**3.3. Phân tích nghiệp vụ** ......................................................... 36
- 3.3.1. Quy trình bán hàng
- 3.3.2. Quy trình quản lý kho
- 3.3.3. Quy trình đấu thầu (Procurement)
- 3.3.4. Quy trình thanh toán

**3.4. Biểu đồ Use Case** ......................................................... 42
- 3.4.1. Use Case tổng quan
- 3.4.2. Use Case chi tiết theo từng actor

**3.5. Phân tích dữ liệu** ......................................................... 48
- 3.5.1. Thực thể và quan hệ
- 3.5.2. Mô hình ERD (Entity Relationship Diagram)

---

## **CHƯƠNG 4: THIẾT KẾ HỆ THỐNG** ......................................................... 52

**4.1. Kiến trúc tổng quan hệ thống** ......................................................... 52
- 4.1.1. Kiến trúc phân tầng (Layered Architecture)
- 4.1.2. Kiến trúc Client-Server
- 4.1.3. Sơ đồ triển khai (Deployment Diagram)

**4.2. Thiết kế cơ sở dữ liệu** ......................................................... 56
- 4.2.1. Sơ đồ quan hệ thực thể (ERD)
- 4.2.2. Mô tả các bảng
- 4.2.3. Ràng buộc và quan hệ

**4.3. Thiết kế API** ......................................................... 68
- 4.3.1. Thiết kế RESTful API
- 4.3.2. Endpoint specification
- 4.3.3. Request/Response format

**4.4. Thiết kế giao diện người dùng** ......................................................... 75
- 4.4.1. Wireframe
- 4.4.2. Mockup
- 4.4.3. User Flow

**4.5. Thiết kế bảo mật** ......................................................... 82
- 4.5.1. Xác thực và phân quyền
- 4.5.2. Mã hóa dữ liệu
- 4.5.3. Bảo mật thanh toán

**4.6. Biểu đồ tuần tự (Sequence Diagram)** ......................................................... 86
- 4.6.1. Quy trình đăng nhập
- 4.6.2. Quy trình đặt hàng
- 4.6.3. Quy trình thanh toán
- 4.6.4. Quy trình nhập kho FEFO

**4.7. Biểu đồ lớp (Class Diagram)** ......................................................... 92

---

## **CHƯƠNG 5: TRIỂN KHAI HỆ THỐNG** ......................................................... 96

**5.1. Môi trường phát triển** ......................................................... 96
- 5.1.1. Phần cứng
- 5.1.2. Phần mềm và công cụ

**5.2. Cài đặt và cấu hình** ......................................................... 98
- 5.2.1. Cấu hình Backend (Spring Boot)
- 5.2.2. Cấu hình Frontend (React.js)
- 5.2.3. Cấu hình Database (MySQL)
- 5.2.4. Cấu hình VNPay

**5.3. Triển khai các module chính** ......................................................... 103
- 5.3.1. Module quản lý người dùng và phân quyền
- 5.3.2. Module quản lý sản phẩm
- 5.3.3. Module quản lý kho (FEFO)
- 5.3.4. Module bán hàng
- 5.3.5. Module thanh toán
- 5.3.6. Module procurement (đấu thầu)
- 5.3.7. Module báo cáo và thống kê

**5.4. Các tính năng nổi bật** ......................................................... 118
- 5.4.1. FEFO Inventory Management
- 5.4.2. Sales Velocity Analysis
- 5.4.3. Procurement Portal
- 5.4.4. Email Verification
- 5.4.5. Real-time Dashboard

**5.5. Demo hệ thống** ......................................................... 125
- 5.5.1. Giao diện khách hàng
- 5.5.2. Giao diện quản trị
- 5.5.3. Giao diện nhà cung cấp

---

## **CHƯƠNG 6: KIỂM THỬ VÀ ĐÁNH GIÁ** ......................................................... 132

**6.1. Kế hoạch kiểm thử** ......................................................... 132
- 6.1.1. Mục tiêu kiểm thử
- 6.1.2. Phạm vi kiểm thử
- 6.1.3. Phương pháp kiểm thử

**6.2. Kiểm thử đơn vị (Unit Testing)** ......................................................... 135

**6.3. Kiểm thử tích hợp (Integration Testing)** ......................................................... 138

**6.4. Kiểm thử hệ thống (System Testing)** ......................................................... 141
- 6.4.1. Kiểm thử chức năng
- 6.4.2. Kiểm thử hiệu năng
- 6.4.3. Kiểm thử bảo mật
- 6.4.4. Kiểm thử tương thích

**6.5. Kiểm thử người dùng (User Acceptance Testing)** ......................................................... 147

**6.6. Kết quả kiểm thử** ......................................................... 150

**6.7. Đánh giá hệ thống** ......................................................... 152
- 6.7.1. Ưu điểm
- 6.7.2. Hạn chế
- 6.7.3. Hướng khắc phục

---

## **CHƯƠNG 7: KẾT LUẬN VÀ HƯỚNG PHÁT TRIỂN** ......................................................... 155

**7.1. Kết luận** ......................................................... 155
- 7.1.1. Tổng kết công việc đã thực hiện
- 7.1.2. Đánh giá kết quả đạt được
- 7.1.3. Khó khăn và bài học kinh nghiệm

**7.2. Hướng phát triển** ......................................................... 157
- 7.2.1. Nâng cấp tính năng
- 7.2.2. Tối ưu hóa hiệu năng
- 7.2.3. Mở rộng hệ thống

---

## **TÀI LIỆU THAM KHẢO** ......................................................... 160

---

## **PHỤ LỤC** ......................................................... 163

**Phụ lục A: Hướng dẫn cài đặt** ......................................................... 163

**Phụ lục B: Hướng dẫn sử dụng** ......................................................... 168

**Phụ lục C: Source code quan trọng** ......................................................... 175

**Phụ lục D: API Documentation** ......................................................... 182

**Phụ lục E: Database Schema** ......................................................... 188

**Phụ lục F: Bảng khảo sát người dùng** ......................................................... 193