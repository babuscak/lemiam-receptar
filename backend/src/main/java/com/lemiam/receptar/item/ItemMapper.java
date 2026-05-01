package com.lemiam.receptar.item;

import com.lemiam.receptar.item.dto.CreateItemRequest;
import com.lemiam.receptar.item.dto.ItemResponse;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class ItemMapper {

    public Item toEntity(CreateItemRequest request) {
        Item item = new Item();
        item.setName(request.name());
        item.setSku(request.sku() != null && !request.sku().isBlank() ? request.sku() : null);
        item.setPackageUnit(request.packageUnit());
        item.setPackageQuantity(request.packageQuantity());
        item.setPackagePriceEur(request.packagePriceEur());
        item.setRecipeUnit(request.recipeUnit());
        item.setAllergens(request.allergens() != null ? request.allergens() : List.of());
        return item;
    }

    public ItemResponse toResponse(Item item) {
        return new ItemResponse(
                item.getId(),
                item.getName(),
                item.getSku(),
                item.getPackageUnit(),
                item.getPackageQuantity(),
                item.getPackagePriceEur(),
                item.getRecipeUnit(),
                item.getPricePerRecipeUnit(),
                item.getAllergens(),
                item.isActive(),
                item.getCreatedAt(),
                item.getUpdatedAt()
        );
    }
}
