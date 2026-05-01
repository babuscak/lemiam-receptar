package com.lemiam.receptar.recipe;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface RecipeRepository extends JpaRepository<Recipe, UUID> {

    @EntityGraph(attributePaths = {"lines", "lines.item", "lines.subRecipe", "lines.subRecipe.lines", "lines.subRecipe.lines.item"})
    @Query("SELECT r FROM Recipe r " +
           "WHERE (:active IS NULL OR r.active = :active) " +
           "AND (:type IS NULL OR r.type = :type) " +
           "AND (:search IS NULL OR LOWER(r.name) LIKE LOWER(CONCAT('%', CAST(:search AS string), '%')))")
    List<Recipe> findFiltered(@Param("active") Boolean active,
                              @Param("type") String type,
                              @Param("search") String search);

    @EntityGraph(attributePaths = {"lines", "lines.item", "lines.subRecipe", "lines.subRecipe.lines", "lines.subRecipe.lines.item"})
    @Query("SELECT r FROM Recipe r WHERE r.id = :id")
    Optional<Recipe> findByIdWithLines(@Param("id") UUID id);

    @EntityGraph(attributePaths = {"lines", "lines.item"})
    @Query("SELECT r FROM Recipe r WHERE r.type = 'SUB' AND r.active = true")
    List<Recipe> findActiveSubRecipes();

    @Query("SELECT COUNT(l) > 0 FROM RecipeLine l WHERE l.subRecipe.id = :recipeId")
    boolean existsLinesBySubRecipeId(@Param("recipeId") UUID recipeId);
}
