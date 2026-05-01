-- Add recipe type (FINAL or SUB) to lr_recipes
ALTER TABLE lr_recipes
    ADD COLUMN type VARCHAR(10) NOT NULL DEFAULT 'FINAL';

ALTER TABLE lr_recipes
    ADD CONSTRAINT chk_recipe_type CHECK (type IN ('FINAL', 'SUB'));

-- Make item_id nullable (sub-recipe lines won't have one)
ALTER TABLE lr_recipe_lines
    ALTER COLUMN item_id DROP NOT NULL;

-- Add sub_recipe_id column
ALTER TABLE lr_recipe_lines
    ADD COLUMN sub_recipe_id UUID REFERENCES lr_recipes(id);

-- Exactly one of item_id / sub_recipe_id must be non-null
ALTER TABLE lr_recipe_lines
    ADD CONSTRAINT chk_line_reference
        CHECK (
            (item_id IS NOT NULL AND sub_recipe_id IS NULL) OR
            (item_id IS NULL AND sub_recipe_id IS NOT NULL)
        );

-- Index for FK lookups on sub_recipe_id
CREATE INDEX idx_recipe_lines_sub_recipe_id ON lr_recipe_lines(sub_recipe_id);
