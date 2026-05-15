package com.example.perfumeshop.controller;

import com.example.perfumeshop.entity.DonHang;
import com.example.perfumeshop.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(dashboardService.getStats());
    }

    @GetMapping("/recent-orders")
    public ResponseEntity<List<DonHang>> getRecentOrders(
            @RequestParam(value = "limit", defaultValue = "5") int limit) {
        return ResponseEntity.ok(dashboardService.getRecentOrders(limit));
    }

    @GetMapping("/alerts")
    public ResponseEntity<Map<String, Object>> getAlerts() {
        return ResponseEntity.ok(dashboardService.getAlerts());
    }
}