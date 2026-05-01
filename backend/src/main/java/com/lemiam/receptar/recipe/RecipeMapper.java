package com.lemiam.receptar.recipe;

import com.lemiam.receptar.item.Item;
import com.lemiam.receptar.recipe.dto.RecipeLineRequest;
import com.lemiam.receptar.recipe.dto.RecipeLineResponse;
import com.lemiam.receptar.recipe.dto.RecipeResponse;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;

@Component
public class RecipeMapper {

    private static final MathContext MC = new MathContext(10, RoundingMode.HALF_UP);

    public RecipeLine toLineEntity(RecipeLineRequest request, Item item) {
        RecipeLine line = new RecipeLine();
        line.setItem(item);
        line.setQuantity(request.quantity());
        line.setSortOrder(request.sortOrder() != null ? request.sortOrder() : 0);
        return line;
    }

    public RecipeLine toSubRecipeLineEntity(RecipeLineRequest request, Recipe subRecipe) {
        RecipeLine line = new RecipeLine();
        line.setSubRecipe(subRecipe);
        line.setQuantity(request.quantity());
        line.setSortOrder(request.sortOrder() != null ? request.sortOrder() : 0);
        return line;
    }

    public RecipeLineResponse toLineResponse(RecipeLine line) {
        if (line.isSubRecipeLine()) {
            Recipe sub = line.getSubRecipe();
            BigDecimal pricePerPortion = sub.getPricePerPortion();
            BigDecimal lineCost = pricePerPortion != null
                    ? line.getQuantity().multiply(pricePerPortion, MC)
                    : null;

            return new RecipeLineResponse(
                    line.getId(),
                    null,
                    null,
                    sub.getId(),
                    sub.getName(),
                    "ptn",
                    line.getQuantity(),
                    pricePerPortion,
                    lineCost,
                    line.getSortOrder(),
                    line.getCreatedAt()
            );
        }

        Item item = line.getItem();
        BigDecimal pricePerUnit = item.getPricePerRecipeUnit();
        BigDecimal lineCost = pricePerUnit != null
                ? line.getQuantity().multiply(pricePerUnit, MC)
                : null;

        return new RecipeLineResponse(
                line.getId(),
                item.getId(),
                item.getName(),
                null,
                null,
                item.getRecipeUnit(),
                line.getQuantity(),
                pricePerUnit,
                lineCost,
                line.getSortOrder(),
                line.getCreatedAt()
        );
    }

    public RecipeResponse toResponse(Recipe recipe) {
        return new RecipeResponse(
                recipe.getId(),
                recipe.getName(),
                recipe.getType(),
                recipe.getPortions(),
                recipe.getPricePerPortion(),
                recipe.getTotalCost(),
                recipe.getNotes(),
                recipe.getLines().stream().map(this::toLineResponse).toList(),
                recipe.isActive(),
                recipe.getCreatedAt(),
                recipe.getUpdatedAt()
        );
    }
}
