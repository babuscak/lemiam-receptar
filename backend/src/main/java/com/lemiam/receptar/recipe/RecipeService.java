package com.lemiam.receptar.recipe;

import com.lemiam.receptar.common.exception.ConflictException;
import com.lemiam.receptar.common.exception.NotFoundException;
import com.lemiam.receptar.item.Item;
import com.lemiam.receptar.item.ItemRepository;
import com.lemiam.receptar.recipe.dto.CreateRecipeRequest;
import com.lemiam.receptar.recipe.dto.RecipeLineRequest;
import com.lemiam.receptar.recipe.dto.UpdateRecipeRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class RecipeService {

    private final RecipeRepository recipeRepository;
    private final ItemRepository itemRepository;
    private final RecipeMapper recipeMapper;

    public RecipeService(RecipeRepository recipeRepository,
                         ItemRepository itemRepository,
                         RecipeMapper recipeMapper) {
        this.recipeRepository = recipeRepository;
        this.itemRepository = itemRepository;
        this.recipeMapper = recipeMapper;
    }

    @Transactional(readOnly = true)
    public List<Recipe> findAll(Boolean active, String type, String search) {
        return recipeRepository.findFiltered(active, type, search);
    }

    @Transactional(readOnly = true)
    public Recipe findById(UUID id) {
        return recipeRepository.findByIdWithLines(id)
                .orElseThrow(() -> new NotFoundException("Recipe not found: " + id));
    }

    @Transactional(readOnly = true)
    public List<Recipe> findSubRecipes() {
        return recipeRepository.findActiveSubRecipes();
    }

    public Recipe create(CreateRecipeRequest request) {
        validateType(request.type());

        Recipe recipe = new Recipe();
        recipe.setName(request.name());
        recipe.setType(request.type());
        recipe.setPortions(request.portions());
        recipe.setNotes(request.notes());

        for (RecipeLineRequest lineReq : request.lines()) {
            RecipeLine line = buildLine(lineReq, request.type());
            recipe.addLine(line);
        }

        Recipe saved = recipeRepository.save(recipe);
        return findById(saved.getId());
    }

    public Recipe update(UUID id, UpdateRecipeRequest request) {
        Recipe recipe = findById(id);

        if (request.name() != null) recipe.setName(request.name());
        if (request.type() != null) {
            validateType(request.type());
            recipe.setType(request.type());
        }
        if (request.portions() != null) recipe.setPortions(request.portions());
        if (request.notes() != null) recipe.setNotes(request.notes());
        if (request.active() != null) recipe.setActive(request.active());

        if (request.lines() != null) {
            String effectiveType = request.type() != null ? request.type() : recipe.getType();
            recipe.getLines().clear();
            for (RecipeLineRequest lineReq : request.lines()) {
                RecipeLine line = buildLine(lineReq, effectiveType);
                recipe.addLine(line);
            }
        }

        Recipe saved = recipeRepository.save(recipe);
        return findById(saved.getId());
    }

    public void softDelete(UUID id) {
        Recipe recipe = findById(id);
        recipe.setActive(false);
        recipeRepository.save(recipe);
    }

    public void hardDelete(UUID id) {
        Recipe recipe = findById(id);
        if (recipeRepository.existsLinesBySubRecipeId(id)) {
            throw new ConflictException("Cannot delete recipe '" + recipe.getName()
                    + "': it is used as a sub-recipe in other recipes");
        }
        recipeRepository.delete(recipe);
    }

    private RecipeLine buildLine(RecipeLineRequest lineReq, String recipeType) {
        if (lineReq.subRecipeId() != null) {
            if ("SUB".equals(recipeType)) {
                throw new IllegalArgumentException("SUB recipes cannot contain sub-recipe lines");
            }
            Recipe subRecipe = recipeRepository.findById(lineReq.subRecipeId())
                    .orElseThrow(() -> new NotFoundException("Sub-recipe not found: " + lineReq.subRecipeId()));
            if (!"SUB".equals(subRecipe.getType())) {
                throw new IllegalArgumentException("Only SUB recipes can be used as sub-recipe ingredients");
            }
            if (!subRecipe.isActive()) {
                throw new IllegalArgumentException("Sub-recipe is not active: " + lineReq.subRecipeId());
            }
            return recipeMapper.toSubRecipeLineEntity(lineReq, subRecipe);
        } else if (lineReq.itemId() != null) {
            Item item = findActiveItem(lineReq.itemId());
            return recipeMapper.toLineEntity(lineReq, item);
        } else {
            throw new IllegalArgumentException("Recipe line must reference either an item or a sub-recipe");
        }
    }

    private void validateType(String type) {
        if (!"FINAL".equals(type) && !"SUB".equals(type)) {
            throw new IllegalArgumentException("Recipe type must be FINAL or SUB");
        }
    }

    private Item findActiveItem(UUID itemId) {
        Item item = itemRepository.findById(itemId)
                .orElseThrow(() -> new NotFoundException("Item not found: " + itemId));
        if (!item.isActive()) {
            throw new IllegalArgumentException("Item is not active: " + itemId);
        }
        return item;
    }
}
