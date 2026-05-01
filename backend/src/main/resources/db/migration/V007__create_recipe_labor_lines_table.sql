CREATE TABLE lr_recipe_labor_lines (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipe_id         UUID NOT NULL REFERENCES lr_recipes(id) ON DELETE CASCADE,
    qualification_id  UUID NOT NULL REFERENCES lr_qualifications(id),
    minutes           NUMERIC(8, 2) NOT NULL CHECK (minutes > 0),
    sort_order        INT NOT NULL DEFAULT 0,
    created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_lr_recipe_labor_lines_recipe_id ON lr_recipe_labor_lines (recipe_id);
CREATE INDEX idx_lr_recipe_labor_lines_qualification_id ON lr_recipe_labor_lines (qualification_id);
