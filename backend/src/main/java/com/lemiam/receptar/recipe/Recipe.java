package com.lemiam.receptar.recipe;

import jakarta.persistence.*;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "lr_recipes")
public class Recipe {

    private static final MathContext MC = new MathContext(10, RoundingMode.HALF_UP);

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String type = "FINAL";

    @Column(nullable = false)
    private int portions;

    private String notes;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("sortOrder")
    private List<RecipeLine> lines = new ArrayList<>();

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
    public BigDecimal getPricePerPortion() {
        BigDecimal total = getTotalCost();
        if (total == null) return null;
        return total.divide(BigDecimal.valueOf(portions), MC);
    }

    @Transient
    public BigDecimal getTotalCost() {
        BigDecimal total = BigDecimal.ZERO;
        for (RecipeLine line : lines) {
            if (line.isSubRecipeLine()) {
                BigDecimal subPpp = line.getSubRecipe().getPricePerPortion();
                if (subPpp == null) return null;
                total = total.add(line.getQuantity().multiply(subPpp, MC));
            } else {
                BigDecimal pricePerUnit = line.getItem().getPricePerRecipeUnit();
                if (pricePerUnit == null) return null;
                total = total.add(line.getQuantity().multiply(pricePerUnit, MC));
            }
        }
        return total;
    }

    public void addLine(RecipeLine line) {
        lines.add(line);
        line.setRecipe(this);
    }

    // Getters and setters

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public int getPortions() { return portions; }
    public void setPortions(int portions) { this.portions = portions; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    public List<RecipeLine> getLines() { return lines; }
    public void setLines(List<RecipeLine> lines) { this.lines = lines; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }
}
