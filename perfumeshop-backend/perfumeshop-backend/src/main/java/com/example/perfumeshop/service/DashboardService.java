package com.example.perfumeshop.service;

import com.example.perfumeshop.entity.DonHang;
import com.example.perfumeshop.entity.PhieuDoiTra;
import com.example.perfumeshop.repository.DonHangRepository;
import com.example.perfumeshop.repository.NguoiDungRepository;
import com.example.perfumeshop.repository.PhieuDoiTraRepository;
import com.example.perfumeshop.repository.SanPhamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

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
        List<PhieuDoiTra> allReturns = phieuDoiTraRepository.findAll();

        Map<String, Object> stats = new HashMap<>();

        // Doanh thu và tổng đơn — dùng aggregate query thay findAll()
        stats.put("totalRevenue",    donHangRepository.sumRevenueCompleted());
        stats.put("totalOrders",     donHangRepository.countByTrangThaiVanHanhNot("Giỏ hàng"));
        stats.put("totalProducts",   sanPhamRepository.count());
        stats.put("totalCustomers",  nguoiDungRepository.count());

        // Đếm theo trạng thái — chạy COUNT ở DB
        stats.put("pendingOrders",   donHangRepository.countByTrangThai("Đang chờ"));
        stats.put("confirmedOrders", donHangRepository.countByTrangThai("Đã xác nhận"));
        stats.put("shippingOrders",  donHangRepository.countByTrangThai("Đang giao hàng"));
        stats.put("completedOrders", donHangRepository.countByTrangThai("Hoàn thành"));
        stats.put("cancelledOrders", donHangRepository.countByTrangThai("Đã hủy"));

        // Đổi trả
        long pendingReturns   = allReturns.stream().filter(r -> "Chờ duyệt".equals(r.getTrangThai())).count();
        long waitingRefund    = allReturns.stream().filter(r -> "Chờ hoàn tiền".equals(r.getTrangThai())).count();
        long completedReturns = allReturns.stream().filter(r -> "Hoàn tiền thành công".equals(r.getTrangThai())).count();
        long rejectedReturns  = allReturns.stream().filter(r -> "Từ chối".equals(r.getTrangThai())).count();
        stats.put("pendingReturns",      pendingReturns);
        stats.put("waitingRefundReturns",waitingRefund);
        stats.put("completedReturns",    completedReturns);
        stats.put("rejectedReturns",     rejectedReturns);
        stats.put("totalReturns",        (long) allReturns.size());

        return stats;
    }

    public List<DonHang> getRecentOrders(int limit) {
        // Dùng query sắp xếp ở DB, chỉ lấy đúng số cần thiết
        return donHangRepository.findAllExceptCart()
                .stream().limit(limit).collect(Collectors.toList());
    }

    public Map<String, Object> getAlerts() {
        // Dùng COUNT query thay vì findAll + stream filter
        long pendingOrders = donHangRepository.countByTrangThai("Đang chờ");

        long lowStockItems = sanPhamRepository.findAll().stream()
                .filter(p -> p.getSoLuongTonKho() != null && p.getSoLuongTonKho() < 10)
                .count();

        Map<String, Object> alerts = new HashMap<>();
        alerts.put("pendingOrders", pendingOrders);
        alerts.put("lowStockItems", lowStockItems);
        return alerts;
    }
}