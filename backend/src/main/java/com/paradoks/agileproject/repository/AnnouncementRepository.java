package com.paradoks.agileproject.repository;

import com.paradoks.agileproject.dto.response.AnnouncementResponse;
import com.paradoks.agileproject.model.announcement.Announcement;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;

@Repository
public interface AnnouncementRepository extends JpaRepository<Announcement, Integer> {

    @Query("SELECT a from Announcement a WHERE a.endDate >= :currentDate")
    Page<Announcement> findActiveAnnouncements(Pageable pageDetails, @Param("currentDate") Instant currentDate);
}
