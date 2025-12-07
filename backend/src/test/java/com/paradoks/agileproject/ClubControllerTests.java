package com.paradoks.agileproject;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.paradoks.agileproject.dto.request.ClubUpdateRequest;
import com.paradoks.agileproject.dto.request.LoginRequest;
import com.paradoks.agileproject.dto.request.RegisterRequest;
import com.paradoks.agileproject.model.ClubModel;
import com.paradoks.agileproject.repository.ClubRepository;
import jakarta.servlet.http.Cookie;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestConstructor;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.Collections;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch; // Added import
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import com.paradoks.agileproject.dto.request.ClubDescriptionUpdateRequest; // Added import

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestConstructor(autowireMode = TestConstructor.AutowireMode.ALL)
public class ClubControllerTests {

    private final MockMvc mockMvc;
    private final ObjectMapper objectMapper;
    private final ClubRepository clubRepository;

    public ClubControllerTests(MockMvc mockMvc, ObjectMapper objectMapper, ClubRepository clubRepository) {
        this.mockMvc = mockMvc;
        this.objectMapper = objectMapper;
        this.clubRepository = clubRepository;
    }

    private Cookie registerAndLogin(String clubName, String email, String password) throws Exception {
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setClubName(clubName);
        registerRequest.setEmail(email);
        registerRequest.setPassword(password);

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isOk());

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail(email);
        loginRequest.setPassword(password);

