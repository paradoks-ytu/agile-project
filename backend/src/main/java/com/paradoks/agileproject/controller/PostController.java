package com.paradoks.agileproject.controller;

import com.paradoks.agileproject.dto.mapper.PostMapper;
import com.paradoks.agileproject.dto.request.CreatePostRequest;
import com.paradoks.agileproject.dto.response.PostResponse;
import com.paradoks.agileproject.exception.UnauthorizedException;
import com.paradoks.agileproject.model.Post;
import com.paradoks.agileproject.model.ClubSession;
import com.paradoks.agileproject.service.PostService;
import com.paradoks.agileproject.service.ClubSessionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "Posts", description = "Post işlemleri")
@RestController
@RequestMapping("/api/v1/posts")
public class PostController {

    private final PostService postService;
    private final ClubSessionService clubSessionService;
    private final PostMapper postMapper;

    public PostController(PostService postService, ClubSessionService clubSessionService, PostMapper postMapper) {
        this.postService = postService;
        this.clubSessionService = clubSessionService;
        this.postMapper = postMapper;
    }

    @Operation(summary = "Yeni bir post oluşturur")
    @PostMapping
    public ResponseEntity<PostResponse> createPost(@Valid @RequestBody CreatePostRequest createPostRequest) {
        ClubSession currentSession = clubSessionService.getCurrentSession()
                .orElseThrow(() -> new UnauthorizedException("Not Authenticated"));

        Long clubId = currentSession.getClub().getId();
        Post createdPost = postService.createPost(createPostRequest, clubId);

        return new ResponseEntity<>(postMapper.postToPostResponse(createdPost), HttpStatus.CREATED);
    }

    @Operation(summary = "ID'ye göre post getirir")
    @GetMapping("/{id}")
    public ResponseEntity<PostResponse> getPostById(@PathVariable Long id) {
        Post post = postService.getPostById(id);
        return ResponseEntity.ok(postMapper.postToPostResponse(post));
    }

    @Operation(summary = "Postu siler")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id) {
        ClubSession currentSession = clubSessionService.getCurrentSession()
                .orElseThrow(() -> new UnauthorizedException("Not Authenticated"));
        Long clubId = currentSession.getClub().getId();
        postService.deletePost(id, clubId);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Postu günceller")
    @PutMapping("/{id}")
    public ResponseEntity<PostResponse> updatePost(@PathVariable Long id, @Valid @RequestBody CreatePostRequest createPostRequest) {
        ClubSession currentSession = clubSessionService.getCurrentSession()
                .orElseThrow(() -> new UnauthorizedException("Not Authenticated"));
        Long clubId = currentSession.getClub().getId();

        Post post = postService.getPostById(id);
        if (!post.getClub().getId().equals(clubId)) {
            throw new UnauthorizedException("You are not authorized to update this post");
        }

        Post updatedPost = postService.updatePost(id, createPostRequest);
        return ResponseEntity.ok(postMapper.postToPostResponse(updatedPost));
    }
}
