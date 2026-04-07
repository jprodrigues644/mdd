package com.orion.mdd.service;

import com.orion.mdd.dto.request.LoginRequest;
import com.orion.mdd.dto.request.RegisterRequest;
import com.orion.mdd.dto.response.AuthResponse;
import com.orion.mdd.mapper.UserMapper;
import com.orion.mdd.model.User;
import com.orion.mdd.repository.UserRepository;
import com.orion.mdd.security.JwtTokenProvider;
import com.orion.mdd.service.impl.AuthServiceImpl;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.mockito.ArgumentMatchers.any;

@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock private UserRepository userRepository;
    @Mock private PasswordEncoder passwordEncoder;
    @Mock private JwtTokenProvider jwtTokenProvider;
    @Mock private UserMapper userMapper;

    @InjectMocks
    private AuthServiceImpl authService;

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
        user.setId(1L);
        user.setUsername("testuser");
        user.setEmail("test@test.com");
        user.setPassword("encodedPassword");
    }

    // ---------------------------
    // TEST REGISTER
    // ---------------------------

    @Test
    void register_ShouldReturnAuthResponse_WhenValidRequest() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("testuser");
        request.setEmail("test@test.com");
        request.setPassword("password123");

        // No duplicate username or email
        when(userRepository.existsByUsername("testuser")).thenReturn(false);
        when(userRepository.existsByEmail("test@test.com")).thenReturn(false);

        // Encode password
        when(passwordEncoder.encode("password123")).thenReturn("encodedPassword");

        // Mapper → entity
        when(userMapper.toUser(any())).thenReturn(user);

        // Save entity
        when(userRepository.save(any(User.class))).thenReturn(user);

        // Generate token
        when(jwtTokenProvider.generateToken(any())).thenReturn("jwt-token");

        AuthResponse response = authService.register(request);

        assertThat(response).isNotNull();
        assertThat(response.getToken()).isEqualTo("jwt-token");
        assertThat(response.getUsername()).isEqualTo("testuser");

        verify(userRepository).save(any(User.class));
    }

    @Test
    void register_ShouldThrow_WhenUsernameExists() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("testuser");

        when(userRepository.existsByUsername("testuser")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Username already exists");
    }

    @Test
    void register_ShouldThrow_WhenEmailExists() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("testuser");
        request.setEmail("test@test.com");

        when(userRepository.existsByUsername("testuser")).thenReturn(false);
        when(userRepository.existsByEmail("test@test.com")).thenReturn(true);

        assertThatThrownBy(() -> authService.register(request))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Email already exists");
    }


    // ---------------------------
    // TEST LOGIN
    // ---------------------------

    @Test
    void login_ShouldReturnAuthResponse_WhenValidCredentials() {
        LoginRequest request = new LoginRequest();
        request.setUsernameOrEmail("testuser");
        request.setPassword("password123");

        when(userRepository.findByUsernameOrEmail("testuser", "testuser"))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches("password123", "encodedPassword"))
                .thenReturn(true);

        when(jwtTokenProvider.generateToken(any())).thenReturn("jwt-token");

        AuthResponse response = authService.login(request);

        assertThat(response).isNotNull();
        assertThat(response.getToken()).isEqualTo("jwt-token");
        assertThat(response.getUsername()).isEqualTo("testuser");
    }

    @Test
    void login_ShouldThrow_WhenUserNotFound() {
        LoginRequest request = new LoginRequest();
        request.setUsernameOrEmail("unknown");

        when(userRepository.findByUsernameOrEmail("unknown", "unknown"))
                .thenReturn(Optional.empty());

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("User not found");
    }

    @Test
    void login_ShouldThrow_WhenPasswordInvalid() {
        LoginRequest request = new LoginRequest();
        request.setUsernameOrEmail("testuser");
        request.setPassword("wrong");

        when(userRepository.findByUsernameOrEmail("testuser", "testuser"))
                .thenReturn(Optional.of(user));

        when(passwordEncoder.matches("wrong", "encodedPassword"))
                .thenReturn(false);

        assertThatThrownBy(() -> authService.login(request))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Invalid password");
    }

}