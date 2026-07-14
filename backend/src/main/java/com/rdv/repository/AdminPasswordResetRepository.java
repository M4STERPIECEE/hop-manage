package com.rdv.repository;

import com.rdv.entity.AdminPasswordReset;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface AdminPasswordResetRepository extends JpaRepository<AdminPasswordReset, UUID> {
    Optional<AdminPasswordReset> findByToken(String token);
}
