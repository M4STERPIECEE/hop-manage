package com.rdv.repository;

import com.rdv.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.ZonedDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, UUID> {
    @Query("SELECT a FROM Appointment a WHERE a.appointmentDate >= :start AND a.appointmentDate <= :end")
    List<Appointment> findByAppointmentDateBetween(@Param("start") ZonedDateTime start,
            @Param("end") ZonedDateTime end);
}