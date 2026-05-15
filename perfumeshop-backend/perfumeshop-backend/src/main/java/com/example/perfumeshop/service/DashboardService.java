package com.example.perfumeshop.service;

import com.example.perfumeshop.entity.DonHang;
import com.example.perfumeshop.entity.PhieuDoiTra;
import com.example.perfumeshop.repository.DonHangRepository;
import com.example.perfumeshop.repository.NguoiDungRepository;
import com.example.perfumeshop.repository.PhieuDoiTraRepository;
import com.example.perfumeshop.repository.SanPhamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    @Autowired
    private DonHangRepository donHangRepository;

    @Autowired
    private SanPhamRepository sanPhamRepository;

    @Autowired
    private NguoiDungRepository nguoiDungRepository;

    @Autowired
    private PhieuDoiTraRepository phieuDoiTraRepository;

    public Map<String, Object> getStats() {
        List<DonHang> allOrders = donHangRepository.findAll();
        List<PhieuDoiTra> allReturns = phieuDoiTraRepository.findAll();

        Map<String, Object> stats = new HashMap<>();

        // Doanh thu tổng (chỉ tính đơn hoàn thành)
        BigDecimal totalRevenue = allOrders.stream()
                .filter(o -> "Hoàn thành".equals(o.getTrangThaiVanHanh()))
                .map(o -> o.getTongTien() == null ? BigDecimal.ZERO : o.getTongTien())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        stats.put("totalRevenue", totalRevenue);

        stats.put("totalOrders", (long) allOrders.size());
        stats.put("totalProducts", sanPhamRepository.count());
        stats.put("totalCustomers", nguoiDungRepository.count());

        // Đếm theo trạng thái
        stats.put("pendingOrders", countByStatus(allOrders, "Đang chờ"));
        stats.put("confirmedOrders", countByStatus(allOrders, "Đã xác nhận"));
        stats.put("shippingOrders", countByStatus(allOrders, "Đang giao hàng"));
        stats.put("completedOrders", countByStatus(allOrders, "Hoàn thành"));
        stats.put("cancelledOrders", countByStatus(allOrders, "Đã hủy"));

        // Đổi trả
        long pendingReturns = allReturns.stream().filter(r -> "Chờ duyệt".equals(r.getTrangThai())).count();
        long approvedReturns = allReturns.stream().filter(r -> "Đã duyệt".equals(r.getTrangThai())).count();
        stats.put("pendingReturns", pendingReturns);
        stats.put("approvedReturns", approvedReturns);
        stats.put("totalReturns", (long) allReturns.size());

        return stats;
    }

    public List<DonHang> getRecentOrders(int limit) {
        return donHangRepository.findAll().stream()
                .filter(o -> !"Giỏ hàng".equals(o.getTrangThaiVanHanh()))
                .sorted((a, b) -> {
                    if (a.getNgayDatHang() == null && b.getNgayDatHang() == null) return 0;
                    if (a.getNgayDatHang() == null) return 1;
                    if (b.getNgayDatHang() == null) return -1;
                    return b.getNgayDatHang().compareTo(a.getNgayDatHang());
                })
                .limit(limit)
                .collect(Collectors.toList());
    }

    public Map<String, Object> getAlerts() {
        List<DonHang> allOrders = donHangRepository.findAll();
        long pendingOrders = countByStatus(allOrders, "Đang chờ");

        long lowStockItems = sanPhamRepository.findAll().stream()
                .filter(p -> p.getSoLuongTonKho() != null && p.getSoLuongTonKho() < 10)
                .count();

        Map<String, Object> alerts = new HashMap<>();
        alerts.put("pendingOrders", pendingOrders);
        alerts.put("lowStockItems", lowStockItems);
        return alerts;
    }

    private long countByStatus(List<DonHang> orders, String status) {
        return orders.stream().filter(o -> status.equals(o.getTrangThaiVanHanh())).count();
    }
}