package com.paradoks.agileproject.controller;

import com.paradoks.agileproject.dto.mapper.ClubMapper;
import com.paradoks.agileproject.dto.request.LoginRequest;
import com.paradoks.agileproject.dto.request.RegisterRequest;
import com.paradoks.agileproject.dto.response.ApiResponse;
import com.paradoks.agileproject.dto.response.ClubResponse;
import com.paradoks.agileproject.exception.UnauthorizedException;
import com.paradoks.agileproject.model.SessionModel;
import com.paradoks.agileproject.service.ClubService;
import com.paradoks.agileproject.service.SessionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
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
    private final ClubMapper clubMapper;

    public AuthController(ClubService clubService, SessionService sessionService, ClubMapper clubMapper) {
        this.clubService = clubService;
        this.sessionService = sessionService;
        this.clubMapper = clubMapper;
    }

    @Operation(summary = "Yeni kulüp kaydı oluşturur")
    @PostMapping("/register")
    public ResponseEntity<ApiResponse> register(
            @Valid @RequestBody RegisterRequest request
    ) {
        ApiResponse response = clubService.register(request);
        return ResponseEntity.status(response.isSuccess() ? 200 : 400).body(response);
    }

    @Operation(summary = "Kulübün girişini yapar ve token cookie olarak döner")
    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response
    ) {
        String token = clubService.login(request);

        // Cookie oluştur
        Cookie cookie = new Cookie("SESSION_TOKEN", token);
        cookie.setHttpOnly(true);
        cookie.setPath("/"); // tüm API yollarında geçerli
        cookie.setMaxAge(24 * 60 * 60); // 24 saat
        response.addCookie(cookie);

        return ResponseEntity.ok(new ApiResponse(true, "Giriş başarılı"));
    }

    @Operation(summary = "Mevcut kulübün bilgilerini döner")
    @GetMapping("/me")
    public ResponseEntity<ClubResponse> me() {
        SessionModel session = sessionService.getCurrentSession()
                .orElseThrow(() -> new UnauthorizedException("No active session found"));

        return ResponseEntity.ok(clubMapper.clubToClubResponse(clubService.getClub(session.getClub().getId())));
    }
}