package com.rdv.service;

import com.rdv.entity.ServiceRDV;
import com.rdv.repository.ServiceRepository;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ServiceRDVService {
    private final ServiceRepository serviceRepository;

    public List<ServiceRDV> findAll() {
        return serviceRepository.findAll();
    }

    public ServiceRDV findById(@NonNull UUID id) {
        return serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found"));
    }

    @Transactional
    public ServiceRDV create(@NonNull ServiceRDV serviceRDV) {
        return serviceRepository.save(serviceRDV);
    }

    @Transactional
    public ServiceRDV updateFields(@NonNull UUID id, @NonNull Integer durationMinutes, @NonNull java.math.BigDecimal price, @NonNull String status) {
        ServiceRDV service = findById(id);
        service.setDurationMinutes(durationMinutes);
        service.setPrice(price);
        service.setStatus(status);
        return serviceRepository.save(service);
    }
}
