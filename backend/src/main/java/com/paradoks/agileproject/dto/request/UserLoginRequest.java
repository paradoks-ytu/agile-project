package com.paradoks.agileproject.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UserLoginRequest {

    @Schema(description = "User's email address", example = "example@mail.com")
    @NotBlank(message = "Email cannot be blank")
    @Email(message = "Enter a valid email address")
    private String email;

    @Schema(description = "User's account password", example = "StrongPass123!")
    @NotBlank(message = "Password cannot be blank")
    private String password;
}
