package com.lemiam.receptar.item;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "lr_items")
public class Item {

    private static final MathContext MC = new MathContext(10, RoundingMode.HALF_UP);

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    private String sku;

    @Column(name = "package_unit", nullable = false)
    private String packageUnit;

    @Column(name = "package_quantity")
    private BigDecimal packageQuantity;

    @Column(name = "package_price_eur")
    private BigDecimal packagePriceEur;

    @Column(name = "recipe_unit", nullable = false)
    private String recipeUnit;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "jsonb")
    private List<String> allergens;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @PrePersist
    void prePersist() {
        createdAt = OffsetDateTime.now();
        updatedAt = OffsetDateTime.now();
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = OffsetDateTime.now();
    }

    @Transient
    public BigDecimal getPricePerRecipeUnit() {
        if (packagePriceEur == null || packageQuantity == null
                || packageQuantity.compareTo(BigDecimal.ZERO) == 0) {
            return null;
        }
        BigDecimal packageQtyInRecipeUnit = convertUnits(packageQuantity, packageUnit, recipeUnit);
        if (packageQtyInRecipeUnit.compareTo(BigDecimal.ZERO) == 0) return null;
        return packagePriceEur.divide(packageQtyInRecipeUnit, MC);
    }

    private BigDecimal convertUnits(BigDecimal qty, String from, String to) {
        if (from.equalsIgnoreCase(to)) return qty;
        BigDecimal baseGrams = toGrams(qty, from.toLowerCase());
        return fromGrams(baseGrams, to.toLowerCase());
    }

    private BigDecimal toGrams(BigDecimal qty, String unit) {
        return switch (unit) {
            case "g" -> qty;
            case "kg" -> qty.multiply(new BigDecimal("1000"));
            case "ml" -> qty;
            case "l" -> qty.multiply(new BigDecimal("1000"));
            case "pcs" -> qty;
            default -> qty;
        };
    }

    private BigDecimal fromGrams(BigDecimal grams, String unit) {
        return switch (unit) {
            case "g" -> grams;
            case "kg" -> grams.divide(new BigDecimal("1000"), MC);
            case "ml" -> grams;
            case "l" -> grams.divide(new BigDecimal("1000"), MC);
            case "pcs" -> grams;
            default -> grams;
        };
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }
    public String getPackageUnit() { return packageUnit; }
    public void setPackageUnit(String packageUnit) { this.packageUnit = packageUnit; }
    public BigDecimal getPackageQuantity() { return packageQuantity; }
    public void setPackageQuantity(BigDecimal packageQuantity) { this.packageQuantity = packageQuantity; }
    public BigDecimal getPackagePriceEur() { return packagePriceEur; }
    public void setPackagePriceEur(BigDecimal packagePriceEur) { this.packagePriceEur = packagePriceEur; }
    public String getRecipeUnit() { return recipeUnit; }
    public void setRecipeUnit(String recipeUnit) { this.recipeUnit = recipeUnit; }
    public List<String> getAllergens() { return allergens; }
    public void setAllergens(List<String> allergens) { this.allergens = allergens; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }
}
