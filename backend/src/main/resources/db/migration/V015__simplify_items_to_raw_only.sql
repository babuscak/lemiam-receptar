-- V015: Simplify items to raw ingredients only
-- Drop dependent tables (reverse creation order), then remove type column from lr_items

DROP TABLE IF EXISTS lr_impact_event_items;
DROP TABLE IF EXISTS lr_impact_events;
DROP TABLE IF EXISTS lr_final_product_pricing;
DROP TABLE IF EXISTS lr_computed_cost_snapshots;
DROP TABLE IF EXISTS lr_dependency_edges;
DROP TABLE IF EXISTS lr_recipe_labor_lines;
DROP TABLE IF EXISTS lr_recipe_lines;
DROP TABLE IF EXISTS lr_recipes;

-- Remove type column and its CHECK constraint from lr_items
ALTER TABLE lr_items DROP CONSTRAINT IF EXISTS lr_items_type_check;
ALTER TABLE lr_items DROP COLUMN IF EXISTS type;

-- Remove CHECK constraints on unit values (will be replaced by lr_units FK later)
ALTER TABLE lr_items DROP CONSTRAINT IF EXISTS chk_lr_items_package_unit;
ALTER TABLE lr_items DROP CONSTRAINT IF EXISTS chk_lr_items_recipe_unit;
