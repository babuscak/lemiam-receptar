package com.lemiam.receptar.unit;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UnitRepository extends JpaRepository<Unit, UUID> {

    Optional<Unit> findByAbbreviation(String abbreviation);

    List<Unit> findByUnitFamily(String unitFamily);

    List<Unit> findByBaseUnitId(UUID baseUnitId);
}
