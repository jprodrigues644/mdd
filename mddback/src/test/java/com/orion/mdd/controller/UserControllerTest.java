package com.orion.mdd.controller;

import com.orion.mdd.dto.request.UpdateUserRequest;
import com.orion.mdd.dto.response.UserResponse;
import com.orion.mdd.service.UserService;
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

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    @Mock
    private UserService userService;

    @Mock
    private Authentication authentication;

    @Mock
    private SecurityContext securityContext;

    @InjectMocks
    private UserController userController;

    private UserResponse johnUserResponse;
    private UserResponse janeUserResponse;

    @BeforeEach
    void setUp() {
        johnUserResponse = new UserResponse();
        johnUserResponse.setUsername("johnDoe");
        johnUserResponse.setEmail("john@doe.com");

        janeUserResponse = new UserResponse();
        janeUserResponse.setUsername("janeDoe");
        janeUserResponse.setEmail("jane@doe.com");

        // Mock SecurityContextHolder pour simuler un utilisateur authentifié
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
    }

    @Test
    void me_ShouldReturn200_WithUserInfo_WhenUserIsAuthenticated() {
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn("johnDoe");
        when(userService.getMe("johnDoe")).thenReturn(johnUserResponse);

        ResponseEntity<UserResponse> response = userController.me();

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getUsername()).isEqualTo("johnDoe");
        assertThat(response.getBody().getEmail()).isEqualTo("john@doe.com");

        verify(userService).getMe("johnDoe");
    }

    @Test
    void me_ShouldThrow_WhenUserIsNotAuthenticated() {
        when(authentication.isAuthenticated()).thenReturn(false);

        assertThatThrownBy(() -> userController.me())
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Unauthorized");
    }

    @Test
    void updateMe_ShouldReturn200_WithUpdatedUserInfo_WhenUserIsAuthenticated() {
        UpdateUserRequest request = new UpdateUserRequest();
        request.setEmail("john.new@doe.com");

        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn("johnDoe");
        when(userService.updateMe(eq("johnDoe"), any(UpdateUserRequest.class))).thenReturn(johnUserResponse);

        ResponseEntity<UserResponse> response = userController.updateMe(request);

        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isNotNull();
        assertThat(response.getBody().getUsername()).isEqualTo("johnDoe");
        assertThat(response.getBody().getEmail()).isEqualTo("john@doe.com");

        verify(userService).updateMe(eq("johnDoe"), any(UpdateUserRequest.class));
    }

    @Test
    void updateMe_ShouldThrow_WhenUserIsNotAuthenticated() {
        when(authentication.isAuthenticated()).thenReturn(false);

        UpdateUserRequest request = new UpdateUserRequest();
        request.setEmail("john.new@doe.com");

        assertThatThrownBy(() -> userController.updateMe(request))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Unauthorized");
    }

    @Test
    void updateMe_ShouldThrow_WhenUsernameIsNull() {
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn(null);

        UpdateUserRequest request = new UpdateUserRequest();
        request.setEmail("john.new@doe.com");

        assertThatThrownBy(() -> userController.updateMe(request))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Unauthorized");
    }
}