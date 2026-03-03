package com.orion.mdd.controller;

import com.orion.mdd.dto.request.CreatePostRequest;
import com.orion.mdd.dto.response.PostListResponse;
import com.orion.mdd.dto.response.PostResponse;
import com.orion.mdd.service.PostService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    public PostController(PostService postService) {
        this.postService = postService;
    }

    @PostMapping("/user/{authorId}")
    public ResponseEntity<PostResponse> createPost(@PathVariable Long authorId, @RequestBody CreatePostRequest request) {
        PostResponse response = postService.createPost(authorId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{postId}")
    public ResponseEntity<PostResponse> getPostById(@PathVariable Long postId) {
        PostResponse response = postService.getPostById(postId);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<PostListResponse>> getAllPosts() {
        List<PostListResponse> responses = postService.getAllPosts();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/subject/{subjectId}")
    public ResponseEntity<List<PostListResponse>> getPostsBySubject(@PathVariable Long subjectId) {
        List<PostListResponse> responses = postService.getPostsBySubject(subjectId);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/user/{authorId}")
    public ResponseEntity<List<PostListResponse>> getPostsByAuthor(@PathVariable Long authorId) {
        List<PostListResponse> responses = postService.getPostsByAuthor(authorId);
        return ResponseEntity.ok(responses);
    }
}
