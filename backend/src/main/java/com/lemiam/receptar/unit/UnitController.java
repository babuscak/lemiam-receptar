package com.lemiam.receptar.unit;

import com.lemiam.receptar.unit.dto.UnitResponse;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/units")
public class UnitController {

    private final UnitService unitService;

    public UnitController(UnitService unitService) {
        this.unitService = unitService;
    }

    @GetMapping
    public List<UnitResponse> list(@RequestParam(required = false) String family) {
        return unitService.findAll(family).stream()
                .map(this::toResponse)
                .toList();
    }

    @GetMapping("/{id}")
    public UnitResponse get(@PathVariable UUID id) {
        return toResponse(unitService.findById(id));
    }

    private UnitResponse toResponse(Unit unit) {
        return new UnitResponse(
                unit.getId(),
                unit.getName(),
                unit.getAbbreviation(),
                unit.getUnitFamily(),
                unit.getBaseUnit() != null ? unit.getBaseUnit().getId() : null,
                unit.getConversionToBase()
        );
    }
}
