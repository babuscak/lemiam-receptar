CREATE TABLE lr_recipe_lines (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id         UUID NOT NULL REFERENCES lr_recipes(id) ON DELETE CASCADE,
    component_item_id UUID NOT NULL REFERENCES lr_items(id),
    quantity          NUMERIC(12, 4) NOT NULL CHECK (quantity > 0),
    unit              VARCHAR(20)  NOT NULL,
    waste_percent     NUMERIC(5, 2) NOT NULL DEFAULT 0 CHECK (waste_percent >= 0 AND waste_percent < 100),
    sort_order        INT NOT NULL DEFAULT 0,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_lr_recipe_lines_recipe_id ON lr_recipe_lines (recipe_id);
CREATE INDEX idx_lr_recipe_lines_component_item_id ON lr_recipe_lines (component_item_id);
