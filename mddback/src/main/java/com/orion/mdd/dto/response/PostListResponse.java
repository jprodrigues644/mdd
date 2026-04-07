package com.orion.mdd.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
    @AllArgsConstructor
    @NoArgsConstructor
public class PostListResponse {
    private Long id;
    private String title;
    private String content;
    private Long authorId;
    private String authorUsername;
    private Long subjectId;
    private String subjectName;
    private LocalDateTime creationDate;

}