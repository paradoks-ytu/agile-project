package com.paradoks.agileproject.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class UserUpdateRequest {
    @Schema(description = "User's first name", example = "John")
    @Size(min = 2, max = 50, message = "First name must be between 2 and 50 characters")
    private String firstName;

    @Schema(description = "User's second name (last name)", example = "Doe")
    @Size(min = 2, max = 50, message = "Second name must be between 2 and 50 characters")
    private String secondName;

    @Schema(description = "User's tags", example = "[\"developer\", \"java\"]")
    @Size(max = 20, message = "A user can have at most 20 tags")
    private List<@Size(max = 20, message = "Tags can be max 20 characters") String> tags;
}
