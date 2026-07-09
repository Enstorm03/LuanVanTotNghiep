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
                // GET sản phẩm, danh mục, thương hiệu công khai
                .requestMatchers(HttpMethod.GET, "/api/san-pham/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/danh-muc/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/thuong-hieu/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/categories/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/brands/**").permitAll()
                // Xác nhận đơn hàng qua QR (khách không cần login)
                .requestMatchers("/api/don-hang/*/xac-nhan").permitAll()
                // Thanh toán callback (PayOS webhook)
                .requestMatchers("/api/payment/callback/**").permitAll()
                .requestMatchers("/api/payment/webhook/**").permitAll()
                // Campaign công khai
                .requestMatchers(HttpMethod.GET, "/api/campaigns/active").permitAll()
                // Procurement: NCC xem phiếu gọi thầu công khai
                .requestMatchers(HttpMethod.GET, "/api/procurement/public").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/procurement/public/**").permitAll()
                // Procurement: NCC chào hàng — tất cả public, không cần login
                .requestMatchers(HttpMethod.POST, "/api/procurement/bulk-preview").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/procurement/bulk-confirm").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/procurement/de-xuat-san-pham-doc-lap").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/procurement/*/bao-gia").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/procurement/*/de-xuat-san-pham").permitAll()

                // ======== CHỈ ADMIN ROOT ========
                .requestMatchers("/api/admin/nhan-vien/**").hasRole("ADMIN")
                .requestMatchers("/api/admin/khach-hang/**").hasRole("ADMIN")
                .requestMatchers("/api/admin/reports/profit-margin").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/admin/products/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/admin/campaigns/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/admin/categories/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/admin/brands/**").hasRole("ADMIN")

                // ======== ADMIN + DIRECTOR ========
                .requestMatchers("/api/admin/dashboard/**").hasAnyRole("ADMIN", "DIRECTOR")
                .requestMatchers("/api/admin/reports/**").hasAnyRole("ADMIN", "DIRECTOR")

                // ======== ADMIN + DIRECTOR + STORE_MANAGER ========
                .requestMatchers("/api/admin/procurement/**").hasAnyRole("ADMIN", "DIRECTOR", "STORE_MANAGER")
                .requestMatchers("/api/admin/campaigns/**").hasAnyRole("ADMIN", "DIRECTOR", "STORE_MANAGER")

                // ======== ADMIN + DIRECTOR + STORE_MANAGER + WAREHOUSE_STAFF ========
                .requestMatchers("/api/admin/kho/**").hasAnyRole("ADMIN", "DIRECTOR", "STORE_MANAGER", "WAREHOUSE_STAFF")
                .requestMatchers("/api/admin/import-kho/**").hasAnyRole("ADMIN", "DIRECTOR", "STORE_MANAGER", "WAREHOUSE_STAFF")
                .requestMatchers("/api/admin/near-expiry/**").hasAnyRole("ADMIN", "DIRECTOR", "STORE_MANAGER", "WAREHOUSE_STAFF")

                // ======== TẤT CẢ NHÂN VIÊN NỘI BỘ ========
                .requestMatchers("/api/admin/**").hasAnyRole("ADMIN", "DIRECTOR", "STORE_MANAGER", "WAREHOUSE_STAFF")

                // ======== ĐÃ ĐĂNG NHẬP (customer + employee) ========
                // Giỏ hàng, đặt hàng, lịch sử — cần login
                .requestMatchers("/api/cart/**").authenticated()
                .requestMatchers("/api/don-hang/**").authenticated()
                .requestMatchers("/api/orders/**").authenticated()
                .requestMatchers("/api/user/**").authenticated()
                .requestMatchers("/api/reviews/**").authenticated()
                .requestMatchers("/api/returns/**").authenticated()

                // Tất cả còn lại — cho phép (GET public data)
                .anyRequest().permitAll()
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
