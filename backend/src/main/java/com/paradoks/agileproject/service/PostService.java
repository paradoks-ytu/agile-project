package com.paradoks.agileproject.service;

import com.paradoks.agileproject.dto.request.CreatePostRequest;
import com.paradoks.agileproject.model.Post;
import org.springframework.stereotype.Service;

@Service
public interface PostService {
    Post createPost(CreatePostRequest createPostRequest, Long clubId);
    Post getPostById(Long postId);
    void deletePost(Long postId, Long clubId);
    Post updatePost(Long postId, CreatePostRequest updatePostRequest);
}
