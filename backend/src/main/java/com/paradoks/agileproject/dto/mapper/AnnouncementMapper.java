package com.paradoks.agileproject.dto.mapper;

import com.paradoks.agileproject.dto.response.AnnouncementResponse;
import com.paradoks.agileproject.model.announcement.Announcement;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AnnouncementMapper {

    @Mapping(source = "creationDate", target = "date")
    AnnouncementResponse toResponse(Announcement announcement);

    Announcement toEntity(AnnouncementResponse announcementResponse);
}
