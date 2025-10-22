package com.paradoks.agileproject.service;

import com.paradoks.agileproject.dto.mapper.ResponseMapper;
import com.paradoks.agileproject.dto.response.AnnouncementResponse;
import com.paradoks.agileproject.model.announcement.Announcement;
import com.paradoks.agileproject.repository.AnnouncementRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.stream.Collectors;

@Service
public class AnnouncementServiceImpl implements AnnouncementService {

    private final AnnouncementRepository announcementRepository;
    private final ResponseMapper responseMapper;

    public AnnouncementServiceImpl(AnnouncementRepository announcementRepository, ResponseMapper responseMapper) {
        this.announcementRepository = announcementRepository;
        this.responseMapper = responseMapper;
    }

    @Override
    public Page<AnnouncementResponse> getAnnouncements(Integer pageNumber, Integer pageSize) {
        Pageable pageDetails = PageRequest.of(pageNumber, pageSize);
        Page<Announcement> pagedAnnouncement;
        pagedAnnouncement = announcementRepository.findActiveAnnouncements(pageDetails, Instant.now());
        return responseMapper.toPagedResponse(pagedAnnouncement);
    }
}
