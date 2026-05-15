package com.example.perfumeshop.controller;

import com.example.perfumeshop.dto.PlaceOrderRequest;
import com.example.perfumeshop.entity.DonHang;
import com.example.perfumeshop.service.CheckoutService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class DatHangController {

    @Autowired
    private CheckoutService checkoutService;

    @PostMapping("/dat-hang")
    public ResponseEntity<DonHang> placeOrder(@Valid @RequestBody PlaceOrderRequest req) {
        return ResponseEntity.ok(checkoutService.placeOrder(req));
    }

    @PostMapping("/don-hang/{id}/huy/khach")
    public ResponseEntity<DonHang> cancelByCustomer(@PathVariable Integer id, @RequestParam("lyDo") String lyDo) {
        return ResponseEntity.ok(checkoutService.cancelByCustomer(id, lyDo));
    }

    @PostMapping("/don-hang/{id}/thanh-toan")
    public ResponseEntity<DonHang> updatePaymentStatus(
            @PathVariable Integer id,
            @RequestParam(defaultValue = "true") boolean daThanhToan) {

        DonHang updatedOrder = checkoutService.updatePaymentStatus(id, daThanhToan);
        return ResponseEntity.ok(updatedOrder);
    }

}
