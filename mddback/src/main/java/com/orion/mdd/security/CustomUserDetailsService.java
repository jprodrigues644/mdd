package com.orion.mdd.security;

import com.orion.mdd.model.User;
import com.orion.mdd.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String login) throws UsernameNotFoundException {

        User user = userRepository.findByUsername(login)
                .or(() -> userRepository.findByEmail(login))
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with login: " + login));

        // Si tu n’as pas encore les rôles, laisse vide
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername()) 
                .password(user.getPassword())
                .roles() // aucune authority pour l’instant
                .build();
    }
}
