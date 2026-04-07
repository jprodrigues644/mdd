package com.orion.mdd.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public class CommentResponse {
        private Long id;
        private String content;
        private Long authorId;
        private String author;
        private LocalDateTime creationDate;
    }

