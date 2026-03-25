package com.orion.mdd.controller;

import com.orion.mdd.dto.request.CreateCommentRequest;
import com.orion.mdd.dto.request.CreatePostRequest;
import com.orion.mdd.dto.response.CommentResponse;
import com.orion.mdd.dto.response.PostListResponse;
import com.orion.mdd.dto.response.PostResponse;
import com.orion.mdd.service.CommentService;
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
    private final CommentService commentService;

    public PostController(PostService postService, CommentService commentService) {
        this.postService = postService;
        this.commentService = commentService;
    }

    @PostMapping
    public ResponseEntity<PostResponse> createPost(@Valid @RequestBody CreatePostRequest request) {
        String username = getAuthenticatedUsername();
        return ResponseEntity.ok(postService.createPost(username, request));
    }

    @GetMapping("/{postId}")
    public ResponseEntity<PostResponse> getPostById(@PathVariable Long postId) {
        return ResponseEntity.ok(postService.getPostById(postId));
    }

    @GetMapping
    public ResponseEntity<List<PostListResponse>> getAllPosts() {
        return ResponseEntity.ok(postService.getAllPosts());
    }

    @GetMapping("/feed")
    public ResponseEntity<List<PostListResponse>> getFeed() {
        String username = getAuthenticatedUsername();
        return ResponseEntity.ok(postService.getFeed(username));
    }

    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<List<PostListResponse>> getPostsBySubject(@PathVariable Long subjectId) {
        return ResponseEntity.ok(postService.getPostsBySubject(subjectId));
    }

    @GetMapping("/user/{authorId}")
    public ResponseEntity<List<PostListResponse>> getPostsByAuthor(@PathVariable Long authorId) {
        return ResponseEntity.ok(postService.getPostsByAuthor(authorId));
    }

    // Comment endpoints for a post
    @PostMapping("/{postId}/comments")
public ResponseEntity<CommentResponse> createComment(
        @PathVariable Long postId,
        @RequestBody CreateCommentRequest request) {
    String username = getAuthenticatedUsername(); // ← ajout
    return ResponseEntity.ok(commentService.createComment(postId, username, request));
}

    @GetMapping("/{postId}/comments")
    public ResponseEntity<List<CommentResponse>> getCommentsByPost(@PathVariable Long postId) {
        return ResponseEntity.ok(commentService.getCommentsByPost(postId));
    }

    private String getAuthenticatedUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getName() == null) {
            throw new RuntimeException("Unauthorized");
        }
        return auth.getName();
    }
}