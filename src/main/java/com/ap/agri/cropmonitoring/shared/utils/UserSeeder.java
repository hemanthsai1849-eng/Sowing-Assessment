package com.ap.agri.cropmonitoring.shared.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import com.ap.agri.cropmonitoring.modules.auth.entities.Role;
import com.ap.agri.cropmonitoring.modules.auth.entities.User;
import com.ap.agri.cropmonitoring.modules.auth.repositories.RoleRepository;
import com.ap.agri.cropmonitoring.modules.auth.repositories.UserRepository;

/**
 * User Seeder Component
 * Automatically creates default roles and users on application startup
 * if they don't already exist.
 */
@Component
public class UserSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(UserSeeder.class);

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserSeeder(RoleRepository roleRepository, 
                      UserRepository userRepository,
                      PasswordEncoder passwordEncoder) {
        this.roleRepository = roleRepository;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        try {
            // Skip if users already exist
            if (userRepository.count() > 0) {
                log.info("User Seeder: Users already exist. Skipping user seeding.");
                return;
            }

            log.info("--------------------------------------------------------------------------------");
            log.info("[USER SEEDER] Creating default roles and users...");

            // Create default roles if they don't exist
            Role adminRole = roleRepository.findByName("ADMIN")
                    .orElseGet(() -> {
                        Role role = new Role();
                        role.setName("ADMIN");
                        role.setDescription("System administrator with full read/write privileges");
                        return roleRepository.save(role);
                    });
            log.info("Ensured ADMIN role exists");

            Role officerRole = roleRepository.findByName("OFFICER")
                    .orElseGet(() -> {
                        Role role = new Role();
                        role.setName("OFFICER");
                        role.setDescription("Agriculture Department officer with operational privileges");
                        return roleRepository.save(role);
                    });
            log.info("Ensured OFFICER role exists");

            Role analystRole = roleRepository.findByName("ANALYST")
                    .orElseGet(() -> {
                        Role role = new Role();
                        role.setName("ANALYST");
                        role.setDescription("GIS/Satellite analyst with read and trigger privileges");
                        return roleRepository.save(role);
                    });
            log.info("Ensured ANALYST role exists");

            // Create default users with BCrypt hashed password 'admin123'
            String hashedPassword = passwordEncoder.encode("admin123");

            User adminUser = new User();
            adminUser.setUsername("ap_admin");
            adminUser.setPassword(hashedPassword);
            adminUser.setEmail("admin@ap.gov.in");
            adminUser.setFullName("AP Agri Admin User");
            adminUser.setRole(adminRole);
            adminUser.setActive(true);
            userRepository.save(adminUser);
            log.info("Created user: ap_admin");

            User officerUser = new User();
            officerUser.setUsername("ap_officer");
            officerUser.setPassword(hashedPassword);
            officerUser.setEmail("officer@ap.gov.in");
            officerUser.setFullName("AP Agri Field Officer");
            officerUser.setRole(officerRole);
            officerUser.setActive(true);
            userRepository.save(officerUser);
            log.info("Created user: ap_officer");

            User analystUser = new User();
            analystUser.setUsername("ap_analyst");
            analystUser.setPassword(hashedPassword);
            analystUser.setEmail("analyst@ap.gov.in");
            analystUser.setFullName("AP Agri GIS Analyst");
            analystUser.setRole(analystRole);
            analystUser.setActive(true);
            userRepository.save(analystUser);
            log.info("Created user: ap_analyst");

            log.info("[USER SEEDER] User seeding completed successfully!");
            log.info("Available credentials:");
            log.info("  - Username: ap_admin, Password: admin123");
            log.info("  - Username: ap_officer, Password: admin123");
            log.info("  - Username: ap_analyst, Password: admin123");
            log.info("--------------------------------------------------------------------------------");

        } catch (Exception e) {
            log.error("[USER SEEDER] User seeding failed with error: ", e);
        }
    }
}
