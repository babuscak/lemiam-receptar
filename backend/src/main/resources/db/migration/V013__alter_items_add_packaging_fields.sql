-- Add packaging and recipe unit fields, remove density
ALTER TABLE lr_items
    ADD COLUMN package_unit       VARCHAR(20),
    ADD COLUMN package_quantity   NUMERIC(12, 4),
    ADD COLUMN package_price_eur  NUMERIC(12, 4),
    ADD COLUMN recipe_unit        VARCHAR(20);

-- Drop density column
ALTER TABLE lr_items DROP COLUMN IF EXISTS density_g_per_ml;

-- Rename base_unit to recipe_unit (migrate existing data)
UPDATE lr_items SET recipe_unit = base_unit WHERE recipe_unit IS NULL;
UPDATE lr_items SET package_unit = base_unit WHERE package_unit IS NULL;
UPDATE lr_items SET package_quantity = 1 WHERE package_quantity IS NULL;

-- Now make recipe_unit and package_unit NOT NULL
ALTER TABLE lr_items
    ALTER COLUMN recipe_unit SET NOT NULL,
    ALTER COLUMN package_unit SET NOT NULL;

-- Drop old base_unit column
ALTER TABLE lr_items DROP COLUMN IF EXISTS base_unit;

-- Add check constraints
ALTER TABLE lr_items ADD CONSTRAINT chk_lr_items_package_unit
    CHECK (package_unit IN ('kg', 'g', 'l', 'ml', 'pcs'));
ALTER TABLE lr_items ADD CONSTRAINT chk_lr_items_recipe_unit
    CHECK (recipe_unit IN ('kg', 'g', 'l', 'ml', 'pcs'));
ALTER TABLE lr_items ADD CONSTRAINT chk_lr_items_package_quantity_positive
    CHECK (package_quantity IS NULL OR package_quantity > 0);
ALTER TABLE lr_items ADD CONSTRAINT chk_lr_items_package_price_positive
    CHECK (package_price_eur IS NULL OR package_price_eur >= 0);
