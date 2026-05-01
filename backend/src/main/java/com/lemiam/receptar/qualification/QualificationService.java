package com.lemiam.receptar.qualification;

import com.lemiam.receptar.common.exception.NotFoundException;
import com.lemiam.receptar.qualification.dto.CreateQualificationRequest;
import com.lemiam.receptar.qualification.dto.UpdateQualificationRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class QualificationService {

    private final QualificationRepository repository;

    public QualificationService(QualificationRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<Qualification> findAll(Boolean active) {
        if (Boolean.TRUE.equals(active)) {
            return repository.findByActiveTrue();
        }
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public Qualification findById(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new NotFoundException("Qualification not found: " + id));
    }

    public Qualification create(CreateQualificationRequest request) {
        Qualification q = new Qualification();
        q.setName(request.name());
        q.setHourlyRateEur(request.hourlyRateEur());
        return repository.save(q);
    }

    public Qualification update(UUID id, UpdateQualificationRequest request) {
        Qualification q = findById(id);
        if (request.name() != null) q.setName(request.name());
        if (request.hourlyRateEur() != null) q.setHourlyRateEur(request.hourlyRateEur());
        if (request.active() != null) q.setActive(request.active());
        return repository.save(q);
    }

    public void softDelete(UUID id) {
        Qualification q = findById(id);
        q.setActive(false);
        repository.save(q);
    }
}
