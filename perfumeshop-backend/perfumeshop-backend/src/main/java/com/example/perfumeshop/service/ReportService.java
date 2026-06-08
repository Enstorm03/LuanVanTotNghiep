package com.example.perfumeshop.service;

import com.example.perfumeshop.entity.ChiTietDonHang;
import com.example.perfumeshop.entity.DonHang;
import com.example.perfumeshop.entity.SanPham;
import com.example.perfumeshop.repository.DonHangRepository;
import com.example.perfumeshop.repository.NguoiDungRepository;
import com.example.perfumeshop.repository.NhanVienRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReportService {

    @Autowired
    private DonHangRepository donHangRepository;

    @Autowired
    private NguoiDungRepository nguoiDungRepository;

    @Autowired
    private NhanVienRepository nhanVienRepository;
    public Map<String, Object> getSummary(LocalDate startDate, LocalDate endDate) {
        LocalDateTime start = startDate != null ? startDate.atStartOfDay() : LocalDateTime.of(2000, 1, 1, 0, 0);
        LocalDateTime end   = endDate   != null ? endDate.atTime(LocalTime.MAX) : LocalDateTime.now();

        // Dùng query có WHERE thay vì findAll() để tránh load toàn bộ DB
        List<DonHang> orders = donHangRepository.findForReport(start, end);

        long totalOrders = orders.size();

        // Bổ sung đếm số lượng cho từng trạng thái
        long pendingOrders = orders.stream().filter(o -> "Đang chờ".equals(o.getTrangThaiVanHanh()) || "Chờ xác nhận".equals(o.getTrangThaiVanHanh())).count();
        long confirmedOrders = orders.stream().filter(o -> "Đã xác nhận".equals(o.getTrangThaiVanHanh())).count();
        long shippingOrders = orders.stream().filter(o -> "Đang giao hàng".equals(o.getTrangThaiVanHanh()) || "Đang giao".equals(o.getTrangThaiVanHanh())).count();
        long completedOrders = orders.stream().filter(o -> "Hoàn thành".equals(o.getTrangThaiVanHanh())).count();
        long cancelledOrders = orders.stream().filter(o -> "Đã hủy".equals(o.getTrangThaiVanHanh())).count();
        long depositOrders = orders.stream().filter(o -> "Chờ hàng".equals(o.getTrangThaiVanHanh()) || "Đặt cọc".equals(o.getTrangThaiVanHanh())).count();

        BigDecimal totalRevenue = orders.stream()
                .filter(o -> "Hoàn thành".equals(o.getTrangThaiVanHanh()))
                .map(o -> o.getTongTien() == null ? BigDecimal.ZERO : o.getTongTien())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal avgOrderValue = totalOrders > 0
                ? totalRevenue.divide(BigDecimal.valueOf(totalOrders), RoundingMode.HALF_UP)
                : BigDecimal.ZERO;

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalRevenue", totalRevenue);
        summary.put("totalOrders", totalOrders);
        summary.put("avgOrderValue", avgOrderValue);
        summary.put("newCustomers", nguoiDungRepository.count());

        // Trả về đầy đủ các trạng thái cho Frontend
        summary.put("pendingOrders", pendingOrders);
        summary.put("confirmedOrders", confirmedOrders);
        summary.put("shippingOrders", shippingOrders);
        summary.put("completedOrders", completedOrders);
        summary.put("cancelledOrders", cancelledOrders);
        summary.put("depositOrders", depositOrders);

        return summary;
    }

    public List<Map<String, Object>> getTopProducts(LocalDate startDate, LocalDate endDate, int limit) {
        LocalDateTime start = startDate != null ? startDate.atStartOfDay() : LocalDateTime.of(2000, 1, 1, 0, 0);
        LocalDateTime end   = endDate   != null ? endDate.atTime(LocalTime.MAX) : LocalDateTime.now();

        Map<Integer, Map<String, Object>> productSales = new HashMap<>();
        donHangRepository.findForReport(start, end).stream()
                .filter(o -> "Hoàn thành".equals(o.getTrangThaiVanHanh()))
                .flatMap(o -> o.getChiTietDonHangs() != null ? o.getChiTietDonHangs().stream() : java.util.stream.Stream.empty())
                .forEach(ct -> {
                    SanPham sp = ct.getSanPham();
                    if (sp == null) return;
                    productSales.computeIfAbsent(sp.getIdSanPham(), k -> {
                        Map<String, Object> m = new HashMap<>();
                        m.put("productId", sp.getIdSanPham());
                        m.put("productName", sp.getTenSanPham());
                        m.put("totalQuantity", 0);
                        m.put("totalRevenue", BigDecimal.ZERO);
                        return m;
                    });
                    Map<String, Object> entry = productSales.get(sp.getIdSanPham());
                    entry.put("totalQuantity", (int) entry.get("totalQuantity") + ct.getSoLuong());
                    BigDecimal revenue = ct.getGiaTaiThoiDiemMua() != null
                            ? ct.getGiaTaiThoiDiemMua().multiply(BigDecimal.valueOf(ct.getSoLuong()))
                            : BigDecimal.ZERO;
                    entry.put("totalRevenue", ((BigDecimal) entry.get("totalRevenue")).add(revenue));
                });

        return productSales.values().stream()
                .sorted((a, b) -> Integer.compare((int) b.get("totalQuantity"), (int) a.get("totalQuantity")))
                .limit(limit)
                .collect(Collectors.toList());
    }

    public Map<String, Object> getRevenueByStatus(LocalDate startDate, LocalDate endDate) {
        LocalDateTime start = startDate != null ? startDate.atStartOfDay() : LocalDateTime.of(2000, 1, 1, 0, 0);
        LocalDateTime end   = endDate   != null ? endDate.atTime(LocalTime.MAX) : LocalDateTime.now();

        Map<String, Object> result = new HashMap<>();
        Map<String, BigDecimal> byStatus = new HashMap<>();

        donHangRepository.findForReport(start, end).forEach(o -> {
                    String status = o.getTrangThaiVanHanh();
                    BigDecimal amount = o.getTongTien() == null ? BigDecimal.ZERO : o.getTongTien();
                    byStatus.merge(status, amount, BigDecimal::add);
                });

        result.put("revenueByStatus", byStatus);
        return result;
    }

    public String exportCsv(LocalDate startDate, LocalDate endDate) {
        LocalDateTime start = startDate != null ? startDate.atStartOfDay() : LocalDateTime.of(2000, 1, 1, 0, 0);
        LocalDateTime end   = endDate   != null ? endDate.atTime(LocalTime.MAX) : LocalDateTime.now();

        StringBuilder csv = new StringBuilder();
        csv.append("Mã đơn,Ngày đặt,Khách hàng,Trạng thái,Tổng tiền,Thanh toán\n");

        donHangRepository.findForReport(start, end).forEach(o -> {
                    csv.append(o.getIdDonHang()).append(",");
                    csv.append(o.getNgayDatHang()).append(",");
                    csv.append(o.getTenNguoiNhan() != null ? o.getTenNguoiNhan() : "").append(",");
                    csv.append(o.getTrangThaiVanHanh()).append(",");
                    csv.append(o.getTongTien()).append(",");
                    csv.append(o.getTrangThaiThanhToan()).append("\n");
                });

        return csv.toString();
    }
}