package com.example.perfumeshop.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    @Value("${app.jwt.secret:perfumeshop-secret-key-change-in-production-must-be-at-least-256-bits}")
    private String secret;

    @Value("${app.jwt.expiration-ms:86400000}") // 24 giờ
    private long expirationMs;

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    /**
     * Tạo JWT token cho nhân viên (employee).
     *
     * @param userId   id_nhan_vien
     * @param username ten_dang_nhap
     * @param role     vai_tro: ADMIN | STORE_MANAGER | WAREHOUSE_STAFF | SALES_STAFF
     */
    public String generateEmployeeToken(Integer userId, String username, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("type", "employee");
        claims.put("role", role);
        return buildToken(username, claims);
    }

    /**
     * Tạo JWT token cho khách hàng (customer).
     *
     * @param userId   id_nguoi_dung
     * @param username ten_dang_nhap
     */
    public String generateCustomerToken(Integer userId, String username) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("userId", userId);
        claims.put("type", "customer");
        claims.put("role", "CUSTOMER");
        return buildToken(username, claims);
    }

    private String buildToken(String subject, Map<String, Object> claims) {
        Date now = new Date();
        Date expiry = new Date(now.getTime() + expirationMs);
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(now)
                .setExpiration(expiry)
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    /** Lấy toàn bộ claims từ token */
    public Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    public String extractUsername(String token) {
        return extractAllClaims(token).getSubject();
    }

    public String extractRole(String token) {
        return (String) extractAllClaims(token).get("role");
    }

    public String extractType(String token) {
        return (String) extractAllClaims(token).get("type");
    }

    public Integer extractUserId(String token) {
        Object userId = extractAllClaims(token).get("userId");
        if (userId instanceof Integer) return (Integer) userId;
        if (userId instanceof Long) return ((Long) userId).intValue();
        return null;
    }

    public boolean isTokenValid(String token) {
        try {
            extractAllClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }
}
