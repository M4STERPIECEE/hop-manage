package com.rdv.repository;

import com.rdv.entity.ServiceRDV;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ServiceRepository extends JpaRepository<ServiceRDV, UUID> {
    Optional<ServiceRDV> findByName(String name);
}
