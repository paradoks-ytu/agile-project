package com.paradoks.agileproject.dto.mapper;

import com.paradoks.agileproject.dto.response.AnnouncementResponse;
import com.paradoks.agileproject.model.announcement.Announcement;
import org.mapstruct.Mapper;
import org.springframework.data.domain.Page;

@Mapper
public interface ResponseMapper {
    AnnouncementResponse toResponse(Announcement announcement);
    Announcement toEntity(AnnouncementResponse announcementResponse);
}
