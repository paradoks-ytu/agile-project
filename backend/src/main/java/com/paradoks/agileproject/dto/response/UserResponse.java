package com.paradoks.agileproject.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

import java.util.List;

@Data
public class UserResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
    private List<String> tags;
    private LocalDateTime dateCreated;
}
