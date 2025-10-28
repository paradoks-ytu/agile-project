package com.paradoks.agileproject.dto.response;

import com.paradoks.agileproject.model.announcement.AnnouncementSeverity;
import lombok.Data;

import java.time.Instant;

@Data
public class AnnouncementResponse {
    private Integer id;

    private String title;

    private String content;

    private Instant date;

    private AnnouncementSeverity severity;
}
