package com.paradoks.agileproject.controller;

import com.paradoks.agileproject.dto.request.PageableRequestParams;
import com.paradoks.agileproject.dto.response.APPaged;
import com.paradoks.agileproject.dto.response.AnnouncementResponse;
import com.paradoks.agileproject.service.AnnouncementService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1")
public class AnnouncementController {
    private final AnnouncementService announcementService;

    public AnnouncementController(AnnouncementService announcementService) {
        this.announcementService = announcementService;
    }

    @Operation(
            summary = "Get paginated list of announcements",
            description = "Returns a paginated list of announcements with their id, title, content, date, and severity"
    )
    @GetMapping("/announcements")
    public ResponseEntity<APPaged<AnnouncementResponse>> getAnnouncements(
            @Validated @ModelAttribute PageableRequestParams page
    ) {
        Page<AnnouncementResponse> pagedAnnouncementResponse = announcementService.getAnnouncements(page.getPage(), page.getSize());
        return ResponseEntity.ok(APPaged.from(pagedAnnouncementResponse));
    }
}
