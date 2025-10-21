package com.paradoks.agileproject.repository;

import com.paradoks.agileproject.model.announcement.Announcement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnnouncementRepository extends JpaRepository<Integer, Announcement> {
}
