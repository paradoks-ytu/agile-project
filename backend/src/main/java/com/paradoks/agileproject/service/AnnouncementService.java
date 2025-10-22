package com.paradoks.agileproject.service;

import com.paradoks.agileproject.dto.response.AnnouncementResponse;
import org.springframework.data.domain.Page;

public interface AnnouncementService {
    Page<AnnouncementResponse> getAnnouncements(Integer pageNumber, Integer pageSize);
}
