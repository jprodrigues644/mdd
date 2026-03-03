package com.orion.mdd.dto.response;

import lombok.Data;

@Data
public class SubjectResponse {
    private Long id;
    private String name;
    private String description;
    private Boolean subscribed; // à voir si necessaire


    public SubjectResponse(Long id, String name, String description) {
        this.id = id;
        this.name = name;
        this.description = description;
    }
}