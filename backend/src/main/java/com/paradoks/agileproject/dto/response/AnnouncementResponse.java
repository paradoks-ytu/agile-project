package com.paradoks.agileproject.dto.response;

import com.paradoks.agileproject.model.announcement.AnnouncementSeverity;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

import java.time.Instant;

@Data
@Schema(description = "Announcement response DTO")
public class AnnouncementResponse {

    @Schema(description = "Unique identifier of the announcement", example = "1")
    private Integer id;

    @Schema(description = "Title of the announcement", example = "System Maintenance Scheduled")
    private String title;

    @Schema(description = "Content of the announcement", example = "The system will be under maintenance on Sunday at 2 AM.")
    private String content;

    @Schema(description = "Date of the announcement (UTC time)", example = "2025-10-28T14:44:49Z")
    private Instant date;

    @Schema(description = "Severity level of the announcement", example = "INFO")
    private AnnouncementSeverity severity;
}
