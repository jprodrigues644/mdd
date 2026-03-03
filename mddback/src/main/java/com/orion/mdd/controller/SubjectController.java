package com.orion.mdd.controller;

import com.orion.mdd.dto.response.SubjectResponse;
import com.orion.mdd.service.SubjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
public class SubjectController {

    private final SubjectService subjectService;

    public SubjectController(SubjectService subjectService) {
        this.subjectService = subjectService;
    }

    @GetMapping
    public ResponseEntity<List<SubjectResponse>> getAllSubjects() {
        List<SubjectResponse> responses = subjectService.getAllSubjects();
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/{subjectId}")
    public ResponseEntity<SubjectResponse> getSubjectById(@PathVariable Long subjectId) {
        SubjectResponse response = subjectService.getSubjectById(subjectId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{subjectId}/subscribe/{userId}")
    public ResponseEntity<SubjectResponse> subscribeUserToSubject(@PathVariable Long userId, @PathVariable Long subjectId) {
        SubjectResponse response = subjectService.subscribeUserToSubject(userId, subjectId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{subjectId}/unsubscribe/{userId}")
    public ResponseEntity<SubjectResponse> unsubscribeUserFromSubject(@PathVariable Long userId, @PathVariable Long subjectId) {
        SubjectResponse response = subjectService.unsubscribeUserFromSubject(userId, subjectId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SubjectResponse>> getUserSubscriptions(@PathVariable Long userId) {
        List<SubjectResponse> responses = subjectService.getUserSubscriptions(userId);
        return ResponseEntity.ok(responses);
    }
}
