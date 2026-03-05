package com.orion.mdd.service.impl;

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
import com.orion.mdd.service.PostService;



import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final SubjectRepository subjectRepository;
    private final PostMapper postMapper;

    public PostServiceImpl(PostRepository postRepository, UserRepository userRepository,
                SubjectRepository subjectRepository, PostMapper postMapper) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.subjectRepository = subjectRepository;
        this.postMapper = postMapper;
    }

   @Override
public PostResponse createPost(String username, CreatePostRequest request) {

    User author = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

    Subject subject = subjectRepository.findById(request.getSubjectId())
            .orElseThrow(() -> new RuntimeException("Subject not found"));

    Post post = postMapper.toPost(request);

    post.setAuthor(author);
    post.setSubject(subject);
    post.setCreationDate(LocalDateTime.now());

    Post savedPost = postRepository.save(post);

    return postMapper.toPostResponse(savedPost);
}

    @Override
    public PostResponse getPostById(Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));
        return postMapper.toPostResponse(post);
    }

    @Override
    public List<PostListResponse> getAllPosts() {
        List<Post> posts = postRepository.findByOrderByCreationDateDesc();
        return posts.stream()
                .map(postMapper::toPostListResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<PostListResponse> getPostsBySubject(Long subjectId) {
        List<Post> posts = postRepository.findBySubjectIdOrderByCreationDateDesc(subjectId);
        return posts.stream()
                .map(postMapper::toPostListResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<PostListResponse> getPostsByAuthor(Long authorId) {
        List<Post> posts = postRepository.findByAuthorIdOrderByCreationDateDesc(authorId);
        return posts.stream()
                .map(postMapper::toPostListResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<PostListResponse> getFeed(String username) {
        List<Post> posts = postRepository.findFeedByUsername(username);
        return posts.stream()
                .map(postMapper::toPostListResponse)
                .collect(Collectors.toList());
    }
}
