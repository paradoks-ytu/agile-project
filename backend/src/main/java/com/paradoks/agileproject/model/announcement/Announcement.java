package com.paradoks.agileproject.model.announcement;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Announcement {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer announcementId;

    private String title;

    private String content;

    @CreationTimestamp
    @Column(updatable = false)
    private Instant creationDate;

    @Column(updatable = false)
    private Instant endDate;

    @Enumerated(EnumType.STRING)
    private AnnouncementSeverity announcementSeverity;
}

