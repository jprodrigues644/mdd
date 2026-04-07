package com.orion.mdd.service;

import com.orion.mdd.dto.request.CreatePostRequest;
import com.orion.mdd.dto.response.PostListResponse;
import com.orion.mdd.dto.response.PostResponse;
import com.orion.mdd.mapper.PostMapper;
import com.orion.mdd.model.Post;
import com.orion.mdd.model.Subject;
import com.orion.mdd.model.User;
import com.orion.mdd.repository.PostRepository;
import com.orion.mdd.repository.SubjectRepository;
import com.orion.mdd.repository.UserRepository;
import com.orion.mdd.service.impl.PostServiceImpl;

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
class PostServiceImplTest {

    @Mock private PostRepository postRepository;
    @Mock private UserRepository userRepository;
    @Mock private SubjectRepository subjectRepository;
    @Mock private PostMapper postMapper;

    @InjectMocks
    private PostServiceImpl postService;

    private User user;
    private Subject subject;
    private Post post;
    private PostResponse postResponse;
    private PostListResponse postListResponse;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        user.setEmail("test@test.com");

        subject = new Subject();
        subject.setId(1L);
        subject.setName("Java");

        post = new Post();
        post.setId(1L);
        post.setTitle("My first post");
        post.setContent("Some content");
        post.setAuthor(user);
        post.setSubject(subject);
        post.setCreationDate(LocalDateTime.now());

        postResponse = new PostResponse();
        postResponse.setId(1L);
        postResponse.setTitle("My first post");
        postResponse.setContent("Some content");
        postResponse.setAuthorId(1L);
        postResponse.setAuthorUsername("testuser");
        postResponse.setSubjectId(1L);
        postResponse.setSubjectName("Java");

