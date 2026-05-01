package com.lemiam.receptar.item;

import com.lemiam.receptar.common.exception.NotFoundException;
import com.lemiam.receptar.item.dto.CreateItemRequest;
import com.lemiam.receptar.item.dto.UpdateItemRequest;
import com.lemiam.receptar.unit.UnitRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class ItemService {

    private final ItemRepository itemRepository;
    private final ItemMapper itemMapper;
    private final UnitRepository unitRepository;

    public ItemService(ItemRepository itemRepository, ItemMapper itemMapper, UnitRepository unitRepository) {
        this.itemRepository = itemRepository;
        this.itemMapper = itemMapper;
        this.unitRepository = unitRepository;
    }

    @Transactional(readOnly = true)
    public List<Item> findAll(Boolean active, String search) {
        return itemRepository.findFiltered(active, search);
    }

    @Transactional(readOnly = true)
    public Item findById(UUID id) {
        return itemRepository.findById(id)
                .orElseThrow(() -> new NotFoundException("Item not found: " + id));
    }

    public Item create(CreateItemRequest request) {
        validateUnitFamilies(request.packageUnit(), request.recipeUnit());
        Item item = itemMapper.toEntity(request);
        return itemRepository.save(item);
    }

    public Item update(UUID id, UpdateItemRequest request) {
        Item item = findById(id);
        if (request.name() != null) item.setName(request.name());
        if (request.sku() != null) item.setSku(request.sku().isBlank() ? null : request.sku());
        if (request.packageUnit() != null) item.setPackageUnit(request.packageUnit());
        if (request.packageQuantity() != null) item.setPackageQuantity(request.packageQuantity());
        if (request.packagePriceEur() != null) item.setPackagePriceEur(request.packagePriceEur());
        if (request.recipeUnit() != null) item.setRecipeUnit(request.recipeUnit());
        if (request.allergens() != null) item.setAllergens(request.allergens());
        if (request.active() != null) item.setActive(request.active());

        String pkgUnit = request.packageUnit() != null ? request.packageUnit() : item.getPackageUnit();
        String rcpUnit = request.recipeUnit() != null ? request.recipeUnit() : item.getRecipeUnit();
        validateUnitFamilies(pkgUnit, rcpUnit);

        return itemRepository.save(item);
    }

    public void softDelete(UUID id) {
        Item item = findById(id);
        item.setActive(false);
        itemRepository.save(item);
    }

    private void validateUnitFamilies(String packageUnit, String recipeUnit) {
        var pkgUnit = unitRepository.findByAbbreviation(packageUnit)
                .orElseThrow(() -> new IllegalArgumentException("Unknown package unit: " + packageUnit));
        var rcpUnit = unitRepository.findByAbbreviation(recipeUnit)
                .orElseThrow(() -> new IllegalArgumentException("Unknown recipe unit: " + recipeUnit));
        if (!pkgUnit.getUnitFamily().equals(rcpUnit.getUnitFamily())) {
            throw new IllegalArgumentException(
                    "Package unit '" + packageUnit + "' (family: " + pkgUnit.getUnitFamily() +
                    ") and recipe unit '" + recipeUnit + "' (family: " + rcpUnit.getUnitFamily() +
                    ") must belong to the same unit family");
        }
    }
}
