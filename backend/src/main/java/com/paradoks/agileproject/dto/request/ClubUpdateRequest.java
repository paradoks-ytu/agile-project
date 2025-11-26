package com.paradoks.agileproject.dto.request;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.util.List;

@Data
public class ClubUpdateRequest {
    @Size(max = 64, message = "Name can be max 64 characters")
    @Pattern(regexp = "^[a-zA-Z0-9 ]*$", message = "Name must contain only letters, numbers, and spaces")
    private String name;

    private String description;

    @Size(max = 64, message = "A club can have at most 64 tags")
    private List<@Size(max = 20, message = "Tags can be max 20 characters") @Pattern(regexp = "^[a-z]*$", message = "Tags must be lowercase and without spaces") String> tags;
}
