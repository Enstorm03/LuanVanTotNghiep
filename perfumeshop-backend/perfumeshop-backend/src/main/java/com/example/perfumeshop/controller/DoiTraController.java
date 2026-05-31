package com.example.perfumeshop.controller;

import com.example.perfumeshop.dto.ApproveReturnRequest;
import com.example.perfumeshop.dto.CreateReturnRequest;
import com.example.perfumeshop.entity.PhieuDoiTra;
import com.example.perfumeshop.service.ReturnService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/doi-tra")
@CrossOrigin(origins = "*")
public class DoiTraController {

    @Autowired
    private ReturnService returnService;

    @GetMapping("/cho-duyet")
    public ResponseEntity<List<PhieuDoiTra>> listPending() {
        return ResponseEntity.ok(returnService.listPending());
    }

    @GetMapping("/all")
    public ResponseEntity<List<PhieuDoiTra>> listAll() {
        return ResponseEntity.ok(returnService.listAll());
    }

    @GetMapping("/{id:\\d+}")
    public ResponseEntity<PhieuDoiTra> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(returnService.getById(id));
    }

    @GetMapping("/kiem-tra")
    public ResponseEntity<Map<String, Object>> checkReturnStatus(
            @RequestParam("orderId") Integer orderId,
            @RequestParam("userId") Integer userId) {
        PhieuDoiTra p = returnService.findByOrderAndUser(orderId, userId);
        Map<String, Object> result = new HashMap<>();
        result.put("hasReturnRequest", p != null);
        result.put("returnStatus", p != null ? p.getTrangThai() : null);
        result.put("lyDoTuChoi", p != null ? p.getLyDoTuChoi() : null);
        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<PhieuDoiTra> create(@Valid @RequestBody CreateReturnRequest req) {
        return ResponseEntity.ok(returnService.create(req.getIdDonHang(), req.getIdNguoiDung(), req.getLyDo()));
    }

    @PostMapping("/{id}/duyet")
    public ResponseEntity<PhieuDoiTra> approve(@PathVariable Integer id,
                                                @Valid @RequestBody ApproveReturnRequest req) {
        return ResponseEntity.ok(returnService.approve(id, req.getNhanVienId()));
    }

    @PostMapping("/{id}/xac-nhan-hoan-tien")
    public ResponseEntity<PhieuDoiTra> confirmRefund(@PathVariable Integer id,
                                                      @RequestBody Map<String, Object> req) {
        Integer nhanVienId = req.get("nhanVienId") != null
                ? Integer.parseInt(req.get("nhanVienId").toString()) : null;
        return ResponseEntity.ok(returnService.confirmRefund(id, nhanVienId));
    }

    @PostMapping("/{id}/tu-choi")
    public ResponseEntity<PhieuDoiTra> reject(@PathVariable Integer id,
                                               @RequestBody Map<String, Object> req) {
        Integer nhanVienId = req.get("nhanVienId") != null
                ? Integer.parseInt(req.get("nhanVienId").toString()) : null;
        String lyDo = (String) req.get("lyDo");
        return ResponseEntity.ok(returnService.reject(id, nhanVienId, lyDo));
    }
}
