package com.paradoks.agileproject.service;

import com.paradoks.agileproject.dto.request.CreatePostRequest;
import com.paradoks.agileproject.model.ClubModel;
import com.paradoks.agileproject.model.Post;
import com.paradoks.agileproject.repository.ClubRepository;
import com.paradoks.agileproject.repository.PostRepository;
import com.paradoks.agileproject.exception.NotFoundException;
import org.springframework.stereotype.Service;

@Service
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final ClubRepository clubRepository;

    public PostServiceImpl(PostRepository postRepository, ClubRepository clubRepository) {
        this.postRepository = postRepository;
        this.clubRepository = clubRepository;
    }

    @Override
    public Post createPost(CreatePostRequest createPostRequest, Long clubId) {
        ClubModel club = clubRepository.findById(clubId)
                .orElseThrow(() -> new NotFoundException("Club not found"));

        Post post = new Post();
        post.setTitle(createPostRequest.getTitle());
        post.setContent(createPostRequest.getContent());
        post.setClub(club);

        return postRepository.save(post);
    }    @Override
    public Post getPostById(Long postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new NotFoundException("Post not found"));
    }

    @Override
    public void deletePost(Long postId, Long clubId) {
        Post post = getPostById(postId);
        if (!post.getClub().getId().equals(clubId)) {
            throw new com.paradoks.agileproject.exception.UnauthorizedException("You are not authorized to delete this post");
        }
        postRepository.delete(post);
    }

    @Override
    public Post updatePost(Long postId, CreatePostRequest updatePostRequest) {
        Post post = getPostById(postId);
        post.setTitle(updatePostRequest.getTitle());
        post.setContent(updatePostRequest.getContent());
        return postRepository.save(post);
    }
}
