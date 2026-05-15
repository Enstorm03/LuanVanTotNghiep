package com.example.perfumeshop.controller;

import com.example.perfumeshop.dto.AddCartItemRequest;
import com.example.perfumeshop.dto.CheckoutCartRequest;
import com.example.perfumeshop.dto.UpdateCartItemRequest;
import com.example.perfumeshop.entity.DonHang;
import com.example.perfumeshop.service.CartService;
import com.example.perfumeshop.service.DonHangService;
import com.example.perfumeshop.dto.DonHangHistoryDto;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired
    private CartService cartService;

    @Autowired
    private DonHangService donHangService;

    @GetMapping
    public ResponseEntity<DonHang> getCart(@RequestParam("userId") Integer userId) {
        return ResponseEntity.ok(cartService.getOrCreateCart(userId));
    }

    @GetMapping("/dto")
    public ResponseEntity<DonHangHistoryDto> getCartDto(@RequestParam("userId") Integer userId) {
        DonHang cart = cartService.getOrCreateCart(userId);
        return ResponseEntity.ok(donHangService.toHistoryDto(cart));
    }

    @PostMapping("/items")
    public ResponseEntity<DonHang> addItem(@Valid @RequestBody AddCartItemRequest req) {
        return ResponseEntity.ok(cartService.addItem(req));
    }

    @PutMapping("/items")
    public ResponseEntity<DonHang> updateItem(@Valid @RequestBody UpdateCartItemRequest req) {
        return ResponseEntity.ok(cartService.updateItem(req));
    }

    @DeleteMapping("/items")
    public ResponseEntity<DonHang> removeItem(@RequestParam("userId") Integer userId,
                                              @RequestParam("sanPhamId") Integer sanPhamId) {
        return ResponseEntity.ok(cartService.removeItem(userId, sanPhamId));
    }

    @DeleteMapping
    public ResponseEntity<DonHang> clear(@RequestParam("userId") Integer userId) {
        return ResponseEntity.ok(cartService.clearCart(userId));
    }

    @PostMapping("/checkout")
    public ResponseEntity<DonHang> checkout(@Valid @RequestBody CheckoutCartRequest req) {
        return ResponseEntity.ok(cartService.checkout(req));
    }
}
