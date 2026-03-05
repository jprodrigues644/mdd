package com.orion.mdd.service;

import com.orion.mdd.dto.request.CreatePostRequest;
import com.orion.mdd.dto.response.PostListResponse;
import com.orion.mdd.dto.response.PostResponse;

import java.util.List;

public interface PostService {
    PostResponse createPost(String username, CreatePostRequest request);
    PostResponse getPostById(Long postId);
    List<PostListResponse> getAllPosts();
    List<PostListResponse> getPostsBySubject(Long subjectId);
    List<PostListResponse> getPostsByAuthor(Long authorId);
    List<PostListResponse> getFeed(String username);
}