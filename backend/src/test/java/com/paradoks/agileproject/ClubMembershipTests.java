package com.paradoks.agileproject;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.paradoks.agileproject.dto.request.LoginRequest;
import com.paradoks.agileproject.dto.request.RegisterRequest;
import com.paradoks.agileproject.dto.request.UserLoginRequest;
import com.paradoks.agileproject.dto.request.UserRegisterRequest;
import com.paradoks.agileproject.model.ClubModel;
import com.paradoks.agileproject.model.VerificationCode;
import com.paradoks.agileproject.repository.ClubRepository;
import com.paradoks.agileproject.repository.VerificationCodeRepository;
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

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestConstructor(autowireMode = TestConstructor.AutowireMode.ALL)
public class ClubMembershipTests {

    private final MockMvc mockMvc;
    private final ObjectMapper objectMapper;
    private final ClubRepository clubRepository;
    private final VerificationCodeRepository verificationCodeRepository;

    public ClubMembershipTests(MockMvc mockMvc, ObjectMapper objectMapper, ClubRepository clubRepository, VerificationCodeRepository verificationCodeRepository) {
        this.mockMvc = mockMvc;
        this.objectMapper = objectMapper;
        this.clubRepository = clubRepository;
        this.verificationCodeRepository = verificationCodeRepository;
    }

    private Cookie registerAndLoginUser(String email, String password) throws Exception {
        // 1. Register User
        UserRegisterRequest registerRequest = new UserRegisterRequest();
        registerRequest.setFirstName("John");
        registerRequest.setSecondName("Doe");
        registerRequest.setEmail(email);
        registerRequest.setPassword(password);

        mockMvc.perform(post("/api/v1/auth/user/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isOk());

        // 2. Get Verification Code
        VerificationCode verificationCode = verificationCodeRepository.findAll().stream()
                .filter(vc -> vc.getEmail().equals(email))
                .findFirst()
                .orElse(null);

        assertNotNull(verificationCode, "Verification code should exist in DB");

        // 3. Verify User
        mockMvc.perform(post("/api/v1/auth/user/verify")
                        .param("email", email)
                        .param("code", verificationCode.getCode()))
                .andExpect(status().isOk());

        // 4. Login User
        UserLoginRequest loginRequest = new UserLoginRequest();
        loginRequest.setEmail(email);
        loginRequest.setPassword(password);

        return mockMvc.perform(post("/api/v1/auth/user/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getCookie("USER_SESSION");
    }

    private void registerClub(String clubName, String email, String password) throws Exception {
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setClubName(clubName);
        registerRequest.setEmail(email);
        registerRequest.setPassword(password);

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isOk());
    }

    @Test
    @Transactional
    public void testJoinAndLeaveClub() throws Exception {
        // Register Club
        String clubEmail = "membershipclub@example.com";
        registerClub("Membership Club", clubEmail, "password");
        ClubModel club = clubRepository.findByEmail(clubEmail).orElseThrow();

        // Register and Login User
        String userEmail = "member@example.com";
        Cookie userSession = registerAndLoginUser(userEmail, "Password123!");

        // 1. Join Club
        mockMvc.perform(post("/api/v1/clubs/" + club.getId() + "/membership")
                        .cookie(userSession))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Successfully joined the club"));

        // 2. Verify Membership in List
        mockMvc.perform(get("/api/v1/clubs/" + club.getId() + "/members")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].email").value(userEmail));

        // 3. Leave Club
        mockMvc.perform(post("/api/v1/clubs/" + club.getId() + "/membership")
                        .cookie(userSession))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Successfully left the club"));

        // 4. Verify Membership Removed
        mockMvc.perform(get("/api/v1/clubs/" + club.getId() + "/members")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isEmpty());
    }
}
