package com.lemiam.receptar.recipe;

import com.lemiam.receptar.recipe.dto.CreateRecipeRequest;
import com.lemiam.receptar.recipe.dto.RecipeResponse;
import com.lemiam.receptar.recipe.dto.UpdateRecipeRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/recipes")
public class RecipeController {

    private final RecipeService recipeService;
    private final RecipeMapper recipeMapper;

    public RecipeController(RecipeService recipeService, RecipeMapper recipeMapper) {
        this.recipeService = recipeService;
        this.recipeMapper = recipeMapper;
    }

    @GetMapping
    public List<RecipeResponse> list(@RequestParam(required = false) Boolean active,
                                     @RequestParam(required = false) String type,
                                     @RequestParam(required = false) String search) {
        return recipeService.findAll(active, type, search).stream()
                .map(recipeMapper::toResponse)
                .toList();
    }

    @GetMapping("/sub-recipes")
    public List<RecipeResponse> subRecipes() {
        return recipeService.findSubRecipes().stream()
                .map(recipeMapper::toResponse)
                .toList();
    }

    @GetMapping("/{id}")
    public RecipeResponse get(@PathVariable UUID id) {
        return recipeMapper.toResponse(recipeService.findById(id));
    }

    @PostMapping
    public ResponseEntity<RecipeResponse> create(@Valid @RequestBody CreateRecipeRequest request) {
        Recipe recipe = recipeService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(recipeMapper.toResponse(recipe));
    }

    @PatchMapping("/{id}")
    public RecipeResponse update(@PathVariable UUID id,
                                 @Valid @RequestBody UpdateRecipeRequest request) {
        return recipeMapper.toResponse(recipeService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable UUID id,
                       @RequestParam(defaultValue = "false") boolean hard) {
        if (hard) {
            recipeService.hardDelete(id);
        } else {
            recipeService.softDelete(id);
        }
    }
}
