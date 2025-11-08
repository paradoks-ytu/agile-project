package com.paradoks.agileproject.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {

    @Schema(description = "Kullanıcının e-posta adresi", example = "example@mail.com")
    @NotBlank(message = "E-posta boş olamaz")
    @Email(message = "Geçerli bir e-posta adresi girin")
    private String email;

    @Schema(description = "Kullanıcının hesabı için şifre", example = "StrongPass123!")
    @NotBlank(message = "Şifre boş olamaz")
    private String password;
}