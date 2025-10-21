package com.paradoks.agileproject.dto.response;

import com.paradoks.agileproject.model.announcement.AnnouncementSeverity;
import java.time.Instant;

public class AnnouncementResponse {
    private Integer announcementId;

    private String title;

    private String content;

    private Instant creationDate;

    private AnnouncementSeverity announcementSeverity;
}
