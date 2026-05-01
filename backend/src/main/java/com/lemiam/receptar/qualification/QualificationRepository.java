package com.lemiam.receptar.qualification;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface QualificationRepository extends JpaRepository<Qualification, UUID> {
    List<Qualification> findByActiveTrue();
}
