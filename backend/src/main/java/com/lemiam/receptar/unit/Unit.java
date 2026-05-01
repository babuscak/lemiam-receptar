package com.lemiam.receptar.unit;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "lr_units")
public class Unit {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true, length = 50)
    private String name;

    @Column(nullable = false, unique = true, length = 10)
    private String abbreviation;

    @Column(name = "unit_family", nullable = false, length = 20)
    private String unitFamily;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "base_unit_id")
    private Unit baseUnit;

    @Column(name = "conversion_to_base", nullable = false, precision = 18, scale = 8)
    private BigDecimal conversionToBase = BigDecimal.ONE;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @PrePersist
    void prePersist() {
        createdAt = OffsetDateTime.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getAbbreviation() { return abbreviation; }
    public void setAbbreviation(String abbreviation) { this.abbreviation = abbreviation; }
    public String getUnitFamily() { return unitFamily; }
    public void setUnitFamily(String unitFamily) { this.unitFamily = unitFamily; }
    public Unit getBaseUnit() { return baseUnit; }
    public void setBaseUnit(Unit baseUnit) { this.baseUnit = baseUnit; }
    public BigDecimal getConversionToBase() { return conversionToBase; }
    public void setConversionToBase(BigDecimal conversionToBase) { this.conversionToBase = conversionToBase; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
}
