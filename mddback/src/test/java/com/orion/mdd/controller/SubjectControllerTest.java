package com.orion.mdd.controller;

import com.orion.mdd.dto.response.SubjectResponse;
import com.orion.mdd.service.SubjectService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Arrays;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SubjectControllerTest {

    @Mock
    private SubjectService subjectService;

    @Mock
    private Authentication authentication;

    @Mock
    private SecurityContext securityContext;

    @InjectMocks
    private SubjectController subjectController;

    private SubjectResponse subjectResponse;
    private List<SubjectResponse> subjectListResponse;

    @BeforeEach
    void setUp() {
        subjectResponse = new SubjectResponse(1L, "Math", "Mathematics subject");
        subjectListResponse = Arrays.asList(
            new SubjectResponse(1L, "Math", "Mathematics subject"),
            new SubjectResponse(2L, "Physics", "Physics subject")
        );

        // Mock SecurityContextHolder pour simuler un utilisateur authentifié
        lenient().when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
    }

    // Tests pour getAllSubjects
    @Test
    void getAllSubjects_ShouldReturn200_WithSubjectList_WhenUserIsAuthenticated() {
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn("johnDoe");
        when(subjectService.getAllSubjects(anyString())).thenReturn(subjectListResponse);

        ResponseEntity<List<SubjectResponse>> response = subjectController.getAllSubjects();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody()).hasSize(2);

        verify(subjectService).getAllSubjects("johnDoe");
    }

    @Test
    void getAllSubjects_ShouldThrow_WhenUserIsNotAuthenticated() {
        when(authentication.isAuthenticated()).thenReturn(false);

        assertThatThrownBy(() -> subjectController.getAllSubjects())
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Unauthorized");
    }

    // Tests pour getSubjectById
    @Test
    void getSubjectById_ShouldReturn200_WithSubjectResponse() {
        when(subjectService.getSubjectById(anyLong())).thenReturn(subjectResponse);

        ResponseEntity<SubjectResponse> response = subjectController.getSubjectById(1L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getId()).isEqualTo(1L);
        assertThat(response.getBody().getName()).isEqualTo("Math");

        verify(subjectService).getSubjectById(1L);
    }

    // Tests pour subscribe
    @Test
    void subscribe_ShouldReturn200_WithSubjectResponse_WhenUserIsAuthenticated() {
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn("johnDoe");
        when(subjectService.subscribeMe(anyString(), anyLong())).thenReturn(subjectResponse);

        ResponseEntity<SubjectResponse> response = subjectController.subscribe(1L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getId()).isEqualTo(1L);

        verify(subjectService).subscribeMe("johnDoe", 1L);
    }

    @Test
    void subscribe_ShouldThrow_WhenUserIsNotAuthenticated() {
        when(authentication.isAuthenticated()).thenReturn(false);

        assertThatThrownBy(() -> subjectController.subscribe(1L))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Unauthorized");
    }

    // Tests pour unsubscribe
    @Test
    void unsubscribe_ShouldReturn200_WithSubjectResponse_WhenUserIsAuthenticated() {
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn("johnDoe");
        when(subjectService.unsubscribeMe(anyString(), anyLong())).thenReturn(subjectResponse);

        ResponseEntity<SubjectResponse> response = subjectController.unsubscribe(1L);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getId()).isEqualTo(1L);

        verify(subjectService).unsubscribeMe("johnDoe", 1L);
    }

    @Test
    void unsubscribe_ShouldThrow_WhenUserIsNotAuthenticated() {
        when(authentication.isAuthenticated()).thenReturn(false);

        assertThatThrownBy(() -> subjectController.unsubscribe(1L))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Unauthorized");
    }

    // Tests pour mySubscriptions
    @Test
    void mySubscriptions_ShouldReturn200_WithSubjectList_WhenUserIsAuthenticated() {
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn("johnDoe");
        when(subjectService.getMySubscriptions(anyString())).thenReturn(subjectListResponse);

        ResponseEntity<List<SubjectResponse>> response = subjectController.mySubscriptions();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody()).hasSize(2);

        verify(subjectService).getMySubscriptions("johnDoe");
    }

    @Test
    void mySubscriptions_ShouldThrow_WhenUserIsNotAuthenticated() {
        when(authentication.isAuthenticated()).thenReturn(false);

        assertThatThrownBy(() -> subjectController.mySubscriptions())
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Unauthorized");
    }
}