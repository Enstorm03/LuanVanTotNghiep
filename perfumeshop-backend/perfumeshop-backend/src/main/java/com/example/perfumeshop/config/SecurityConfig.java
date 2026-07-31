package com.example.perfumeshop.config;

import com.example.perfumeshop.security.AuthEntryPoint;
import com.example.perfumeshop.security.CustomAccessDeniedHandler;
import com.example.perfumeshop.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {

    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;

    @Autowired
    private AuthEntryPoint authEntryPoint;

    @Autowired
    private CustomAccessDeniedHandler accessDeniedHandler;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .formLogin(login -> login.disable())
            .httpBasic(basic -> basic.disable())
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint(authEntryPoint)
                .accessDeniedHandler(accessDeniedHandler)
            )
            .authorizeHttpRequests(auth -> auth

                // ======== PUBLIC — không cần token ========
                .requestMatchers("/api/auth/**").permitAll()
                // GET catalog công khai (sản phẩm, danh mục, thương hiệu)
                .requestMatchers(HttpMethod.GET, "/api/catalog/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/san-pham/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/danh-muc/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/thuong-hieu/**").permitAll()
                // Đánh giá sản phẩm hiển thị công khai trên trang chi tiết
                .requestMatchers(HttpMethod.GET, "/api/reviews/product/**").permitAll()
                // Xác nhận đơn hàng qua QR (khách không cần login)
                .requestMatchers("/api/don-hang/*/xac-nhan").permitAll()
                // Thanh toán callback (PayOS webhook)
                .requestMatchers("/api/payment/callback/**").permitAll()
                .requestMatchers("/api/payment/webhook/**").permitAll()
                // Campaign công khai (path thật: /api/public/campaigns/active)
                .requestMatchers(HttpMethod.GET, "/api/public/campaigns/active").permitAll()

                // Procurement: NCC xem phiếu gọi thầu — yêu cầu đăng nhập SUPPLIER hoặc nhân viên nội bộ

                // ======== SUPPLIER + NỘI BỘ — procurement endpoints dành cho NCC ========
                // NCC xem phiếu, gửi báo giá, đề xuất sản phẩm
                .requestMatchers(HttpMethod.GET, "/api/procurement/public").hasAnyRole("SUPPLIER", "ADMIN", "DIRECTOR", "STORE_MANAGER")
                .requestMatchers(HttpMethod.GET, "/api/procurement/public/**").hasAnyRole("SUPPLIER", "ADMIN", "DIRECTOR", "STORE_MANAGER")
                .requestMatchers(HttpMethod.POST, "/api/procurement/bulk-preview").hasRole("SUPPLIER")
                .requestMatchers(HttpMethod.POST, "/api/procurement/bulk-confirm").hasRole("SUPPLIER")
                .requestMatchers(HttpMethod.POST, "/api/procurement/de-xuat-san-pham-doc-lap").hasRole("SUPPLIER")
                .requestMatchers(HttpMethod.POST, "/api/procurement/*/bao-gia").hasRole("SUPPLIER")
                .requestMatchers(HttpMethod.POST, "/api/procurement/*/de-xuat-san-pham").hasRole("SUPPLIER")

                // ======== CHỈ ADMIN ROOT + DIRECTOR ========
                // Log đăng nhập — giám đốc giám sát
                .requestMatchers("/api/admin/login-logs/**").hasAnyRole("ADMIN", "DIRECTOR")

                // ======== CHỈ ADMIN ROOT ========
                .requestMatchers("/api/admin/nhan-vien/**").hasRole("ADMIN")
                // Xóa sản phẩm / danh mục / thương hiệu / campaign — ADMIN + DIRECTOR + STORE_MANAGER
                .requestMatchers(HttpMethod.DELETE, "/api/san-pham/**").hasAnyRole("ADMIN", "DIRECTOR", "STORE_MANAGER")
                .requestMatchers(HttpMethod.DELETE, "/api/danh-muc/**").hasAnyRole("ADMIN", "DIRECTOR", "STORE_MANAGER")
                .requestMatchers(HttpMethod.DELETE, "/api/thuong-hieu/**").hasAnyRole("ADMIN", "DIRECTOR", "STORE_MANAGER")
                .requestMatchers(HttpMethod.DELETE, "/api/admin/campaigns/**").hasAnyRole("ADMIN", "DIRECTOR", "STORE_MANAGER")

                // ======== ADMIN + DIRECTOR ========
                .requestMatchers("/api/admin/khach-hang/**").hasAnyRole("ADMIN", "DIRECTOR")
                .requestMatchers("/api/admin/dashboard/**").hasAnyRole("ADMIN", "DIRECTOR")
                .requestMatchers("/api/admin/reports/**").hasAnyRole("ADMIN", "DIRECTOR")

                // ======== ADMIN + DIRECTOR + STORE_MANAGER ========
                // CRUD sản phẩm / danh mục / thương hiệu (POST, PUT)
                .requestMatchers(HttpMethod.POST, "/api/san-pham/**").hasAnyRole("ADMIN", "DIRECTOR", "STORE_MANAGER")
                .requestMatchers(HttpMethod.PUT, "/api/san-pham/**").hasAnyRole("ADMIN", "DIRECTOR", "STORE_MANAGER")
                .requestMatchers(HttpMethod.POST, "/api/danh-muc/**").hasAnyRole("ADMIN", "DIRECTOR", "STORE_MANAGER")
                .requestMatchers(HttpMethod.PUT, "/api/danh-muc/**").hasAnyRole("ADMIN", "DIRECTOR", "STORE_MANAGER")
                .requestMatchers(HttpMethod.POST, "/api/thuong-hieu/**").hasAnyRole("ADMIN", "DIRECTOR", "STORE_MANAGER")
                .requestMatchers(HttpMethod.PUT, "/api/thuong-hieu/**").hasAnyRole("ADMIN", "DIRECTOR", "STORE_MANAGER")
                // Gọi thầu / duyệt đề xuất (các endpoint không public còn lại)
                .requestMatchers("/api/procurement/**").hasAnyRole("ADMIN", "DIRECTOR", "STORE_MANAGER")
                // Campaign quản trị
                .requestMatchers("/api/admin/campaigns/**").hasAnyRole("ADMIN", "DIRECTOR", "STORE_MANAGER")
                // Quản trị đánh giá (xem tất cả / xóa)
                .requestMatchers(HttpMethod.GET, "/api/reviews/all").hasAnyRole("ADMIN", "DIRECTOR", "STORE_MANAGER")
                .requestMatchers(HttpMethod.DELETE, "/api/reviews/**").hasAnyRole("ADMIN", "DIRECTOR", "STORE_MANAGER")
                // Duyệt đổi trả
                .requestMatchers(HttpMethod.GET, "/api/doi-tra/cho-duyet").hasAnyRole("ADMIN", "DIRECTOR", "STORE_MANAGER")
                .requestMatchers(HttpMethod.GET, "/api/doi-tra/all").hasAnyRole("ADMIN", "DIRECTOR", "STORE_MANAGER")
                .requestMatchers(HttpMethod.POST, "/api/doi-tra/*/duyet").hasAnyRole("ADMIN", "DIRECTOR", "STORE_MANAGER")
                .requestMatchers(HttpMethod.POST, "/api/doi-tra/*/xac-nhan-hoan-tien").hasAnyRole("ADMIN", "DIRECTOR", "STORE_MANAGER")
                .requestMatchers(HttpMethod.POST, "/api/doi-tra/*/tu-choi").hasAnyRole("ADMIN", "DIRECTOR", "STORE_MANAGER")

                // Duyệt cuối / từ chối PO — chỉ cấp quản lý (kho chỉ được kiểm hàng)
                .requestMatchers(HttpMethod.POST, "/api/kho/po/*/admin-duyet-cuoi").hasAnyRole("ADMIN", "DIRECTOR", "STORE_MANAGER")
                .requestMatchers(HttpMethod.POST, "/api/kho/po/*/admin-tu-choi").hasAnyRole("ADMIN", "DIRECTOR", "STORE_MANAGER")

                // ======== ADMIN + DIRECTOR + STORE_MANAGER + WAREHOUSE_STAFF ========
                .requestMatchers("/api/kho/**").hasAnyRole("ADMIN", "DIRECTOR", "STORE_MANAGER", "WAREHOUSE_STAFF")

                // ======== TẤT CẢ NHÂN VIÊN NỘI BỘ (route /api/admin còn lại) ========
                .requestMatchers("/api/admin/**").hasAnyRole("ADMIN", "DIRECTOR", "STORE_MANAGER", "WAREHOUSE_STAFF")

                // ======== ĐÃ ĐĂNG NHẬP (customer + employee) ========
                // Giỏ hàng, đặt hàng, lịch sử, hồ sơ, thanh toán, đổi trả — cần login
                .requestMatchers("/api/cart/**").authenticated()
                .requestMatchers("/api/dat-hang").authenticated()
                .requestMatchers("/api/don-hang/**").authenticated()
                .requestMatchers("/api/users/**").authenticated()
                .requestMatchers("/api/reviews/**").authenticated()
                .requestMatchers("/api/doi-tra/**").authenticated()
                .requestMatchers("/api/payment/**").authenticated()

                // Tất cả còn lại — từ chối mặc định
                .anyRequest().denyAll()
            )
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(
            "http://localhost:3000",
            "http://localhost:8080",
            "https://pendant-moustache-flask.ngrok-free.dev"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setExposedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
