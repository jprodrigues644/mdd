package com.orion.mdd.service;

import com.orion.mdd.dto.request.CreateCommentRequest;
import com.orion.mdd.dto.response.CommentResponse;

import java.util.List;

public interface CommentService {
    CommentResponse createComment(Long postId, CreateCommentRequest request);
    List<CommentResponse> getCommentsByPost(Long postId);
}