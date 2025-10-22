package com.paradoks.agileproject;

import com.paradoks.agileproject.model.announcement.Announcement;
import com.paradoks.agileproject.model.announcement.AnnouncementSeverity;
import com.paradoks.agileproject.repository.AnnouncementRepository;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import static java.lang.Thread.sleep;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;


import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
public class AnnouncementTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private AnnouncementRepository announcementRepository;

    @Test
    public void testActiveAnnouncements() throws Exception {
        Announcement announcement = Announcement.builder()
                .title("Cok onemli bir uyari mesaji")
                .announcementSeverity(AnnouncementSeverity.WARNING)
                .content("Yakinda Hizmetinizdeyiz!")
                .endDate(Instant.now().plus(7, ChronoUnit.DAYS))
                .build();

        announcementRepository.saveAndFlush(announcement);

        ResultActions result = mockMvc.perform(get("/api/v1/announcements?pageNumber=0&pageSize=10"));
        result.andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.content[0].announcementId").value(announcement.getAnnouncementId()))
                .andExpect(jsonPath("$.content[0].title").value(announcement.getTitle()))
                .andExpect(jsonPath("$.content[0].content").value(announcement.getContent()))
                .andExpect(jsonPath("$.content[0].announcementSeverity").value(announcement.getAnnouncementSeverity().toString()));
    }
}
