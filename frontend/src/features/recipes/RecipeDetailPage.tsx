import { useState, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useRecipe, useUpdateRecipe, useDeleteRecipe, useSubRecipes, type RecipeLineInput } from './useRecipes';
import { useItems } from '../items/useItems';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: recipe, isLoading } = useRecipe(id!);
  const toast = useRef<Toast>(null);

  if (isLoading || !recipe) return <p className="text-gray-500">Loading...</p>;

  return (
    <div>
      <Toast ref={toast} />
      <div className="mb-4">
        <Link to="/recipes">
          <Button label="Recipes" icon="pi pi-arrow-left" text size="small" />
        </Link>
      </div>
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold">{recipe.name}</h1>
        <Tag value={recipe.type === 'SUB' ? 'Sub Recipe' : 'Final'} severity={recipe.type === 'SUB' ? 'info' : 'warning'} />
        <Tag value={recipe.active ? 'Active' : 'Inactive'} severity={recipe.active ? 'success' : 'danger'} />
      </div>

      <div className="space-y-6">
        <SummaryCard recipe={recipe} toast={toast} />
        <IngredientsCard recipe={recipe} toast={toast} />
      </div>
    </div>
  );
}

function SummaryCard({ recipe, toast }: { recipe: NonNullable<ReturnType<typeof useRecipe>['data']>; toast: React.RefObject<Toast | null> }) {
  const navigate = useNavigate();
  const updateRecipe = useUpdateRecipe();
  const deleteRecipe = useDeleteRecipe();

  const handleDelete = async () => {
    await deleteRecipe.mutateAsync(recipe.id);
    toast.current?.show({ severity: 'info', summary: 'Recipe archived', life: 2000 });
    navigate('/recipes');
  };

  return (
    <Card>
      <div className="flex justify-between items-start">
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 max-w-lg">
          <div>
            <p className="text-sm text-gray-500 font-medium">Portions</p>
            <p className="text-base font-semibold">{recipe.portions}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Cost</p>
            <p className="text-base font-semibold">
              {recipe.totalCost != null ? `${Number(recipe.totalCost).toFixed(2)} EUR` : '-'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Price per Portion</p>
            <p className="text-base font-semibold text-blue-700">
              {recipe.pricePerPortion != null ? `${Number(recipe.pricePerPortion).toFixed(2)} EUR` : '-'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Ingredients</p>
            <p className="text-base">{recipe.lines.length}</p>
          </div>
          {recipe.notes && (
            <div className="col-span-2">
              <p className="text-sm text-gray-500 font-medium">Notes</p>
              <p className="text-base whitespace-pre-wrap">{recipe.notes}</p>
            </div>
          )}
          <div className="col-span-2">
            <p className="text-sm text-gray-500 font-medium">Last Modified</p>
            <p className="text-base">{new Date(recipe.updatedAt).toLocaleString()}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {recipe.active && (
            <Button label="Archive" icon="pi pi-trash" severity="danger" outlined size="small"
              loading={deleteRecipe.isPending || updateRecipe.isPending}
              onClick={handleDelete} />
          )}
        </div>
      </div>
    </Card>
  );
}

type LineType = 'item' | 'sub-recipe';

interface LineForm {
  lineType: LineType;
  itemId: string;
  subRecipeId: string;
  quantity: string;
}

function IngredientsCard({ recipe, toast }: { recipe: NonNullable<ReturnType<typeof useRecipe>['data']>; toast: React.RefObject<Toast | null> }) {
  const [showEdit, setShowEdit] = useState(false);
  const updateRecipe = useUpdateRecipe();
  const { data: items } = useItems(true);
  const { data: subRecipes } = useSubRecipes();

  const itemOptions = (items ?? []).map(i => ({ label: `${i.name} (${i.recipeUnit})`, value: i.id }));
  const subRecipeOptions = (subRecipes ?? []).map(r => ({ label: r.name, value: r.id }));

  const [lines, setLines] = useState<LineForm[]>([]);
  const [error, setError] = useState('');

  const openEdit = () => {
    setLines(recipe.lines.map(l => ({
      lineType: (l.subRecipeId ? 'sub-recipe' : 'item') as LineType,
      itemId: l.itemId ?? '',
      subRecipeId: l.subRecipeId ?? '',
      quantity: String(l.quantity),
    })));
    setError('');
    setShowEdit(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const validLines: RecipeLineInput[] = lines
      .filter(l => (l.lineType === 'item' ? l.itemId : l.subRecipeId) && l.quantity)
      .map((l, idx) => ({
        ...(l.lineType === 'item' ? { itemId: l.itemId } : { subRecipeId: l.subRecipeId }),
        quantity: Number(l.quantity),
        sortOrder: idx,
      }));
    if (validLines.length === 0) {
      setError('At least one ingredient line is required');
      return;
    }
    try {
      await updateRecipe.mutateAsync({ id: recipe.id, lines: validLines });
      setShowEdit(false);
      toast.current?.show({ severity: 'success', summary: 'Ingredients updated', life: 2000 });
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Failed to update ingredients');
    }
  };

  const updateLine = (index: number, field: keyof LineForm, value: string) => {
    const updated = [...lines];
    updated[index] = { ...updated[index], [field]: value };
    setLines(updated);
  };

  const addLine = () => setLines([...lines, { lineType: 'item', itemId: '', subRecipeId: '', quantity: '' }]);
  const removeLine = (index: number) => {
    if (lines.length > 1) setLines(lines.filter((_, i) => i !== index));
  };

  const lineTypeOptions = [
    { label: 'Item', value: 'item' },
    { label: 'Sub-recipe', value: 'sub-recipe' },
  ];

  const inputClass = 'w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  return (
    <>
      <Card title={
        <div className="flex items-center justify-between">
          <span>Ingredients</span>
          {recipe.active && (
            <Button label="Edit" icon="pi pi-pencil" text size="small" onClick={openEdit} />
          )}
        </div>
      }>
        <DataTable value={recipe.lines} emptyMessage="No ingredients" size="small" stripedRows>
          <Column header="Item" body={(l) => l.itemName ?? l.subRecipeName ?? '-'} />
          <Column header="Type" body={(l) => (
            <Tag value={l.subRecipeId ? 'Sub-recipe' : 'Item'} severity={l.subRecipeId ? 'info' : undefined} />
          )} />
          <Column header="Quantity" body={(l) => `${l.quantity} ${l.unit}`} />
          <Column header="Price/Unit" body={(l) =>
            l.pricePerUnit != null ? `${Number(l.pricePerUnit).toFixed(4)} EUR/${l.unit}` : '-'
          } />
          <Column header="Line Cost" body={(l) =>
            l.lineCost != null ? `${Number(l.lineCost).toFixed(2)} EUR` : '-'
          } />
        </DataTable>
      </Card>

      <Dialog header="Edit Ingredients" visible={showEdit} onHide={() => setShowEdit(false)}
        style={{ width: '42rem' }} modal
        footer={
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowEdit(false)}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
              Cancel
            </button>
            <button type="submit" form="edit-lines-form" disabled={updateRecipe.isPending}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
              {updateRecipe.isPending ? 'Saving...' : 'Save'}
            </button>
          </div>
        }>
        <form id="edit-lines-form" onSubmit={handleSave} className="flex flex-col gap-4 pt-2">
          {error && (
            <p className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</p>
          )}
          <div className="space-y-2">
            {lines.map((line, idx) => (
              <div key={idx} className="flex gap-2 items-end">
                {recipe.type === 'FINAL' && (
                  <div className="w-32">
                    {idx === 0 && <label className={labelClass}>Type</label>}
                    <Dropdown value={line.lineType}
                      onChange={e => updateLine(idx, 'lineType', e.value)}
                      options={lineTypeOptions} className="w-full" />
                  </div>
                )}
                <div className="flex-1">
                  {idx === 0 && <label className={labelClass}>{line.lineType === 'item' ? 'Item' : 'Sub-recipe'} *</label>}
                  {line.lineType === 'item' ? (
                    <Dropdown value={line.itemId}
                      onChange={e => updateLine(idx, 'itemId', e.value)}
                      options={itemOptions} placeholder="Select item..."
                      filter className="w-full" />
                  ) : (
                    <Dropdown value={line.subRecipeId}
                      onChange={e => updateLine(idx, 'subRecipeId', e.value)}
                      options={subRecipeOptions} placeholder="Select sub-recipe..."
                      filter className="w-full" />
                  )}
                </div>
                <div className="w-28">
                  {idx === 0 && <label className={labelClass}>Qty *</label>}
                  <input type="number" step="any" min="0.0001" value={line.quantity}
                    onChange={e => updateLine(idx, 'quantity', e.target.value)}
                    className={inputClass} placeholder="0" />
                </div>
                <button type="button" onClick={() => removeLine(idx)}
                  className="p-2 text-red-500 hover:text-red-700 disabled:opacity-30"
                  disabled={lines.length <= 1}>
                  <i className="pi pi-trash" />
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={addLine}
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
            <i className="pi pi-plus text-xs" /> Add ingredient
          </button>
        </form>
      </Dialog>
    </>
  );
}
