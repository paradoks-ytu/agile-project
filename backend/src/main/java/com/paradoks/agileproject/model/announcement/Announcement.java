package com.paradoks.agileproject.model.announcement;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Data
public class Announcement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer announcementId;

    private String title;

    private String content;

    @CreationTimestamp
    @Column(updatable = false)
    private Instant creationDate;

    @CreationTimestamp
    @Column(updatable = false)
    private Instant endDate;

    @Enumerated(EnumType.STRING)
    private AnnouncementSeverity announcementSeverity;
}

