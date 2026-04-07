package com.orion.mdd.controller;

import com.orion.mdd.dto.request.CreateCommentRequest;
import com.orion.mdd.dto.request.CreatePostRequest;
import com.orion.mdd.dto.response.CommentResponse;
import com.orion.mdd.dto.response.PostListResponse;
import com.orion.mdd.dto.response.PostResponse;
import com.orion.mdd.service.CommentService;
import com.orion.mdd.service.PostService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PostControllerTest {

    @Mock
    private PostService postService;

    @Mock
    private CommentService commentService;

    @Mock
    private Authentication authentication;

    @Mock
    private SecurityContext securityContext;

    @InjectMocks
    private PostController postController;

    private PostResponse postResponse;
    private PostListResponse postListResponse;
    private CommentResponse commentResponse;
    private CreatePostRequest createPostRequest;
    private CreateCommentRequest createCommentRequest;

    @BeforeEach
    void setUp() {
        postResponse = new PostResponse();
        postResponse.setId(1L);
        postResponse.setTitle("Test Post");
        postResponse.setContent("Test Content");

        postListResponse = new PostListResponse();
        postListResponse.setId(1L);
        postListResponse.setTitle("Test Post List");

        commentResponse = new CommentResponse();
        commentResponse.setId(1L);
        commentResponse.setContent("Test Comment");

        createPostRequest = new CreatePostRequest();
        createPostRequest.setTitle("Test Post");
        createPostRequest.setContent("Test Content");
        createPostRequest.setSubjectId(1L);

        createCommentRequest = new CreateCommentRequest();
        createCommentRequest.setContent("Test Comment");

        // Mock SecurityContextHolder pour simuler un utilisateur authentifié
        lenient().when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
    }

    // Tests pour createPost
    @Test
    void createPost_ShouldReturn200_WithPostResponse_WhenUserIsAuthenticated() {
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn("johnDoe");
        when(postService.createPost(anyString(), any(CreatePostRequest.class))).thenReturn(postResponse);

        ResponseEntity<PostResponse> response = postController.createPost(createPostRequest);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getId()).isEqualTo(1L);
        assertThat(response.getBody().getTitle()).isEqualTo("Test Post");

        verify(postService).createPost(eq("johnDoe"), any(CreatePostRequest.class));
    }

    @Test
    void createPost_ShouldThrow_WhenUserIsNotAuthenticated() {
        when(authentication.isAuthenticated()).thenReturn(false);

        assertThatThrownBy(() -> postController.createPost(createPostRequest))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Unauthorized");
    }

    // Tests pour getPostById
    @Test
    void getPostById_ShouldReturn200_WithPostResponse() {
        when(postService.getPostById(anyLong())).thenReturn(postResponse);

        ResponseEntity<PostResponse> response = postController.getPostById(1L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getId()).isEqualTo(1L);

        verify(postService).getPostById(1L);
    }

    // Tests pour getAllPosts
    @Test
    void getAllPosts_ShouldReturn200_WithPostList() {
        List<PostListResponse> posts = Arrays.asList(postListResponse);
        when(postService.getAllPosts()).thenReturn(posts);

        ResponseEntity<List<PostListResponse>> response = postController.getAllPosts();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody()).hasSize(1);

        verify(postService).getAllPosts();
    }

    // Tests pour getFeed
    @Test
    void getFeed_ShouldReturn200_WithPostList_WhenUserIsAuthenticated() {
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn("johnDoe");
        List<PostListResponse> posts = Arrays.asList(postListResponse);
        when(postService.getFeed(anyString())).thenReturn(posts);

        ResponseEntity<List<PostListResponse>> response = postController.getFeed();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody()).hasSize(1);

        verify(postService).getFeed("johnDoe");
    }

    @Test
    void getFeed_ShouldThrow_WhenUserIsNotAuthenticated() {
        when(authentication.isAuthenticated()).thenReturn(false);

        assertThatThrownBy(() -> postController.getFeed())
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Unauthorized");
    }

    // Tests pour getPostsBySubject
    @Test
    void getPostsBySubject_ShouldReturn200_WithPostList() {
        List<PostListResponse> posts = Arrays.asList(postListResponse);
        when(postService.getPostsBySubject(anyLong())).thenReturn(posts);

        ResponseEntity<List<PostListResponse>> response = postController.getPostsBySubject(1L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody()).hasSize(1);

        verify(postService).getPostsBySubject(1L);
    }

    // Tests pour getPostsByAuthor
    @Test
    void getPostsByAuthor_ShouldReturn200_WithPostList() {
        List<PostListResponse> posts = Arrays.asList(postListResponse);
        when(postService.getPostsByAuthor(anyLong())).thenReturn(posts);

        ResponseEntity<List<PostListResponse>> response = postController.getPostsByAuthor(1L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody()).hasSize(1);

        verify(postService).getPostsByAuthor(1L);
    }

    // Tests pour createComment
    @Test
    void createComment_ShouldReturn200_WithCommentResponse_WhenUserIsAuthenticated() {
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn("johnDoe");
        when(commentService.createComment(anyLong(), anyString(), any(CreateCommentRequest.class))).thenReturn(commentResponse);

        ResponseEntity<CommentResponse> response = postController.createComment(1L, createCommentRequest);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getId()).isEqualTo(1L);

        verify(commentService).createComment(eq(1L), eq("johnDoe"), any(CreateCommentRequest.class));
    }

    @Test
    void createComment_ShouldThrow_WhenUserIsNotAuthenticated() {
        when(authentication.isAuthenticated()).thenReturn(false);

        assertThatThrownBy(() -> postController.createComment(1L, createCommentRequest))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Unauthorized");
    }

    // Tests pour getCommentsByPost
    @Test
    void getCommentsByPost_ShouldReturn200_WithCommentList() {
        List<CommentResponse> comments = Arrays.asList(commentResponse);
        when(commentService.getCommentsByPost(anyLong())).thenReturn(comments);

        ResponseEntity<List<CommentResponse>> response = postController.getCommentsByPost(1L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody()).hasSize(1);

        verify(commentService).getCommentsByPost(1L);
    }
}