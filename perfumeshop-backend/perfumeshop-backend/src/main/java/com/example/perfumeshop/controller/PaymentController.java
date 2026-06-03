package com.example.perfumeshop.controller;

import com.example.perfumeshop.dto.CreatePaymentLinkRequest;
import com.example.perfumeshop.service.PaymentService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import vn.payos.PayOS;
import vn.payos.model.webhooks.WebhookData;

import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private PayOS payOS;

    /**
     * FE gọi để lấy link thanh toán PayOS.
     * POST /api/payment/create-link
     * Body: { "idDonHang": 123 }
     * Response: { "checkoutUrl": "https://pay.payos.vn/..." }
     */
    @PostMapping("/create-link")
    public ResponseEntity<Map<String, String>> createPaymentLink(
            @Valid @RequestBody CreatePaymentLinkRequest req) {
        try {
            String checkoutUrl = paymentService.createPaymentLink(req.getIdDonHang());
            return ResponseEntity.ok(Map.of("checkoutUrl", checkoutUrl));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * PayOS gọi webhook sau khi khách thanh toán.
     * POST /api/payment/webhook
     */
    @PostMapping("/webhook")
    public ResponseEntity<Map<String, String>> webhook(@RequestBody Map<String, Object> body) {
        try {
            WebhookData data = payOS.webhooks().verify(body);
            paymentService.handleWebhook(data);
            return ResponseEntity.ok(Map.of("success", "true"));
        } catch (Exception e) {
            // Trả về 200 dù sao để PayOS không retry liên tục
            return ResponseEntity.ok(Map.of("error", e.getMessage()));
        }
    }

    /**
     * FE poll để kiểm tra trạng thái thanh toán.
     * GET /api/payment/status/{orderId}
     */
    @GetMapping("/status/{orderId}")
    public ResponseEntity<Map<String, String>> checkStatus(@PathVariable Integer orderId) {
        try {
            String status = paymentService.checkPaymentStatus(orderId);
            return ResponseEntity.ok(Map.of("status", status));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
