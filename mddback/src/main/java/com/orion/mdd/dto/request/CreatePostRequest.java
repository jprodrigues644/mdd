package com.orion.mdd.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreatePostRequest {

    @NotNull
    private Long subjectId;

    @NotBlank @Size(max = 255)
    private String title;

    @NotBlank
    private String content;

}