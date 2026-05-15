-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1:3306
-- Thời gian đã tạo: Th1 09, 2026 lúc 06:21 AM
-- Phiên bản máy phục vụ: 9.1.0
-- Phiên bản PHP: 8.3.14

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `perfumeshop`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `chi_tiet_don_hang`
--

DROP TABLE IF EXISTS `chi_tiet_don_hang`;
CREATE TABLE IF NOT EXISTS `chi_tiet_don_hang` (
  `id_chi_tiet_don_hang` int NOT NULL AUTO_INCREMENT,
  `id_don_hang` int NOT NULL,
  `id_san_pham` int NOT NULL,
  `so_luong` int NOT NULL DEFAULT '1',
  `gia_tai_thoi_diem_mua` decimal(15,2) NOT NULL,
  PRIMARY KEY (`id_chi_tiet_don_hang`),
  KEY `chi_tiet_don_hang_ibfk_1` (`id_don_hang`),
  KEY `chi_tiet_don_hang_ibfk_2` (`id_san_pham`)
) ENGINE=InnoDB AUTO_INCREMENT=228 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `chi_tiet_don_hang`
--

INSERT INTO `chi_tiet_don_hang` (`id_chi_tiet_don_hang`, `id_don_hang`, `id_san_pham`, `so_luong`, `gia_tai_thoi_diem_mua`) VALUES
(214, 1118, 1, 1, 3500000.00),
(223, 1120, 8, 1, 9500000.00),
(224, 1121, 5, 1, 1999000.00),
(225, 1122, 1, 1, 3500000.00),
(226, 1123, 2, 1, 3200000.00),
(227, 1124, 8, 1, 9500000.00);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `danh_gia_san_pham`
--

DROP TABLE IF EXISTS `danh_gia_san_pham`;
CREATE TABLE IF NOT EXISTS `danh_gia_san_pham` (
  `id_danh_gia` int NOT NULL AUTO_INCREMENT,
  `id_san_pham` int NOT NULL,
  `id_nguoi_dung` int NOT NULL,
  `diem_danh_gia` int DEFAULT NULL,
  `binh_luan` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ngay_tao` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_danh_gia`),
  KEY `danh_gia_san_pham_ibfk_1` (`id_san_pham`),
  KEY `danh_gia_san_pham_ibfk_2` (`id_nguoi_dung`)
) ;

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `danh_muc`
--

