package com.orion.mdd.service.impl;

import com.orion.mdd.dto.request.CreateCommentRequest;
import com.orion.mdd.dto.response.CommentResponse;
import com.orion.mdd.mapper.CommentMapper;
import com.orion.mdd.model.Comment;
import com.orion.mdd.model.Post;
import com.orion.mdd.model.User;
import com.orion.mdd.repository.CommentRepository;
import com.orion.mdd.repository.PostRepository;
import com.orion.mdd.repository.UserRepository;
import com.orion.mdd.service.CommentService;

import jakarta.transaction.Transactional;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class CommentServiceImpl implements CommentService {

    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final CommentMapper commentMapper;

    public CommentServiceImpl(CommentRepository commentRepository, PostRepository postRepository, UserRepository userRepository, CommentMapper commentMapper) {
        this.commentRepository = commentRepository;
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        this.commentMapper = commentMapper;
    }

   @Override
@Transactional
public CommentResponse createComment(Long postId, String username, CreateCommentRequest request) {
    Post post = postRepository.findById(postId)
            .orElseThrow(() -> new RuntimeException("Post not found"));

    User author = userRepository.findByUsername(username)
            .orElseThrow(() -> new RuntimeException("User not found"));

    Comment comment = new Comment();
    comment.setContent(request.getContent());
    comment.setPost(post);
    comment.setAuthor(author);
    comment.setCreationDate(LocalDateTime.now());

    Comment saved = commentRepository.save(comment);
    return commentMapper.toCommentResponse(saved);
}

    @Override
    public List<CommentResponse> getCommentsByPost(Long postId) {
        List<Comment> comments = commentRepository.findByPostId(postId);
        return comments.stream()
                .map(commentMapper::toCommentResponse)
                .collect(Collectors.toList());
    }
}
