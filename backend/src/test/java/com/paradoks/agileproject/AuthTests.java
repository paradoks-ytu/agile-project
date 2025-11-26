package com.paradoks.agileproject;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.paradoks.agileproject.dto.request.LoginRequest;
import com.paradoks.agileproject.dto.request.RegisterRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.springframework.test.context.TestConstructor;
import jakarta.servlet.http.Cookie;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestConstructor(autowireMode = TestConstructor.AutowireMode.ALL)
public class AuthTests {

    private final MockMvc mockMvc;
    private final ObjectMapper objectMapper;

    public AuthTests(MockMvc mockMvc, ObjectMapper objectMapper) {
        this.mockMvc = mockMvc;
        this.objectMapper = objectMapper;
    }

    @Test
    @Transactional
    public void testRegisterAndLogin() throws Exception {
        // Register
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setClubName("Test Club");
        registerRequest.setEmail("test@example.com");
        registerRequest.setPassword("password");

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        // Login
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("test@example.com");
        loginRequest.setPassword("password");

        mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(cookie().exists("SESSION_TOKEN"))
                .andExpect(jsonPath("$.success").value(true));
    }

    @Test
    @Transactional
    public void testMeEndpoint() throws Exception {
        // Register a user
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setClubName("Me Club");
        registerRequest.setEmail("me@example.com");
        registerRequest.setPassword("password");

        mockMvc.perform(post("/api/v1/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(registerRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        // Login to get session token
        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("me@example.com");
        loginRequest.setPassword("password");

        Cookie sessionCookie = mockMvc.perform(post("/api/v1/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(cookie().exists("SESSION_TOKEN"))
                .andExpect(jsonPath("$.success").value(true))
                .andReturn().getResponse().getCookie("SESSION_TOKEN");

        // Access /me endpoint with the session token
        mockMvc.perform(get("/api/v1/auth/me")
                        .cookie(sessionCookie))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.name").value("Me Club"))
                .andExpect(jsonPath("$.description").isEmpty()); // Description is null by default for new clubs
    }
}