        return mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getCookie("SESSION_TOKEN");
    }

    @Test
    @Transactional
    public void testUpdateClub() throws Exception {
        Cookie sessionCookie = registerAndLogin("Update Club", "update@example.com", "password");
        ClubModel club = clubRepository.findByEmail("update@example.com").get();

        // Update club details
        ClubUpdateRequest updateRequest = new ClubUpdateRequest();
        updateRequest.setName("Updated Club Name");
        updateRequest.setDescription("Updated Description");
        updateRequest.setTags(Arrays.asList("tagone", "tagtwo"));

        mockMvc.perform(put("/api/v1/clubs")
                        .cookie(sessionCookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Club Name"))
                .andExpect(jsonPath("$.description").value("Updated Description"))
                .andExpect(jsonPath("$.tags[0]").value("tagone"))
                .andExpect(jsonPath("$.tags[1]").value("tagtwo"));
    }

    @Test
    @Transactional
    public void testUpdateClubWithInvalidName() throws Exception {
        Cookie sessionCookie = registerAndLogin("Invalid Name Club", "invalidname@example.com", "password");
        ClubModel club = clubRepository.findByEmail("invalidname@example.com").get();

        ClubUpdateRequest updateRequest = new ClubUpdateRequest();
        updateRequest.setName("Invalid Name <>");
        updateRequest.setDescription("Description");
        updateRequest.setTags(Collections.singletonList("valid"));

        mockMvc.perform(put("/api/v1/clubs")
                        .cookie(sessionCookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @Transactional
    public void testUpdateClubWithInvalidTags() throws Exception {
        Cookie sessionCookie = registerAndLogin("Invalid Tags Club", "invalidtags@example.com", "password");
        ClubModel club = clubRepository.findByEmail("invalidtags@example.com").get();

        ClubUpdateRequest updateRequest = new ClubUpdateRequest();
        updateRequest.setName("Valid Name");
        updateRequest.setDescription("Description");
        updateRequest.setTags(Arrays.asList("valid", "Invalid"));

        mockMvc.perform(put("/api/v1/clubs")
                        .cookie(sessionCookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @Transactional
    public void testUpdateClubWithTooLongTag() throws Exception {
        Cookie sessionCookie = registerAndLogin("Long Tag Club", "longtag@example.com", "password");
        ClubModel club = clubRepository.findByEmail("longtag@example.com").get();

        ClubUpdateRequest updateRequest = new ClubUpdateRequest();
        updateRequest.setName("Valid Name");
        updateRequest.setDescription("Description");
        updateRequest.setTags(Collections.singletonList("thisisareallylongtagthatshouldfailvalidation"));

        mockMvc.perform(put("/api/v1/clubs")
                        .cookie(sessionCookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isBadRequest());
    }    @Test
    @Transactional
    public void testUpdateClubWithTooManyTags() throws Exception {
        Cookie sessionCookie = registerAndLogin("Too Many Tags Club", "toomanytags@example.com", "password");
        ClubModel club = clubRepository.findByEmail("toomanytags@example.com").get();

        ClubUpdateRequest updateRequest = new ClubUpdateRequest();
        updateRequest.setName("Valid Name");
        updateRequest.setDescription("Description");
        
        // Create a list with 65 tags
        String[] tooManyTags = new String[65];
        for (int i = 0; i < 65; i++) {
            tooManyTags[i] = "a";
        }
        updateRequest.setTags(Arrays.asList(tooManyTags));

        mockMvc.perform(put("/api/v1/clubs")
                        .cookie(sessionCookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @Transactional
    public void testUpdateClubOnlyDescriptionSet() throws Exception {
        Cookie sessionCookie = registerAndLogin("Partial Update Club", "partialupdate@example.com", "password");
        ClubModel club = clubRepository.findByEmail("partialupdate@example.com").get();

        // Initial full update
        ClubUpdateRequest initialUpdateRequest = new ClubUpdateRequest();
        initialUpdateRequest.setName("Original Name");
        initialUpdateRequest.setDescription("Original Description");
        initialUpdateRequest.setTags(Arrays.asList("initialone", "initialtwo"));

        mockMvc.perform(put("/api/v1/clubs")
                        .cookie(sessionCookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(initialUpdateRequest)))
                .andExpect(status().isOk());

        // Update only description
        ClubUpdateRequest partialUpdateRequest = new ClubUpdateRequest();
        partialUpdateRequest.setDescription("New Description Only");

        mockMvc.perform(put("/api/v1/clubs")
                        .cookie(sessionCookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(partialUpdateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Original Name")) // Name should remain unchanged
                .andExpect(jsonPath("$.description").value("New Description Only")) // Description should be updated
                .andExpect(jsonPath("$.tags[0]").value("initialone")) // Tags should remain unchanged
                .andExpect(jsonPath("$.tags[1]").value("initialtwo"));
    }

    @Test
    @Transactional
    public void testUpdateClubDescription() throws Exception {
        Cookie sessionCookie = registerAndLogin("Description Club", "description@example.com", "password");
        ClubModel club = clubRepository.findByEmail("description@example.com").get();

        // Set initial name and tags
        ClubUpdateRequest initialUpdateRequest = new ClubUpdateRequest();
        initialUpdateRequest.setName("Description Club");
        initialUpdateRequest.setTags(Arrays.asList("validtagone", "validtagtwo"));
        mockMvc.perform(put("/api/v1/clubs")
                        .cookie(sessionCookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(initialUpdateRequest)))
                .andExpect(status().isOk());

        // Update only the description
        ClubDescriptionUpdateRequest descriptionUpdateRequest = new ClubDescriptionUpdateRequest();
        descriptionUpdateRequest.setDescription("This is the new *Markdown* description.");

        mockMvc.perform(put("/api/v1/clubs/description")
                        .cookie(sessionCookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(descriptionUpdateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.description").value("This is the new *Markdown* description."))
                .andExpect(jsonPath("$.name").value("Description Club")) // Name should not change
                .andExpect(jsonPath("$.tags[0]").value("validtagone")) // Tags should not change
                .andExpect(jsonPath("$.tags[1]").value("validtagtwo")); // Tags should not change
    }

    @Test
    @Transactional
    public void testListClubs() throws Exception {
        // Register multiple clubs
        registerAndLogin("Club One", "clubone@example.com", "password");
        registerAndLogin("Club Two", "clubtwo@example.com", "password");
        registerAndLogin("Club Three", "clubthree@example.com", "password");

        // Test default pagination (page 0, size 30 by default in PageableRequestParams)
        mockMvc.perform(get("/api/v1/clubs")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content.length()").value(3))
                .andExpect(jsonPath("$.page").value(0))
                .andExpect(jsonPath("$.size").value(30))
                .andExpect(jsonPath("$.totalElements").value(3));
    }
}
