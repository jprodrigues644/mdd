package com.orion.mdd.controller;

import com.orion.mdd.dto.request.UpdateUserRequest;
import com.orion.mdd.dto.response.SubjectResponse;
import com.orion.mdd.dto.response.UserResponse;
import com.orion.mdd.service.SubjectService;
import com.orion.mdd.service.UserService;
import jakarta.validation.Valid;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final SubjectService subjectService;

    public UserController(UserService userService , SubjectService subjectService) {
        this.userService = userService;
        this.subjectService = subjectService;
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me() {
        String username = getAuthenticatedUsername();
        return ResponseEntity.ok(userService.getMe(username));
    }

    @PutMapping("/me")
    public ResponseEntity<UserResponse> updateMe(@Valid @RequestBody UpdateUserRequest request) {
        String username = getAuthenticatedUsername();
        return ResponseEntity.ok(userService.updateMe(username, request));
    }

    private String getAuthenticatedUsername() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getName() == null) {
            throw new RuntimeException("Unauthorized");
        }
        return auth.getName();
    }

     @GetMapping("/me/subscriptions")
    public ResponseEntity<List<SubjectResponse>> getMySubscriptions() {
        String username = getAuthenticatedUsername();
        return ResponseEntity.ok(subjectService.getMySubscriptions(username));
    }

    @PostMapping("/me/subscriptions/{subjectId}/unsubscribe")
    public ResponseEntity<SubjectResponse> unsubscribeMe(@PathVariable Long subjectId) {
        String username = getAuthenticatedUsername();
        return ResponseEntity.ok(subjectService.unsubscribeMe(username, subjectId));
    }
}