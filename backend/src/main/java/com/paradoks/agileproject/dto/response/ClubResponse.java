package com.paradoks.agileproject.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class ClubResponse {
    private Long id;
    private String name;
    private String description;
    private List<String> tags;
    private String profilePicture;
    private String banner;
}
