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

    // Đổi thành /cho-duyet để khớp với Frontend
    @GetMapping("/cho-duyet")
    public ResponseEntity<List<PhieuDoiTra>> listPending() {
        return ResponseEntity.ok(returnService.listPending());
    }

    // Đổi thành /all để khớp với Frontend
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
        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<PhieuDoiTra> create(@Valid @RequestBody CreateReturnRequest req) {
        return ResponseEntity.ok(returnService.create(req.getIdDonHang(), req.getIdNguoiDung(), req.getLyDo()));
    }

    // Đổi thành /duyet để khớp với Frontend
    @PostMapping("/{id}/duyet")
    public ResponseEntity<PhieuDoiTra> approve(@PathVariable Integer id, @Valid @RequestBody ApproveReturnRequest req) {
        return ResponseEntity.ok(returnService.approve(id, req.getNhanVienId()));
    }

    // Đổi thành /tu-choi để khớp với Frontend, và hứng tham số lyDo
    @PostMapping("/{id}/tu-choi")
    public ResponseEntity<PhieuDoiTra> reject(@PathVariable Integer id, @RequestBody Map<String, Object> req) {
        Integer nhanVienId = null;
        if (req.containsKey("nhanVienId") && req.get("nhanVienId") != null) {
            nhanVienId = Integer.parseInt(req.get("nhanVienId").toString());
        }

        String lyDo = (String) req.get("lyDo");

        // GỌI SERVICE: Nếu hàm reject của bạn có nhận lyDo thì dùng dòng 1, nếu không có thì dùng dòng 2
        // Dòng 1 (Khuyên dùng - nếu ReturnService.java của bạn có lưu lý do):
        // return ResponseEntity.ok(returnService.reject(id, nhanVienId, lyDo));

        // Dòng 2 (Hiện tại ReturnService của bạn đang chỉ nhận 2 tham số):
        return ResponseEntity.ok(returnService.reject(id, nhanVienId));
    }
}