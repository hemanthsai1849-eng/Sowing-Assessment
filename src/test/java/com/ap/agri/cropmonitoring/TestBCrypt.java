package com.ap.agri.cropmonitoring;

import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class TestBCrypt {

    @Test
    public void testHash() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String raw = "admin123";
        String hash = encoder.encode(raw);
        System.out.println(">>> CORRECT_BCRYPT_HASH: " + hash);
        
        String provided = "$2a$10$8.UnVuG9HHgffUDAlk8GPuRSTu4N1z7DOH84vQvJjP9V1gXv7Hq/O";
        boolean match = encoder.matches(raw, provided);
        System.out.println(">>> PROVIDED_HASH_MATCHES: " + match);
    }
}
