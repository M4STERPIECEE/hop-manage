package com.rdv.config;

import com.rdv.entity.Admin;
import com.rdv.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
@Component
@RequiredArgsConstructor
public class AdminBootstrap implements ApplicationRunner {
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    @Value("${app.admin.email}")
    private String adminEmail;
    @Value("${app.admin.password}")
    private String adminPassword;

    @Override
    public void run(ApplicationArguments args) {
        adminRepository.findByEmail(adminEmail).ifPresentOrElse(existing -> {
            if (!passwordEncoder.matches(adminPassword, existing.getPasswordHash())) {
                existing.setPasswordHash(passwordEncoder.encode(adminPassword));
                adminRepository.save(existing);
            }
        }, () -> {
            Admin admin = Admin.builder()
                    .email(adminEmail)
                    .passwordHash(passwordEncoder.encode(adminPassword))
                    .build();
            adminRepository.save(admin);
        });
    }
}
