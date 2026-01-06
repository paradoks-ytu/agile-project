package com.paradoks.agileproject;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.paradoks.agileproject.dto.request.UserLoginRequest;
import com.paradoks.agileproject.dto.request.UserRegisterRequest;
import com.paradoks.agileproject.dto.request.UserUpdateRequest;
import com.paradoks.agileproject.model.VerificationCode;
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

import java.util.Arrays;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestConstructor(autowireMode = TestConstructor.AutowireMode.ALL)
public class UserAuthTests {

    private final MockMvc mockMvc;
    private final ObjectMapper objectMapper;
    private final VerificationCodeRepository verificationCodeRepository;

    public UserAuthTests(MockMvc mockMvc, ObjectMapper objectMapper, VerificationCodeRepository verificationCodeRepository) {
        this.mockMvc = mockMvc;
        this.objectMapper = objectMapper;
        this.verificationCodeRepository = verificationCodeRepository;
    }

    @Test
    @Transactional
    public void testUserRegisterVerifyAndLogin() throws Exception {
        String email = "newuser@example.com";
        String password = "StrongPassword123!";

        // 1. Register User
        UserRegisterRequest registerRequest = new UserRegisterRequest();
        registerRequest.setFirstName("John");
        registerRequest.setSecondName("Doe");
        registerRequest.setEmail(email);
        registerRequest.setPassword(password);

        mockMvc.perform(post("/api/v1/auth/user/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Verification code sent to email"));

        // 2. Get Verification Code from Repository
        VerificationCode verificationCode = verificationCodeRepository.findAll().stream()
                .filter(vc -> vc.getEmail().equals(email))
                .findFirst()
                .orElse(null);

        assertNotNull(verificationCode, "Verification code should exist in DB");
        String code = verificationCode.getCode();

        // 3. Verify User
        mockMvc.perform(post("/api/v1/auth/user/verify")
                        .param("email", email)
                        .param("code", code))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("User registered successfully"));

        // 4. Login User
        UserLoginRequest loginRequest = new UserLoginRequest();
        loginRequest.setEmail(email);
        loginRequest.setPassword(password);

        Cookie sessionCookie = mockMvc.perform(post("/api/v1/auth/user/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(cookie().exists("USER_SESSION"))
                .andReturn().getResponse().getCookie("USER_SESSION");

        // 5. Test /user/me (Verifies UserSessionService)
        mockMvc.perform(get("/api/v1/auth/user/me")
                        .cookie(sessionCookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(email))
                .andExpect(jsonPath("$.firstName").value("John"))
                .andExpect(jsonPath("$.lastName").value("Doe"));
    }

    @Test
    @Transactional
    public void testUpdateUser() throws Exception {
        String email = "updateuser@example.com";
        String password = "StrongPassword123!";

        // 1. Register User
        UserRegisterRequest registerRequest = new UserRegisterRequest();
        registerRequest.setFirstName("OriginalFirst");
        registerRequest.setSecondName("OriginalLast");
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
        assertNotNull(verificationCode);

        // 3. Verify User
        mockMvc.perform(post("/api/v1/auth/user/verify")
                        .param("email", email)
                        .param("code", verificationCode.getCode()))
                .andExpect(status().isOk());

        // 4. Login
        UserLoginRequest loginRequest = new UserLoginRequest();
        loginRequest.setEmail(email);
        loginRequest.setPassword(password);

        Cookie sessionCookie = mockMvc.perform(post("/api/v1/auth/user/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andReturn().getResponse().getCookie("USER_SESSION");

        // 5. Update User
        UserUpdateRequest updateRequest = new UserUpdateRequest();
        updateRequest.setFirstName("UpdatedFirst");
        updateRequest.setSecondName("UpdatedLast");
        updateRequest.setTags(Arrays.asList("developer", "java"));

        mockMvc.perform(put("/api/v1/auth/user")
                        .cookie(sessionCookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("UpdatedFirst"))
                .andExpect(jsonPath("$.lastName").value("UpdatedLast"))
                .andExpect(jsonPath("$.tags[0]").value("developer"))
                .andExpect(jsonPath("$.tags[1]").value("java"));
        
        // Verify update in DB
        mockMvc.perform(get("/api/v1/auth/user/me")
                .cookie(sessionCookie))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName").value("UpdatedFirst"))
                .andExpect(jsonPath("$.lastName").value("UpdatedLast"))
                .andExpect(jsonPath("$.tags[0]").value("developer"))
                .andExpect(jsonPath("$.tags[1]").value("java"));
    }

    @Test
    @Transactional
    public void testUserVerifyWithInvalidCode() throws Exception {
        String email = "invalidcode@example.com";
        String password = "StrongPassword123!";

        // Register User
        UserRegisterRequest registerRequest = new UserRegisterRequest();
        registerRequest.setFirstName("Jane");
        registerRequest.setSecondName("Doe");
        registerRequest.setEmail(email);
        registerRequest.setPassword(password);

        mockMvc.perform(post("/api/v1/auth/user/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isOk());

        // Verify with Wrong Code
        mockMvc.perform(post("/api/v1/auth/user/verify")
                        .param("email", email)
                        .param("code", "000000"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Invalid email or verification code"));
    }
}