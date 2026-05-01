-- V016: Create recipes and recipe_lines tables

CREATE TABLE lr_recipes (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(255) NOT NULL,
    portions    INT          NOT NULL CHECK (portions > 0),
    notes       TEXT,
    is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_lr_recipes_is_active ON lr_recipes (is_active);

CREATE TABLE lr_recipe_lines (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id   UUID         NOT NULL REFERENCES lr_recipes(id) ON DELETE CASCADE,
    item_id     UUID         NOT NULL REFERENCES lr_items(id),
    quantity    NUMERIC(12, 4) NOT NULL CHECK (quantity > 0),
    sort_order  INT          NOT NULL DEFAULT 0,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX idx_lr_recipe_lines_recipe_id ON lr_recipe_lines (recipe_id);
CREATE INDEX idx_lr_recipe_lines_item_id ON lr_recipe_lines (item_id);
