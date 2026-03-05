package com.orion.mdd.controller;

import com.orion.mdd.dto.request.CreatePostRequest;
import com.orion.mdd.dto.response.PostListResponse;
import com.orion.mdd.dto.response.PostResponse;
import com.orion.mdd.service.PostService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    /**
     * Create a post
     * L'auteur est récupéré depuis le token JWT
     */
    @PostMapping
    public ResponseEntity<PostResponse> createPost(@Valid @RequestBody CreatePostRequest request) {

        String username = getAuthenticatedUsername();

        PostResponse response = postService.createPost(username, request);

        return ResponseEntity.ok(response);
    }

    /**
     * Get post by id
     */
    @GetMapping("/{postId}")
    public ResponseEntity<PostResponse> getPostById(@PathVariable Long postId) {

        PostResponse response = postService.getPostById(postId);

        return ResponseEntity.ok(response);
    }

    /**
     * Get all posts 
     */
    @GetMapping
    public ResponseEntity<List<PostListResponse>> getAllPosts() {

        List<PostListResponse> responses = postService.getAllPosts();

        return ResponseEntity.ok(responses);
    }

    //Get Post By Subscriptions
    
     @GetMapping("/feed")
    public ResponseEntity<List<PostListResponse>> getFeed() {
        String username = getAuthenticatedUsername();
        List<PostListResponse> responses = postService.getFeed(username);
        return ResponseEntity.ok(responses);
    }

    /**
     * Get posts by subject
     */
    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<List<PostListResponse>> getPostsBySubject(@PathVariable Long subjectId) {

        List<PostListResponse> responses = postService.getPostsBySubject(subjectId);

        return ResponseEntity.ok(responses);
    }

    /**
     * Get posts by author
     */
    @GetMapping("/user/{authorId}")
    public ResponseEntity<List<PostListResponse>> getPostsByAuthor(@PathVariable Long authorId) {

        List<PostListResponse> responses = postService.getPostsByAuthor(authorId);

        return ResponseEntity.ok(responses);
    }

    /**
     * Extract username from JWT authentication
     */
    private String getAuthenticatedUsername() {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated() || auth.getName() == null) {
            throw new RuntimeException("Unauthorized");
        }

        return auth.getName();
    }

    // ADD COMMENT rOUTES
}