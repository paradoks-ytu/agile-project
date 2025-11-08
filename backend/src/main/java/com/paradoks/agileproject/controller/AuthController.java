package com.paradoks.agileproject.controller;

import com.paradoks.agileproject.dto.request.LoginRequest;
import com.paradoks.agileproject.dto.request.RegisterRequest;
import com.paradoks.agileproject.dto.response.ApiResponse;
import com.paradoks.agileproject.model.SessionModel;
import com.paradoks.agileproject.service.ClubService;
import com.paradoks.agileproject.service.SessionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Authentication", description = "Kayıt ve giriş işlemleri")
@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {

    private final ClubService clubService;
    private final SessionService sessionService;

    public AuthController(ClubService clubService, SessionService sessionService) {
        this.clubService = clubService;
        this.sessionService = sessionService;
    }

    @Operation(summary = "Yeni kullanıcı kaydı oluşturur")
    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        ApiResponse response = clubService.register(request);
        return ResponseEntity.status(response.isSuccess() ? 200 : 400).body(response);
    }

    @Operation(summary = "Kullanıcı girişi yapar ve token cookie olarak döner")
    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response
    ) {
        String token = clubService.login(request);

        // Kullanıcı bilgilerini al
        SessionModel session = sessionService.getActiveSessionByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Session oluşturulamadı"));

        // Cookie oluştur
        Cookie cookie = new Cookie("SESSION_TOKEN", session.getToken());
        cookie.setHttpOnly(true);
        cookie.setPath("/"); // tüm API yollarında geçerli
        cookie.setMaxAge(24 * 60 * 60); // 24 saat
        response.addCookie(cookie);

        return ResponseEntity.ok(new ApiResponse(true, "Giriş başarılı"));
    }}