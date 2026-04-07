package com.orion.mdd.service;

import com.orion.mdd.dto.response.SubjectResponse;
import com.orion.mdd.mapper.SubjectMapper;
import com.orion.mdd.model.Subject;
import com.orion.mdd.model.User;
import com.orion.mdd.repository.SubjectRepository;
import com.orion.mdd.repository.UserRepository;
import com.orion.mdd.service.impl.SubjectServiceImpl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SubjectServiceImplTest {

    @Mock private SubjectRepository subjectRepository;
    @Mock private UserRepository userRepository;
    @Mock private SubjectMapper subjectMapper;

    @InjectMocks
    private SubjectServiceImpl subjectService;

    private User user;
    private Subject subject1;
    private Subject subject2;
    private SubjectResponse subjectResponse1;
    private SubjectResponse subjectResponse2;

    @BeforeEach
    void setUp() {
        subject1 = new Subject();
        subject1.setId(1L);
        subject1.setName("Java");

        subject2 = new Subject();
        subject2.setId(2L);
        subject2.setName("Spring Boot");

        subjectResponse1 = new SubjectResponse(1L, "Java", "Java programming language");
        subjectResponse2 = new SubjectResponse(2L, "Spring Boot", "Spring Boot framework");

        user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        user.setEmail("test@test.com");
        user.setSubscriptions(new HashSet<>());
    }

    // ---------------------------
    // TEST getAllSubjects
    // ---------------------------

    @Test
    void getAllSubjects_ShouldReturnAllSubjects_WithSubscribedFlag() {
        user.getSubscriptions().add(subject1); // subscribed to subject1 only

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(subjectRepository.findAll()).thenReturn(List.of(subject1, subject2));
        when(subjectMapper.toSubjectResponse(subject1)).thenReturn(subjectResponse1);
        when(subjectMapper.toSubjectResponse(subject2)).thenReturn(subjectResponse2);

        List<SubjectResponse> responses = subjectService.getAllSubjects("testuser");

        assertThat(responses).hasSize(2);
        assertThat(responses.get(0).getSubscribed()).isTrue();  // subject1 subscribed
        assertThat(responses.get(1).getSubscribed()).isFalse(); // subject2 not subscribed

        verify(userRepository).findByUsername("testuser");
        verify(subjectRepository).findAll();
    }

    @Test
    void getAllSubjects_ShouldThrow_WhenUserNotFound() {
        when(userRepository.findByUsername("unknown")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> subjectService.getAllSubjects("unknown"))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("User not found");
    }

    // ---------------------------
    // TEST getSubjectById
    // ---------------------------

    @Test
    void getSubjectById_ShouldReturnSubjectResponse_WhenSubjectExists() {
        when(subjectRepository.findById(1L)).thenReturn(Optional.of(subject1));
        when(subjectMapper.toSubjectResponse(subject1)).thenReturn(subjectResponse1);

        SubjectResponse response = subjectService.getSubjectById(1L);

        assertThat(response).isNotNull();
        assertThat(response.getName()).isEqualTo("Java");

        verify(subjectRepository).findById(1L);
    }

    @Test
    void getSubjectById_ShouldThrow_WhenSubjectNotFound() {
        when(subjectRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> subjectService.getSubjectById(99L))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Subject not found");
    }

    // ---------------------------
    // TEST subscribeMe
    // ---------------------------

    @Test
    void subscribeMe_ShouldAddSubscription_WhenNotAlreadySubscribed() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(subjectRepository.findById(1L)).thenReturn(Optional.of(subject1));
        when(userRepository.save(user)).thenReturn(user);
        when(subjectMapper.toSubjectResponse(subject1)).thenReturn(subjectResponse1);

        SubjectResponse response = subjectService.subscribeMe("testuser", 1L);

        assertThat(response).isNotNull();
        assertThat(response.getName()).isEqualTo("Java");
        assertThat(user.getSubscriptions()).contains(subject1);

        verify(userRepository).save(user);
    }

    @Test
    void subscribeMe_ShouldThrow_WhenUserNotFound() {
        when(userRepository.findByUsername("unknown")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> subjectService.subscribeMe("unknown", 1L))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("User not found");
    }

    @Test
    void subscribeMe_ShouldThrow_WhenSubjectNotFound() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(subjectRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> subjectService.subscribeMe("testuser", 99L))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Subject not found");
    }

    // ---------------------------
    // TEST unsubscribeMe
    // ---------------------------

    @Test
    void unsubscribeMe_ShouldRemoveSubscription_WhenSubscribed() {
        user.getSubscriptions().add(subject1);

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(subjectRepository.findById(1L)).thenReturn(Optional.of(subject1));
        when(userRepository.save(user)).thenReturn(user);
        when(subjectMapper.toSubjectResponse(subject1)).thenReturn(subjectResponse1);

        SubjectResponse response = subjectService.unsubscribeMe("testuser", 1L);

        assertThat(response).isNotNull();
        assertThat(user.getSubscriptions()).doesNotContain(subject1);

        verify(userRepository).save(user);
    }

    @Test
    void unsubscribeMe_ShouldThrow_WhenUserNotFound() {
        when(userRepository.findByUsername("unknown")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> subjectService.unsubscribeMe("unknown", 1L))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("User not found");
    }

    @Test
    void unsubscribeMe_ShouldThrow_WhenSubjectNotFound() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(subjectRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> subjectService.unsubscribeMe("testuser", 99L))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Subject not found");
    }

    // ---------------------------
    // TEST getMySubscriptions
    // ---------------------------

    @Test
    void getMySubscriptions_ShouldReturnSubscribedSubjects_WhenUserHasSubscriptions() {
        user.getSubscriptions().add(subject1);
        user.getSubscriptions().add(subject2);

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(subjectMapper.toSubjectResponse(subject1)).thenReturn(subjectResponse1);
        when(subjectMapper.toSubjectResponse(subject2)).thenReturn(subjectResponse2);

        List<SubjectResponse> responses = subjectService.getMySubscriptions("testuser");

        assertThat(responses).hasSize(2);
        assertThat(responses)
                .extracting(SubjectResponse::getName)
                .containsExactlyInAnyOrder("Java", "Spring Boot");

        verify(userRepository).findByUsername("testuser");
    }

    @Test
    void getMySubscriptions_ShouldReturnEmptyList_WhenUserHasNoSubscriptions() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));

        List<SubjectResponse> responses = subjectService.getMySubscriptions("testuser");

        assertThat(responses).isEmpty();
        verify(userRepository).findByUsername("testuser");
    }

    @Test
    void getMySubscriptions_ShouldThrow_WhenUserNotFound() {
        when(userRepository.findByUsername("unknown")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> subjectService.getMySubscriptions("unknown"))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("User not found");
    }
}