package com.paradoks.agileproject.dto.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PostResponse {
    private Long id;
    private String title;
    private String content;
    private ClubResponse club;
    private LocalDateTime creationDate;
}
