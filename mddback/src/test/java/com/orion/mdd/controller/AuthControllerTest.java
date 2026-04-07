package com.orion.mdd.controller;

import com.orion.mdd.dto.request.LoginRequest;
import com.orion.mdd.dto.request.RegisterRequest;
import com.orion.mdd.dto.response.AuthResponse;
import com.orion.mdd.service.AuthService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController authController;

    private AuthResponse johnAuthResponse;
    private AuthResponse janeAuthResponse;

    @BeforeEach
    void setUp() {
        johnAuthResponse = new AuthResponse();
        johnAuthResponse.setToken("jwt-token-john");
        johnAuthResponse.setUsername("johnDoe");

        janeAuthResponse = new AuthResponse();
        janeAuthResponse.setToken("jwt-token-jane");
        janeAuthResponse.setUsername("janeDoe");
    }

    @Test
    void register_ShouldReturn200_WithToken_WhenJohnRegisters() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("johnDoe");
        request.setEmail("john@doe.com");
        request.setPassword("Password123!");

        when(authService.register(any(RegisterRequest.class))).thenReturn(johnAuthResponse);

        ResponseEntity<AuthResponse> response = authController.register(request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getToken()).isEqualTo("jwt-token-john");
        assertThat(response.getBody().getUsername()).isEqualTo("johnDoe");

        verify(authService).register(any(RegisterRequest.class));
    }

    @Test
    void register_ShouldReturn200_WithToken_WhenJaneRegisters() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("janeDoe");
        request.setEmail("jane@doe.com");
        request.setPassword("SecurePass456!");

        when(authService.register(any(RegisterRequest.class))).thenReturn(janeAuthResponse);

        ResponseEntity<AuthResponse> response = authController.register(request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getToken()).isEqualTo("jwt-token-jane");
        assertThat(response.getBody().getUsername()).isEqualTo("janeDoe");

        verify(authService).register(any(RegisterRequest.class));
    }

    @Test
    void register_ShouldThrow_WhenUsernameAlreadyExists() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("johnDoe");
        request.setEmail("john@doe.com");
        request.setPassword("Password123!");

        when(authService.register(any(RegisterRequest.class)))
                .thenThrow(new RuntimeException("Username already exists"));

        assertThatThrownBy(() -> authController.register(request))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Username already exists");
    }

    @Test
    void register_ShouldThrow_WhenEmailAlreadyExists() {
        RegisterRequest request = new RegisterRequest();
        request.setUsername("janeDoe");
        request.setEmail("jane@doe.com");
        request.setPassword("SecurePass456!");

        when(authService.register(any(RegisterRequest.class)))
                .thenThrow(new RuntimeException("Email already exists"));

        assertThatThrownBy(() -> authController.register(request))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Email already exists");
    }

    @Test
    void login_ShouldReturn200_WithToken_WhenJohnLogsInWithUsername() {
        LoginRequest request = new LoginRequest();
        request.setUsernameOrEmail("johnDoe");
        request.setPassword("Password123!");

        when(authService.login(any(LoginRequest.class))).thenReturn(johnAuthResponse);

        ResponseEntity<AuthResponse> response = authController.login(request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getToken()).isEqualTo("jwt-token-john");
        assertThat(response.getBody().getUsername()).isEqualTo("johnDoe");

        verify(authService).login(any(LoginRequest.class));
    }

    @Test
    void login_ShouldReturn200_WithToken_WhenJaneLogsInWithEmail() {
        LoginRequest request = new LoginRequest();
        request.setUsernameOrEmail("jane@doe.com");
        request.setPassword("SecurePass456!");

        when(authService.login(any(LoginRequest.class))).thenReturn(janeAuthResponse);

        ResponseEntity<AuthResponse> response = authController.login(request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getToken()).isEqualTo("jwt-token-jane");
        assertThat(response.getBody().getUsername()).isEqualTo("janeDoe");

        verify(authService).login(any(LoginRequest.class));
    }

    @Test
    void login_ShouldThrow_WhenUserNotFound() {
        LoginRequest request = new LoginRequest();
        request.setUsernameOrEmail("unknown@doe.com");
        request.setPassword("Password123!");

        when(authService.login(any(LoginRequest.class)))
                .thenThrow(new RuntimeException("User not found"));

        assertThatThrownBy(() -> authController.login(request))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("User not found");
    }

    @Test
    void login_ShouldThrow_WhenPasswordInvalid() {
        LoginRequest request = new LoginRequest();
        request.setUsernameOrEmail("johnDoe");
        request.setPassword("WrongPassword!");

        when(authService.login(any(LoginRequest.class)))
                .thenThrow(new RuntimeException("Invalid password"));

        assertThatThrownBy(() -> authController.login(request))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Invalid password");
    }
}