        postListResponse = new PostListResponse();
        postListResponse.setId(1L);
        postListResponse.setTitle("My first post");
        postListResponse.setAuthorUsername("testuser");
        postListResponse.setSubjectName("Java");
    }

    // ---------------------------
    // TEST createPost
    // ---------------------------

    @Test
    void createPost_ShouldReturnPostResponse_WhenValidRequest() {
        CreatePostRequest request = new CreatePostRequest();
        request.setSubjectId(1L);
        request.setTitle("My first post");
        request.setContent("Some content");

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(subjectRepository.findById(1L)).thenReturn(Optional.of(subject));
        when(postMapper.toPost(request)).thenReturn(post);
        when(postRepository.save(any(Post.class))).thenReturn(post);
        when(postMapper.toPostResponse(post)).thenReturn(postResponse);

        PostResponse response = postService.createPost("testuser", request);

        assertThat(response).isNotNull();
        assertThat(response.getTitle()).isEqualTo("My first post");
        assertThat(response.getAuthorUsername()).isEqualTo("testuser");
        assertThat(response.getSubjectName()).isEqualTo("Java");

        verify(postRepository).save(any(Post.class));
    }

    @Test
    void createPost_ShouldThrow_WhenUserNotFound() {
        CreatePostRequest request = new CreatePostRequest();
        request.setSubjectId(1L);

        when(userRepository.findByUsername("unknown")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> postService.createPost("unknown", request))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("User not found");
    }

    @Test
    void createPost_ShouldThrow_WhenSubjectNotFound() {
        CreatePostRequest request = new CreatePostRequest();
        request.setSubjectId(99L);

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(subjectRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> postService.createPost("testuser", request))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Subject not found");
    }

    // ---------------------------
    // TEST getPostById
    // ---------------------------

    @Test
    void getPostById_ShouldReturnPostResponse_WhenPostExists() {
        when(postRepository.findById(1L)).thenReturn(Optional.of(post));
        when(postMapper.toPostResponse(post)).thenReturn(postResponse);

        PostResponse response = postService.getPostById(1L);

        assertThat(response).isNotNull();
        assertThat(response.getTitle()).isEqualTo("My first post");

        verify(postRepository).findById(1L);
    }

    @Test
    void getPostById_ShouldThrow_WhenPostNotFound() {
        when(postRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> postService.getPostById(99L))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Post not found");
    }

    // ---------------------------
    // TEST getAllPosts
    // ---------------------------

    @Test
    void getAllPosts_ShouldReturnListOfPosts() {
        Post post2 = new Post();
        post2.setId(2L);
        post2.setTitle("Second post");

        PostListResponse postListResponse2 = new PostListResponse();
        postListResponse2.setId(2L);
        postListResponse2.setTitle("Second post");

        when(postRepository.findByOrderByCreationDateDesc()).thenReturn(List.of(post, post2));
        when(postMapper.toPostListResponse(post)).thenReturn(postListResponse);
        when(postMapper.toPostListResponse(post2)).thenReturn(postListResponse2);

        List<PostListResponse> responses = postService.getAllPosts();

        assertThat(responses).hasSize(2);
        assertThat(responses.get(0).getTitle()).isEqualTo("My first post");
        assertThat(responses.get(1).getTitle()).isEqualTo("Second post");

        verify(postRepository).findByOrderByCreationDateDesc();
    }

    @Test
    void getAllPosts_ShouldReturnEmptyList_WhenNoPosts() {
        when(postRepository.findByOrderByCreationDateDesc()).thenReturn(List.of());

        List<PostListResponse> responses = postService.getAllPosts();

        assertThat(responses).isEmpty();
        verify(postRepository).findByOrderByCreationDateDesc();
    }

    // ---------------------------
    // TEST getPostsBySubject
    // ---------------------------

    @Test
    void getPostsBySubject_ShouldReturnPosts_WhenSubjectHasPosts() {
        when(postRepository.findBySubjectIdOrderByCreationDateDesc(1L)).thenReturn(List.of(post));
        when(postMapper.toPostListResponse(post)).thenReturn(postListResponse);

        List<PostListResponse> responses = postService.getPostsBySubject(1L);

        assertThat(responses).hasSize(1);
        assertThat(responses.get(0).getSubjectName()).isEqualTo("Java");

        verify(postRepository).findBySubjectIdOrderByCreationDateDesc(1L);
    }

    @Test
    void getPostsBySubject_ShouldReturnEmptyList_WhenNoPostsForSubject() {
        when(postRepository.findBySubjectIdOrderByCreationDateDesc(99L)).thenReturn(List.of());

        List<PostListResponse> responses = postService.getPostsBySubject(99L);

        assertThat(responses).isEmpty();
        verify(postRepository).findBySubjectIdOrderByCreationDateDesc(99L);
    }

    // ---------------------------
    // TEST getPostsByAuthor
    // ---------------------------

    @Test
    void getPostsByAuthor_ShouldReturnPosts_WhenAuthorHasPosts() {
        when(postRepository.findByAuthorIdOrderByCreationDateDesc(1L)).thenReturn(List.of(post));
        when(postMapper.toPostListResponse(post)).thenReturn(postListResponse);

        List<PostListResponse> responses = postService.getPostsByAuthor(1L);

        assertThat(responses).hasSize(1);
        assertThat(responses.get(0).getAuthorUsername()).isEqualTo("testuser");

        verify(postRepository).findByAuthorIdOrderByCreationDateDesc(1L);
    }

    @Test
    void getPostsByAuthor_ShouldReturnEmptyList_WhenNoPostsForAuthor() {
        when(postRepository.findByAuthorIdOrderByCreationDateDesc(99L)).thenReturn(List.of());

        List<PostListResponse> responses = postService.getPostsByAuthor(99L);

        assertThat(responses).isEmpty();
        verify(postRepository).findByAuthorIdOrderByCreationDateDesc(99L);
    }

    // ---------------------------
    // TEST getFeed
    // ---------------------------

    @Test
    void getFeed_ShouldReturnPosts_WhenUserHasSubscriptions() {
        Post post2 = new Post();
        post2.setId(2L);
        post2.setTitle("Feed post");

        PostListResponse feedResponse = new PostListResponse();
        feedResponse.setId(2L);
        feedResponse.setTitle("Feed post");

        when(postRepository.findFeedByUsername("testuser")).thenReturn(List.of(post, post2));
        when(postMapper.toPostListResponse(post)).thenReturn(postListResponse);
        when(postMapper.toPostListResponse(post2)).thenReturn(feedResponse);

        List<PostListResponse> responses = postService.getFeed("testuser");

        assertThat(responses).hasSize(2);
        assertThat(responses)
                .extracting(PostListResponse::getTitle)
                .containsExactlyInAnyOrder("My first post", "Feed post");

        verify(postRepository).findFeedByUsername("testuser");
    }

    @Test
    void getFeed_ShouldReturnEmptyList_WhenUserHasNoSubscriptions() {
        when(postRepository.findFeedByUsername("testuser")).thenReturn(List.of());

        List<PostListResponse> responses = postService.getFeed("testuser");

        assertThat(responses).isEmpty();
        verify(postRepository).findFeedByUsername("testuser");
    }
}