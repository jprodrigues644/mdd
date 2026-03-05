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
            public CommentResponse createComment(Long postId, CreateCommentRequest request) {

                String username = ((UserDetails) SecurityContextHolder
                        .getContext()
                        .getAuthentication()
                        .getPrincipal())
                        .getUsername();

                User author = userRepository.findByUsername(username)
                        .orElseThrow(() -> new RuntimeException("User not found"));

                Post post = postRepository.findById(postId)
                        .orElseThrow(() -> new RuntimeException("Post not found"));

                Comment comment = commentMapper.toComment(request);
                comment.setAuthor(author);
                comment.setPost(post);
                comment.setCreationDate(LocalDateTime.now());

                Comment savedComment = commentRepository.save(comment);

                return commentMapper.toCommentResponse(savedComment);
            }

    @Override
    public List<CommentResponse> getCommentsByPost(Long postId) {
        List<Comment> comments = commentRepository.findByPostId(postId);
        return comments.stream()
                .map(commentMapper::toCommentResponse)
                .collect(Collectors.toList());
    }
}
