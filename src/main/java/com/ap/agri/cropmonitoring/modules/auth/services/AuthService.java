package com.ap.agri.cropmonitoring.modules.auth.services;

import com.ap.agri.cropmonitoring.config.security.JwtTokenProvider;
import com.ap.agri.cropmonitoring.modules.auth.dtos.AuthRequest;
import com.ap.agri.cropmonitoring.modules.auth.dtos.AuthResponse;
import com.ap.agri.cropmonitoring.modules.auth.entities.User;
import com.ap.agri.cropmonitoring.modules.auth.repositories.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;

@Service
public class AuthService implements UserDetailsService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);

    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository, 
                       @Lazy AuthenticationManager authenticationManager, 
                       JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        if (!user.isActive()) {
            throw new IllegalArgumentException("User account is inactive");
        }

        // Standard UserDetails mapping
        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().getName()))
        );
    }

    /**
     * Authenticate user credentials and return JWT bearer token response
     */
    @Transactional(readOnly = true)
    public AuthResponse login(AuthRequest request) {
        log.debug("Attempting authentication for user: {}", request.getUsername());
        
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User missing in database"));

        log.info("User {} successfully authenticated with role: {}", user.getUsername(), user.getRole().getName());

        return AuthResponse.builder()
                .token(jwt)
                .username(user.getUsername())
                .role(user.getRole().getName())
                .fullName(user.getFullName())
                .build();
    }
}
