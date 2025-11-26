package com.paradoks.agileproject.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
public class RegisterRequest {
    @Schema(description = "Kullanıcının e-posta adresi", example = "example@mail.com")
    @NotBlank(message = "E-posta boş olamaz")
    @Length(max = 128, message = "E-posta fazla uzun")
    @Email(message = "Geçerli bir e-posta adresi girin", regexp = "^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")
    private String email;

    @Schema(description = "Kayıt olunacak kulübün adı", example = "Galatasaray SK")
    @NotBlank(message = "Kulüp adı boş olamaz")
    @Size(min = 2, max = 50, message = "Kulüp adı 2-50 karakter arasında olmalıdır")
    private String clubName;

    @Schema(description = "Kullanıcının hesabı için şifre", example = "StrongPass123!")
    @NotBlank(message = "Şifre boş olamaz")
    @Size(min = 8, message = "Şifre en az 8 karakter olmalıdır")
    private String password;
}