package com.paradoks.agileproject.controller;

import com.paradoks.agileproject.dto.response.AnnouncementResponse;
import com.paradoks.agileproject.service.AnnouncementService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/v1")
public class AnnouncementController {
    private final AnnouncementService announcementService;

    public AnnouncementController(AnnouncementService announcementService) {
        this.announcementService = announcementService;
    }

    @GetMapping("/announcements")
    public ResponseEntity<Map<String, Object>> getAnnouncements(@RequestParam(name = "pageNumber", defaultValue = "0") Integer pageNumber,
                                        @RequestParam(name = "pageSize", defaultValue = "10") Integer pageSize) {
        Page<AnnouncementResponse> pagedAnnouncementResponse = announcementService.getAnnouncements(pageNumber, pageSize);
        return ResponseEntity.ok(
                Map.of(
                        "content", pagedAnnouncementResponse.getContent(),
                        "pageNumber", pagedAnnouncementResponse.getNumber(),
                        "pageSize", pagedAnnouncementResponse.getSize(),
                        "totalElements", pagedAnnouncementResponse.getTotalElements(),
                        "totalPages", pagedAnnouncementResponse.getTotalPages()
                )
        );
    }
}
