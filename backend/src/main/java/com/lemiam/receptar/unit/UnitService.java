package com.lemiam.receptar.unit;

import com.lemiam.receptar.common.exception.NotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional(readOnly = true)
public class UnitService {

    private final UnitRepository unitRepository;

    public UnitService(UnitRepository unitRepository) {
        this.unitRepository = unitRepository;
    }

    public List<Unit> findAll(String family) {
        if (family != null) {
            return unitRepository.findByUnitFamily(family);
        }
        return unitRepository.findAll();
    }

    public Unit findById(UUID id) {
        return unitRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Unit not found: " + id));
    }

    public Unit findByAbbreviation(String abbreviation) {
        return unitRepository.findByAbbreviation(abbreviation)
                .orElseThrow(() -> new NotFoundException("Unit not found: " + abbreviation));
    }
}
