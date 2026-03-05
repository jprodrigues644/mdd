package com.orion.mdd.controller;

import com.orion.mdd.dto.request.CreateCommentRequest;
import com.orion.mdd.dto.response.CommentResponse;
import com.orion.mdd.service.CommentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

    private final CommentService commentService;

    public CommentController(CommentService commentService) {
        this.commentService = commentService;
    }
// mETTRE DANS  lE pOST coNTROLLER
    @PostMapping("/post/{postId}")
    public ResponseEntity<CommentResponse> createComment(
            @PathVariable Long postId,
            @RequestBody CreateCommentRequest request) {

        CommentResponse response = commentService.createComment(postId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/post/{postId}")
    public ResponseEntity<List<CommentResponse>> getCommentsByPost(@PathVariable Long postId) {

        List<CommentResponse> responses = commentService.getCommentsByPost(postId);

        return ResponseEntity.ok(responses);
    }
}
