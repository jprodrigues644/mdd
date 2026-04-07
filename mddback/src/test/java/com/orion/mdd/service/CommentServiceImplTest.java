package com.orion.mdd.service;

import com.orion.mdd.dto.request.CreateCommentRequest;
import com.orion.mdd.dto.response.CommentResponse;
import com.orion.mdd.mapper.CommentMapper;
import com.orion.mdd.model.Comment;
import com.orion.mdd.model.Post;
import com.orion.mdd.model.User;
import com.orion.mdd.repository.CommentRepository;
import com.orion.mdd.repository.PostRepository;
import com.orion.mdd.repository.UserRepository;
import com.orion.mdd.service.impl.CommentServiceImpl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.any;

@ExtendWith(MockitoExtension.class)
class CommentServiceImplTest {

    @Mock private CommentRepository commentRepository;
    @Mock private PostRepository postRepository;
    @Mock private UserRepository userRepository;
    @Mock private CommentMapper commentMapper;

    @InjectMocks
    private CommentServiceImpl commentService;

    private User user;
    private Post post;
    private Comment comment;
    private CommentResponse commentResponse;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        user.setEmail("test@test.com");

        post = new Post();
        post.setId(1L);
        post.setTitle("My first post");

        comment = new Comment();
        comment.setId(1L);
        comment.setContent("Great post!");
        comment.setPost(post);
        comment.setAuthor(user);
        comment.setCreationDate(LocalDateTime.now());

        commentResponse = new CommentResponse();
        commentResponse.setId(1L);
        commentResponse.setContent("Great post!");
        commentResponse.setAuthorId(1L);
        commentResponse.setAuthor("testuser");
    }

    // ---------------------------
    // TEST createComment
    // ---------------------------

    @Test
    void createComment_ShouldReturnCommentResponse_WhenValidRequest() {
        CreateCommentRequest request = new CreateCommentRequest();
        request.setContent("Great post!");

        when(postRepository.findById(1L)).thenReturn(Optional.of(post));
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(commentRepository.save(any(Comment.class))).thenReturn(comment);
        when(commentMapper.toCommentResponse(comment)).thenReturn(commentResponse);

        CommentResponse response = commentService.createComment(1L, "testuser", request);

        assertThat(response).isNotNull();
        assertThat(response.getContent()).isEqualTo("Great post!");
        assertThat(response.getAuthor()).isEqualTo("testuser");

        verify(commentRepository).save(any(Comment.class));
    }

    @Test
    void createComment_ShouldThrow_WhenPostNotFound() {
        CreateCommentRequest request = new CreateCommentRequest();
        request.setContent("Great post!");

        when(postRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> commentService.createComment(99L, "testuser", request))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Post not found");
    }

    @Test
    void createComment_ShouldThrow_WhenUserNotFound() {
        CreateCommentRequest request = new CreateCommentRequest();
        request.setContent("Great post!");

        when(postRepository.findById(1L)).thenReturn(Optional.of(post));
        when(userRepository.findByUsername("unknown")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> commentService.createComment(1L, "unknown", request))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("User not found");
    }

    // ---------------------------
    // TEST getCommentsByPost
    // ---------------------------

    @Test
    void getCommentsByPost_ShouldReturnComments_WhenPostHasComments() {
        Comment comment2 = new Comment();
        comment2.setId(2L);
        comment2.setContent("Me too!");

        CommentResponse commentResponse2 = new CommentResponse();
        commentResponse2.setId(2L);
        commentResponse2.setContent("Me too!");

        when(commentRepository.findByPostId(1L)).thenReturn(List.of(comment, comment2));
        when(commentMapper.toCommentResponse(comment)).thenReturn(commentResponse);
        when(commentMapper.toCommentResponse(comment2)).thenReturn(commentResponse2);

        List<CommentResponse> responses = commentService.getCommentsByPost(1L);

        assertThat(responses).hasSize(2);
        assertThat(responses)
                .extracting(CommentResponse::getContent)
                .containsExactly("Great post!", "Me too!");

        verify(commentRepository).findByPostId(1L);
    }

    @Test
    void getCommentsByPost_ShouldReturnEmptyList_WhenPostHasNoComments() {
        when(commentRepository.findByPostId(1L)).thenReturn(List.of());

        List<CommentResponse> responses = commentService.getCommentsByPost(1L);

        assertThat(responses).isEmpty();
        verify(commentRepository).findByPostId(1L);
    }
}