package com.paradoks.agileproject.controller;

import com.paradoks.agileproject.dto.response.APPaged;
import com.paradoks.agileproject.dto.response.AnnouncementResponse;
import com.paradoks.agileproject.service.AnnouncementService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1")
public class AnnouncementController {
    private final AnnouncementService announcementService;

    public AnnouncementController(AnnouncementService announcementService) {
        this.announcementService = announcementService;
    }

    @GetMapping("/announcements")
    public ResponseEntity<APPaged<AnnouncementResponse>> getAnnouncements(
            @RequestParam(name = "page", defaultValue = "0") Integer pageNumber,
            @RequestParam(name = "size", defaultValue = "10") Integer pageSize
    ) {
        Page<AnnouncementResponse> pagedAnnouncementResponse = announcementService.getAnnouncements(pageNumber, pageSize);
        return ResponseEntity.ok(APPaged.from(pagedAnnouncementResponse));
    }
}
