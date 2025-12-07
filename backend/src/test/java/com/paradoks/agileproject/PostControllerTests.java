package com.paradoks.agileproject;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.paradoks.agileproject.dto.request.CreatePostRequest;
import com.paradoks.agileproject.dto.request.LoginRequest;
import com.paradoks.agileproject.dto.request.RegisterRequest;
import com.paradoks.agileproject.model.ClubModel;
import com.paradoks.agileproject.repository.ClubRepository;
import com.paradoks.agileproject.repository.PostRepository;
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

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestConstructor(autowireMode = TestConstructor.AutowireMode.ALL)
public class PostControllerTests {

    private final MockMvc mockMvc;
    private final ObjectMapper objectMapper;
    private final ClubRepository clubRepository;
    private final PostRepository postRepository;

    public PostControllerTests(MockMvc mockMvc, ObjectMapper objectMapper, ClubRepository clubRepository, PostRepository postRepository) {
        this.mockMvc = mockMvc;
        this.objectMapper = objectMapper;
        this.clubRepository = clubRepository;
        this.postRepository = postRepository;
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
    public void testCreatePostSuccessfully() throws Exception {
        Cookie sessionCookie = registerAndLogin("Post Club", "postclub@example.com", "password");

        CreatePostRequest createPostRequest = new CreatePostRequest();
        createPostRequest.setTitle("Test Post");
        createPostRequest.setContent("This is the content of the test post.");

        mockMvc.perform(post("/api/v1/posts")
                        .cookie(sessionCookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createPostRequest)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.title").value("Test Post"))
                .andExpect(jsonPath("$.content").value("This is the content of the test post."))
                .andExpect(jsonPath("$.club.name").value("Post Club"));
    }

    @Test
    @Transactional
    public void testCreatePostUnauthorized() throws Exception {
        CreatePostRequest createPostRequest = new CreatePostRequest();
        createPostRequest.setTitle("Test Post");
        createPostRequest.setContent("This is the content of the test post.");

        mockMvc.perform(post("/api/v1/posts")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createPostRequest)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @Transactional
    public void testCreatePostWithMissingTitle() throws Exception {
        Cookie sessionCookie = registerAndLogin("Post Club Missing Title", "postclubmissingtitle@example.com", "password");

        CreatePostRequest createPostRequest = new CreatePostRequest();
        createPostRequest.setContent("This is the content of the test post.");

        mockMvc.perform(post("/api/v1/posts")
                        .cookie(sessionCookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createPostRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    @Transactional
    public void testCreatePostWithMissingContent() throws Exception {
        Cookie sessionCookie = registerAndLogin("Post Club Missing Content", "postclubmissingcontent@example.com", "password");

        CreatePostRequest createPostRequest = new CreatePostRequest();
        createPostRequest.setTitle("Test Post");

        mockMvc.perform(post("/api/v1/posts")
                        .cookie(sessionCookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createPostRequest)))
                .andExpect(status().isBadRequest());
    }
    @Test
    @Transactional
    public void testGetPostById() throws Exception {
        Cookie sessionCookie = registerAndLogin("GetPostClub", "getpostclub@example.com", "password");
        CreatePostRequest createPostRequest = new CreatePostRequest();
        createPostRequest.setTitle("Test Post");
        createPostRequest.setContent("This is the content of the test post.");

        String response = mockMvc.perform(post("/api/v1/posts")
                        .cookie(sessionCookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createPostRequest)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        long postId = objectMapper.readTree(response).get("id").asLong();

        mockMvc.perform(get("/api/v1/posts/" + postId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(postId))
                .andExpect(jsonPath("$.title").value("Test Post"))
                .andExpect(jsonPath("$.content").value("This is the content of the test post."));
    }

    @Test
    @Transactional
    public void testDeletePostSuccessfully() throws Exception {
        Cookie sessionCookie = registerAndLogin("DeletePostClub", "deletepostclub@example.com", "password");
        CreatePostRequest createPostRequest = new CreatePostRequest();
        createPostRequest.setTitle("Test Post");
        createPostRequest.setContent("This is the content of the test post.");

        String response = mockMvc.perform(post("/api/v1/posts")
                        .cookie(sessionCookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createPostRequest)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        long postId = objectMapper.readTree(response).get("id").asLong();

        mockMvc.perform(delete("/api/v1/posts/" + postId)
                        .cookie(sessionCookie))
                .andExpect(status().isNoContent());
    }

    @Test
    @Transactional
    public void testDeletePostUnauthorized() throws Exception {
        Cookie ownerCookie = registerAndLogin("OwnerClub", "owner@example.com", "password");
        Cookie otherUserCookie = registerAndLogin("OtherUserClub", "otheruser@example.com", "password");

        CreatePostRequest createPostRequest = new CreatePostRequest();
        createPostRequest.setTitle("Test Post");
        createPostRequest.setContent("This is the content of the test post.");

        String response = mockMvc.perform(post("/api/v1/posts")
                        .cookie(ownerCookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createPostRequest)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        long postId = objectMapper.readTree(response).get("id").asLong();

        mockMvc.perform(delete("/api/v1/posts/" + postId)
                        .cookie(otherUserCookie))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @Transactional
    public void testUpdatePostSuccessfully() throws Exception {
        Cookie sessionCookie = registerAndLogin("UpdatePostClub", "updatepostclub@example.com", "password");
        CreatePostRequest createPostRequest = new CreatePostRequest();
        createPostRequest.setTitle("Original Title");
        createPostRequest.setContent("Original Content");

        String response = mockMvc.perform(post("/api/v1/posts")
                        .cookie(sessionCookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createPostRequest)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        long postId = objectMapper.readTree(response).get("id").asLong();

        CreatePostRequest updatePostRequest = new CreatePostRequest();
        updatePostRequest.setTitle("Updated Title");
        updatePostRequest.setContent("Updated Content");

        mockMvc.perform(put("/api/v1/posts/" + postId)
                        .cookie(sessionCookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatePostRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Title"))
                .andExpect(jsonPath("$.content").value("Updated Content"));
    }

    @Test
    @Transactional
    public void testUpdatePostUnauthorized() throws Exception {
        Cookie ownerCookie = registerAndLogin("UpdateOwnerClub", "updateowner@example.com", "password");
        Cookie otherUserCookie = registerAndLogin("UpdateOtherUserClub", "updateotheruser@example.com", "password");

        CreatePostRequest createPostRequest = new CreatePostRequest();
        createPostRequest.setTitle("Test Post");
        createPostRequest.setContent("This is the content of the test post.");

        String response = mockMvc.perform(post("/api/v1/posts")
                        .cookie(ownerCookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createPostRequest)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        long postId = objectMapper.readTree(response).get("id").asLong();

        CreatePostRequest updatePostRequest = new CreatePostRequest();
        updatePostRequest.setTitle("Updated Title");
        updatePostRequest.setContent("Updated Content");

        mockMvc.perform(put("/api/v1/posts/" + postId)
                        .cookie(otherUserCookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatePostRequest)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @Transactional
    public void testUpdatePostWithInvalidData() throws Exception {
        Cookie sessionCookie = registerAndLogin("InvalidUpdateClub", "invalidupdate@example.com", "password");
        CreatePostRequest createPostRequest = new CreatePostRequest();
        createPostRequest.setTitle("Original Title");
        createPostRequest.setContent("Original Content");

        String response = mockMvc.perform(post("/api/v1/posts")
                        .cookie(sessionCookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createPostRequest)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString();

        long postId = objectMapper.readTree(response).get("id").asLong();

        CreatePostRequest updatePostRequest = new CreatePostRequest();
        updatePostRequest.setTitle(""); // Invalid empty title

        mockMvc.perform(put("/api/v1/posts/" + postId)
                        .cookie(sessionCookie)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatePostRequest)))
                .andExpect(status().isBadRequest());
    }
}
