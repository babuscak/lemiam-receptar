package com.lemiam.receptar.qualification;

import com.lemiam.receptar.qualification.dto.CreateQualificationRequest;
import com.lemiam.receptar.qualification.dto.QualificationResponse;
import com.lemiam.receptar.qualification.dto.UpdateQualificationRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/qualifications")
public class QualificationController {

    private final QualificationService service;

    public QualificationController(QualificationService service) {
        this.service = service;
    }

    @GetMapping
    public List<QualificationResponse> list(@RequestParam(required = false) Boolean active) {
        return service.findAll(active).stream()
                .map(this::toResponse)
                .toList();
    }

    @GetMapping("/{id}")
    public QualificationResponse get(@PathVariable UUID id) {
        return toResponse(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<QualificationResponse> create(@Valid @RequestBody CreateQualificationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponse(service.create(request)));
    }

    @PatchMapping("/{id}")
    public QualificationResponse update(@PathVariable UUID id, @RequestBody UpdateQualificationRequest request) {
        return toResponse(service.update(id, request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id) {
        service.softDelete(id);
    }

    private QualificationResponse toResponse(Qualification q) {
        return new QualificationResponse(q.getId(), q.getName(), q.getHourlyRateEur(),
                q.isActive(), q.getCreatedAt(), q.getUpdatedAt());
    }
}
