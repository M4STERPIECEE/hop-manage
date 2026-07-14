package com.rdv.service;

import com.rdv.entity.Admin;
import com.rdv.entity.AdminPasswordReset;
import com.rdv.repository.AdminPasswordResetRepository;
import com.rdv.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.ZonedDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AdminAuthService {
    private final AdminRepository adminRepository;
    private final AdminPasswordResetRepository resetRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmailService emailService;

    @Value("${app.admin.reset-ttl-minutes:15}")
    private long resetTtlMinutes;

    @Value("${app.admin.reset-url}")
    private String resetUrl;

    public boolean authenticate(String email, String password) {
        return adminRepository.findByEmail(email)
                .map(admin -> passwordEncoder.matches(password, admin.getPasswordHash()))
                .orElse(false);
    }

    public String requestReset(String email) {
        Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Admin not found"));

        String token = UUID.randomUUID().toString().replace("-", "");
        AdminPasswordReset reset = AdminPasswordReset.builder()
                .admin(admin)
                .token(token)
                .expiresAt(ZonedDateTime.now().plusMinutes(resetTtlMinutes))
                .used(false)
                .build();

        resetRepository.save(reset);
        String resetLink = resetUrl + "?token=" + token;
        emailService.sendResetEmail(admin.getEmail(), resetLink);
        return token;
    }

    public void resetPassword(String token, String newPassword) {
        AdminPasswordReset reset = resetRepository.findByToken(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid token"));

        if (reset.isUsed()) {
            throw new IllegalStateException("Token already used");
        }
        if (reset.getExpiresAt().isBefore(ZonedDateTime.now())) {
            throw new IllegalStateException("Token expired");
        }

        Admin admin = reset.getAdmin();
        admin.setPasswordHash(passwordEncoder.encode(newPassword));
        reset.setUsed(true);

        adminRepository.save(admin);
        resetRepository.save(reset);
    }
}