DROP TABLE IF EXISTS `danh_muc`;
CREATE TABLE IF NOT EXISTS `danh_muc` (
  `id_danh_muc` int NOT NULL AUTO_INCREMENT,
  `ten_danh_muc` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id_danh_muc`),
  UNIQUE KEY `ten_danh_muc` (`ten_danh_muc`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `danh_muc`
--

INSERT INTO `danh_muc` (`id_danh_muc`, `ten_danh_muc`) VALUES
(1, 'Nước hoa Nam'),
(2, 'Nước hoa Nữ'),
(3, 'Nước hoa Unisex');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `don_hang`
--

DROP TABLE IF EXISTS `don_hang`;
CREATE TABLE IF NOT EXISTS `don_hang` (
  `id_don_hang` int NOT NULL AUTO_INCREMENT,
  `id_nguoi_dung` int DEFAULT NULL,
  `id_nhan_vien` int DEFAULT NULL,
  `trang_thai_van_hanh` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `trang_thai_thanh_toan` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `tong_tien` decimal(15,2) NOT NULL DEFAULT '0.00',
  `tien_dat_coc` decimal(15,2) DEFAULT '0.00',
  `ten_nguoi_nhan` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dia_chi_giao_hang` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  `ten_khach_vang_lai` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ngay_dat_hang` datetime DEFAULT CURRENT_TIMESTAMP,
  `ma_van_don` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ly_do_huy` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ngay_hoan_thanh` datetime DEFAULT NULL,
  PRIMARY KEY (`id_don_hang`),
  KEY `don_hang_ibfk_1` (`id_nguoi_dung`),
  KEY `don_hang_ibfk_2` (`id_nhan_vien`)
) ENGINE=InnoDB AUTO_INCREMENT=1125 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `don_hang`
--

INSERT INTO `don_hang` (`id_don_hang`, `id_nguoi_dung`, `id_nhan_vien`, `trang_thai_van_hanh`, `trang_thai_thanh_toan`, `tong_tien`, `tien_dat_coc`, `ten_nguoi_nhan`, `dia_chi_giao_hang`, `ten_khach_vang_lai`, `ngay_dat_hang`, `ma_van_don`, `ly_do_huy`, `ngay_hoan_thanh`) VALUES
(1118, 3, NULL, 'Đang chờ', 'Chưa thanh toán', 3500000.00, 0.00, 'Nguyen Minh Tuyen', 'ABC zxy', NULL, '2026-01-09 12:22:20', NULL, NULL, NULL),
(1120, 1, 1, 'Đã hủy', 'Đã thanh toán', 9500000.00, 4750000.00, 'Ly Quoc Son', 'BCX as', NULL, '2026-01-09 12:43:56', 'UAL', NULL, '2026-01-09 13:19:41'),
(1121, NULL, 1, 'Hoàn thành', 'Đã thanh toán', 1999000.00, 0.00, NULL, NULL, 'HOANG', NULL, NULL, NULL, '2026-01-09 12:45:27'),
(1122, NULL, 1, 'Hoàn thành', 'Đã thanh toán', 3500000.00, 0.00, NULL, NULL, 'TU', NULL, NULL, NULL, '2026-01-09 12:45:46'),
(1123, NULL, 1, 'Hoàn thành', 'Đã thanh toán', 3200000.00, 0.00, NULL, NULL, 'HAI', NULL, NULL, NULL, '2026-01-09 12:46:28'),
(1124, NULL, 1, 'Đang giao hàng', 'Đã thanh toán', 9500000.00, 4750000.00, 'TAI', '123', 'A+E', NULL, 'HA', NULL, NULL);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `nguoi_dung`
--

DROP TABLE IF EXISTS `nguoi_dung`;
CREATE TABLE IF NOT EXISTS `nguoi_dung` (
  `id_nguoi_dung` int NOT NULL AUTO_INCREMENT,
  `ten_dang_nhap` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mat_khau_bam` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ho_ten` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `so_dien_thoai` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `dia_chi` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci DEFAULT NULL,
  PRIMARY KEY (`id_nguoi_dung`),
  UNIQUE KEY `ten_dang_nhap` (`ten_dang_nhap`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `nguoi_dung`
--

INSERT INTO `nguoi_dung` (`id_nguoi_dung`, `ten_dang_nhap`, `mat_khau_bam`, `ho_ten`, `so_dien_thoai`, `dia_chi`) VALUES
(1, 'user2', '1', 'Nguyễn Thị Hương', '0901234567', 'Q1, TP.HCM'),
(2, 'user3', '1', 'Phạm Văn Nam', '0912345678', 'Cầu Giấy, Hà Nội'),
(3, 'user1', '1', 'Le Thi B', '1', '1');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `nhan_vien`
--

DROP TABLE IF EXISTS `nhan_vien`;
CREATE TABLE IF NOT EXISTS `nhan_vien` (
  `id_nhan_vien` int NOT NULL AUTO_INCREMENT,
  `ten_dang_nhap` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mat_khau_bam` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ho_ten` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `vai_tro` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id_nhan_vien`),
  UNIQUE KEY `ten_dang_nhap` (`ten_dang_nhap`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `nhan_vien`
--

INSERT INTO `nhan_vien` (`id_nhan_vien`, `ten_dang_nhap`, `mat_khau_bam`, `ho_ten`, `vai_tro`) VALUES
(1, 'admin1', '1', 'Nguyen Minh Tuyen', 'Admin'),
(2, 'nv1', '1', 'Ly Quoc Son', 'NhanVien');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `phieu_doi_tra`
--

DROP TABLE IF EXISTS `phieu_doi_tra`;
CREATE TABLE IF NOT EXISTS `phieu_doi_tra` (
  `id_doi_tra` int NOT NULL AUTO_INCREMENT,
  `id_don_hang` int NOT NULL,
  `id_nguoi_dung` int NOT NULL,
  `id_nhan_vien` int DEFAULT NULL,
  `ly_do` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `trang_thai` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ngay_tao` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_doi_tra`),
  KEY `phieu_doi_tra_ibfk_1` (`id_don_hang`),
  KEY `phieu_doi_tra_ibfk_2` (`id_nguoi_dung`),
  KEY `phieu_doi_tra_ibfk_3` (`id_nhan_vien`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `phieu_doi_tra`
--

INSERT INTO `phieu_doi_tra` (`id_doi_tra`, `id_don_hang`, `id_nguoi_dung`, `id_nhan_vien`, `ly_do`, `trang_thai`, `ngay_tao`) VALUES
(18, 1120, 1, 2, 'kh tốt', 'Đã duyệt', '2026-01-09 13:20:02');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `san_pham`
--

DROP TABLE IF EXISTS `san_pham`;
CREATE TABLE IF NOT EXISTS `san_pham` (
  `id_san_pham` int NOT NULL AUTO_INCREMENT,
  `ten_san_pham` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `mo_ta` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `url_hinh_anh` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `gia_ban` decimal(38,2) DEFAULT NULL,
  `dung_tich_ml` int DEFAULT NULL,
  `nong_do` int DEFAULT NULL COMMENT 'Ví dụ: nồng độ tinh dầu',
  `so_luong_ton_kho` int DEFAULT '0',
  `id_danh_muc` int DEFAULT NULL,
  `id_thuong_hieu` int DEFAULT NULL,
  PRIMARY KEY (`id_san_pham`),
  KEY `id_danh_muc` (`id_danh_muc`),
  KEY `id_thuong_hieu` (`id_thuong_hieu`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `san_pham`
--

INSERT INTO `san_pham` (`id_san_pham`, `ten_san_pham`, `mo_ta`, `url_hinh_anh`, `gia_ban`, `dung_tich_ml`, `nong_do`, `so_luong_ton_kho`, `id_danh_muc`, `id_thuong_hieu`) VALUES
(1, 'Bleu de Chanel', 'Mùi hương nam tính, mạnh mẽ, sang trọng.', 'https://theperfume.vn/wp-content/uploads/2021/07/Chanel-Bleu-de-Chanel-Parfum-50ml-768x768.png', 3500000.00, 100, 20, 32, 1, 1),
(2, 'Dior Sauvage', 'Hương thơm phóng khoáng, tươi mát.', 'https://bizweb.dktcdn.net/thumb/1024x1024/100/447/196/products/nuoc-hoa-nam-dior-sauvage-parfum-1.jpg?v=1712074137523', 3200000.00, 100, 15, 32, 1, 2),
(3, 'Gucci Bloom', 'Hương hoa nhài và hoa huệ trắng.', 'https://theperfume.vn/wp-content/uploads/2018/08/nuoc-hoa-gucci-bloom-acqua-di-fiori-e1667901943395.png', 2800000.00, 50, 15, 27, 2, 3),
(4, 'Santal 33', 'Hương gỗ đàn hương đặc trưng, unisex.', 'https://ttperfume.vn/wp-content/uploads/2024/04/le-labo-santal-33-50-ml-unisex-men-74144-48-B.jpg.webp', 6500000.00, 50, 25, 93, 3, 4),
(5, 'Versace Eros Parfum', 'Nước hoa Versace Eros là sự pha trộn tinh tế giữa tinh dầu bạch hà, táo xanh và hương chanh ở hương đầu tạo nên sự dịu mát.', 'https://orchard.vn/wp-content/uploads/2024/07/versace-eros-parfum_3.jpg', 1999000.00, 100, 30, 84, 1, 5),
(8, 'Roja Elysium', 'Đẳng cấp giới thượng lưu', 'https://orchard.vn/wp-content/uploads/2020/07/roja-dove-elysium-pour-homme-parfum-cologne_4.jpg', 9500000.00, 50, 35, 0, 1, 1);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `thuong_hieu`
--

DROP TABLE IF EXISTS `thuong_hieu`;
CREATE TABLE IF NOT EXISTS `thuong_hieu` (
  `id_thuong_hieu` int NOT NULL AUTO_INCREMENT,
  `ten_thuong_hieu` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id_thuong_hieu`),
  UNIQUE KEY `ten_thuong_hieu` (`ten_thuong_hieu`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `thuong_hieu`
--

INSERT INTO `thuong_hieu` (`id_thuong_hieu`, `ten_thuong_hieu`) VALUES
(1, 'Chanel'),
(8, 'Coach'),
(6, 'D&G'),
(2, 'Dior'),
(3, 'Gucci'),
(4, 'Le Labo'),
(7, 'Tom Ford'),
(5, 'Versace');

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `chi_tiet_don_hang`
--
ALTER TABLE `chi_tiet_don_hang`
  ADD CONSTRAINT `chi_tiet_don_hang_ibfk_1` FOREIGN KEY (`id_don_hang`) REFERENCES `don_hang` (`id_don_hang`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `chi_tiet_don_hang_ibfk_2` FOREIGN KEY (`id_san_pham`) REFERENCES `san_pham` (`id_san_pham`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Các ràng buộc cho bảng `danh_gia_san_pham`
--
ALTER TABLE `danh_gia_san_pham`
  ADD CONSTRAINT `danh_gia_san_pham_ibfk_1` FOREIGN KEY (`id_san_pham`) REFERENCES `san_pham` (`id_san_pham`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `danh_gia_san_pham_ibfk_2` FOREIGN KEY (`id_nguoi_dung`) REFERENCES `nguoi_dung` (`id_nguoi_dung`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Các ràng buộc cho bảng `don_hang`
--
ALTER TABLE `don_hang`
  ADD CONSTRAINT `don_hang_ibfk_1` FOREIGN KEY (`id_nguoi_dung`) REFERENCES `nguoi_dung` (`id_nguoi_dung`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `don_hang_ibfk_2` FOREIGN KEY (`id_nhan_vien`) REFERENCES `nhan_vien` (`id_nhan_vien`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Các ràng buộc cho bảng `phieu_doi_tra`
--
ALTER TABLE `phieu_doi_tra`
  ADD CONSTRAINT `phieu_doi_tra_ibfk_1` FOREIGN KEY (`id_don_hang`) REFERENCES `don_hang` (`id_don_hang`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `phieu_doi_tra_ibfk_2` FOREIGN KEY (`id_nguoi_dung`) REFERENCES `nguoi_dung` (`id_nguoi_dung`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `phieu_doi_tra_ibfk_3` FOREIGN KEY (`id_nhan_vien`) REFERENCES `nhan_vien` (`id_nhan_vien`) ON DELETE RESTRICT ON UPDATE RESTRICT;

--
-- Các ràng buộc cho bảng `san_pham`
--
ALTER TABLE `san_pham`
  ADD CONSTRAINT `san_pham_ibfk_1` FOREIGN KEY (`id_thuong_hieu`) REFERENCES `thuong_hieu` (`id_thuong_hieu`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  ADD CONSTRAINT `san_pham_ibfk_2` FOREIGN KEY (`id_danh_muc`) REFERENCES `danh_muc` (`id_danh_muc`) ON DELETE RESTRICT ON UPDATE RESTRICT;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
