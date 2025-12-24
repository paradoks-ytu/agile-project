package com.paradoks.agileproject.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.hibernate.validator.constraints.Length;

@Data
public class UserRegisterRequest {
    @Schema(description = "User's first name", example = "John")
    @NotBlank(message = "First name cannot be blank")
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    private String firstName;

    @Schema(description = "User's second name", example = "Doe")
    @NotBlank(message = "Second name cannot be blank")
    @Size(min = 2, max = 50, message = "Second name must be between 2 and 50 characters")
    private String secondName;

    @Schema(description = "User's email address", example = "example@mail.com")
    @NotBlank(message = "Email cannot be blank")
    @Length(max = 128, message = "Email is too long")
    @Email(message = "Enter a valid email address", regexp = "^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")
    private String email;

    @Schema(description = "User's account password", example = "StrongPass123!")
    @NotBlank(message = "Password cannot be blank")
    @Size(min = 8, message = "Password must be at least 8 characters long")
    private String password;
}
