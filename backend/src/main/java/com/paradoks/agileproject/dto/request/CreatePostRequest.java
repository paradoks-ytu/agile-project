package com.paradoks.agileproject.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreatePostRequest {
    @NotEmpty(message = "Title is mandatory")
    @Size(max = 255, message = "Title can be max 255 characters")
    private String title;

    @NotEmpty(message = "Content is mandatory")
    private String content;
}
