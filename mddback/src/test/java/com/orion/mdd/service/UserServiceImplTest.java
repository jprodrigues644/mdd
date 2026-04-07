package com.orion.mdd.service;

import com.orion.mdd.dto.request.UpdateUserRequest;
import com.orion.mdd.dto.response.UserResponse;
import com.orion.mdd.mapper.UserMapper;
import com.orion.mdd.model.User;
import com.orion.mdd.repository.UserRepository;
import com.orion.mdd.service.impl.UserServiceImpl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.any;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock private UserRepository userRepository;
    @Mock private UserMapper userMapper;
    @Mock private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserServiceImpl userService;

    private User user;
    private UserResponse userResponse;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        user.setEmail("test@test.com");
        user.setPassword("$2a$10$encodedPassword");

        userResponse = new UserResponse();
        userResponse.setUsername("testuser");
        userResponse.setEmail("test@test.com");
    }

    // ---------------------------
    // TEST getUserById
    // ---------------------------

    @Test
    void getUserById_ShouldReturnUserResponse_WhenUserExists() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userMapper.toUserResponse(user)).thenReturn(userResponse);

        UserResponse response = userService.getUserById(1L);

        assertThat(response).isNotNull();
        assertThat(response.getUsername()).isEqualTo("testuser");
        assertThat(response.getEmail()).isEqualTo("test@test.com");

        verify(userRepository).findById(1L);
        verify(userMapper).toUserResponse(user);
    }

    @Test
    void getUserById_ShouldThrow_WhenUserNotFound() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.getUserById(99L))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("User not found with id: 99");
    }

    // ---------------------------
    // TEST getUserEntityById
    // ---------------------------

    @Test
    void getUserEntityById_ShouldReturnUser_WhenUserExists() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        User result = userService.getUserEntityById(1L);

        assertThat(result).isNotNull();
        assertThat(result.getUsername()).isEqualTo("testuser");

        verify(userRepository).findById(1L);
    }

    @Test
    void getUserEntityById_ShouldThrow_WhenUserNotFound() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.getUserEntityById(99L))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("User not found with id: 99");
    }

    // ---------------------------
    // TEST getAllUsers
    // ---------------------------

    @Test
    void getAllUsers_ShouldReturnListOfUserResponses() {
        User user2 = new User();
        user2.setId(2L);
        user2.setUsername("otheruser");
        user2.setEmail("other@test.com");

        UserResponse userResponse2 = new UserResponse();
        userResponse2.setUsername("otheruser");
        userResponse2.setEmail("other@test.com");

        when(userRepository.findAll()).thenReturn(List.of(user, user2));
        when(userMapper.toUserResponse(user)).thenReturn(userResponse);
        when(userMapper.toUserResponse(user2)).thenReturn(userResponse2);

        List<UserResponse> responses = userService.getAllUsers();

        assertThat(responses).hasSize(2);
        assertThat(responses.get(0).getUsername()).isEqualTo("testuser");
        assertThat(responses.get(1).getUsername()).isEqualTo("otheruser");

        verify(userRepository).findAll();
    }

    @Test
    void getAllUsers_ShouldReturnEmptyList_WhenNoUsers() {
        when(userRepository.findAll()).thenReturn(List.of());

        List<UserResponse> responses = userService.getAllUsers();

        assertThat(responses).isEmpty();
        verify(userRepository).findAll();
    }

    // ---------------------------
    // TEST updateUser
    // ---------------------------

    @Test
    void updateUser_ShouldUpdateEmail_WhenEmailProvided() {
        UpdateUserRequest request = new UpdateUserRequest();
        request.setEmail("new@test.com");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(userMapper.toUserResponse(any(User.class))).thenReturn(userResponse);

        UserResponse response = userService.updateUser(1L, request);

        assertThat(response).isNotNull();
        verify(userRepository).save(any(User.class));
    }

    @Test
    void updateUser_ShouldUpdateUsername_WhenUsernameProvided() {
        UpdateUserRequest request = new UpdateUserRequest();
        request.setUsername("newusername");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(userMapper.toUserResponse(any(User.class))).thenReturn(userResponse);

        UserResponse response = userService.updateUser(1L, request);

        assertThat(response).isNotNull();
        verify(userRepository).save(any(User.class));
    }

    @Test
    void updateUser_ShouldUpdatePassword_WhenPasswordProvided() {
        UpdateUserRequest request = new UpdateUserRequest();
        request.setPassword("newPassword123");

        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(passwordEncoder.encode("newPassword123")).thenReturn("$2a$10$newEncodedHash");
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(userMapper.toUserResponse(any(User.class))).thenReturn(userResponse);

        UserResponse response = userService.updateUser(1L, request);

        assertThat(response).isNotNull();
        verify(passwordEncoder).encode("newPassword123");
        verify(userRepository).save(any(User.class));
    }

    @Test
    void updateUser_ShouldThrow_WhenUserNotFound() {
        UpdateUserRequest request = new UpdateUserRequest();
        request.setEmail("new@test.com");

        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.updateUser(99L, request))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("User not found with id: 99");
    }

    // ---------------------------
    // TEST getMe
    // ---------------------------

    @Test
    void getMe_ShouldReturnUserResponse_WhenUsernameExists() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(userMapper.toUserResponse(user)).thenReturn(userResponse);

        UserResponse response = userService.getMe("testuser");

        assertThat(response).isNotNull();
        assertThat(response.getUsername()).isEqualTo("testuser");

        verify(userRepository).findByUsername("testuser");
    }

    @Test
    void getMe_ShouldThrow_WhenUsernameNotFound() {
        when(userRepository.findByUsername("unknown")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.getMe("unknown"))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("User not found with username: unknown");
    }

    // ---------------------------
    // TEST updateMe
    // ---------------------------

    @Test
    void updateMe_ShouldUpdateEmail_WhenEmailProvided() {
        UpdateUserRequest request = new UpdateUserRequest();
        request.setEmail("updated@test.com");

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(userMapper.toUserResponse(any(User.class))).thenReturn(userResponse);

        UserResponse response = userService.updateMe("testuser", request);

        assertThat(response).isNotNull();
        verify(userRepository).save(any(User.class));
    }

    @Test
    void updateMe_ShouldUpdateUsername_WhenUsernameProvided() {
        UpdateUserRequest request = new UpdateUserRequest();
        request.setUsername("newusername");

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(userMapper.toUserResponse(any(User.class))).thenReturn(userResponse);

        UserResponse response = userService.updateMe("testuser", request);

        assertThat(response).isNotNull();
        verify(userRepository).save(any(User.class));
    }

    @Test
    void updateMe_ShouldUpdatePassword_WhenPasswordProvided() {
        UpdateUserRequest request = new UpdateUserRequest();
        request.setPassword("newPassword123");

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));
        when(passwordEncoder.encode("newPassword123")).thenReturn("$2a$10$newEncodedHash");
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(userMapper.toUserResponse(any(User.class))).thenReturn(userResponse);

        UserResponse response = userService.updateMe("testuser", request);

        assertThat(response).isNotNull();
        verify(passwordEncoder).encode("newPassword123");
        verify(userRepository).save(any(User.class));
    }

    @Test
    void updateMe_ShouldThrow_WhenUsernameNotFound() {
        UpdateUserRequest request = new UpdateUserRequest();
        request.setEmail("new@test.com");

        when(userRepository.findByUsername("unknown")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.updateMe("unknown", request))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("User not found with username: unknown");
    }
}