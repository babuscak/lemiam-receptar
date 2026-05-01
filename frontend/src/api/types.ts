export interface Item {
  id: string;
  name: string;
  sku: string | null;
  packageUnit: string;
  packageQuantity: number | null;
  packagePriceEur: number | null;
  recipeUnit: string;
  pricePerRecipeUnit: number | null;
  allergens: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Qualification {
  id: string;
  name: string;
  hourlyRateEur: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Purchase {
  id: string;
  itemId: string;
  supplier: string | null;
  purchaseQuantity: number;
  purchaseUnit: string;
  totalPriceEur: number;
  pricePerBaseUnit: number;
  purchasedAt: string;
}

export interface UnitResponse {
  id: string;
  name: string;
  abbreviation: string;
  unitFamily: string;
  conversionToBase: number;
}

export interface RecipeLine {
  id: string;
  itemId: string | null;
  itemName: string | null;
  subRecipeId: string | null;
  subRecipeName: string | null;
  unit: string;
  quantity: number;
  pricePerUnit: number | null;
  lineCost: number | null;
  sortOrder: number;
  createdAt: string;
}

export interface Recipe {
  id: string;
  name: string;
  type: 'FINAL' | 'SUB';
  portions: number;
  pricePerPortion: number | null;
  totalCost: number | null;
  notes: string | null;
  lines: RecipeLine[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
