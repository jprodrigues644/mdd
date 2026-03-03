package com.orion.mdd.dto.response;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class PostResponse {
    private Long id;
    private String title;
    private String content;
    private Long authorId;
    private String authorUsername;
    private Long subjectId;
    private String subjectName;
    private LocalDateTime creationDate;
    private List<CommentResponse> comments;  // Liste complète
}