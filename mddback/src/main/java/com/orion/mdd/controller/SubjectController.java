package com.orion.mdd.controller;

import com.orion.mdd.dto.response.SubjectResponse;
import com.orion.mdd.service.SubjectService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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
        return ResponseEntity.ok(subjectService.getAllSubjects());
    }

    @GetMapping("/{subjectId}")
    public ResponseEntity<SubjectResponse> getSubjectById(@PathVariable Long subjectId) {
        return ResponseEntity.ok(subjectService.getSubjectById(subjectId));
    }

    // ✅ Subscribe current user
    @PostMapping("/{subjectId}/subscribe")
    public ResponseEntity<SubjectResponse> subscribe(@PathVariable Long subjectId) {
        String username = getAuthenticatedUsername();
        return ResponseEntity.ok(subjectService.subscribeMe(username, subjectId));
    }

    // ✅ Unsubscribe current user
    @PostMapping("/{subjectId}/unsubscribe")
    public ResponseEntity<SubjectResponse> unsubscribe(@PathVariable Long subjectId) {
        String username = getAuthenticatedUsername();
        return ResponseEntity.ok(subjectService.unsubscribeMe(username, subjectId));
    }

    // ✅ Get my subscriptions
    @GetMapping("/me")
    public ResponseEntity<List<SubjectResponse>> mySubscriptions() {
        String username = getAuthenticatedUsername();
        return ResponseEntity.ok(subjectService.getMySubscriptions(username));
    }

    private String getAuthenticatedUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getName() == null) {
            throw new RuntimeException("Unauthorized");
        }
        return auth.getName();
    }
}