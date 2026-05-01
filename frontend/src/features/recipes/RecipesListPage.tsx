import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useRecipes, useCreateRecipe, useSubRecipes, type RecipeLineInput } from './useRecipes';
import { useItems } from '../items/useItems';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

export default function RecipesListPage() {
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const { data: recipes, isLoading } = useRecipes(undefined, search || undefined);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-lg font-semibold">Recipes</h1>
        <Button label="New Recipe" icon="pi pi-plus" onClick={() => setShowCreate(true)} />
      </div>

      <div className="flex gap-3 mb-4">
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
        </IconField>
      </div>

      <DataTable value={recipes ?? []} loading={isLoading} emptyMessage="No recipes found"
        stripedRows size="small" sortMode="multiple">
        <Column header="Name" sortable sortField="name" body={(r) => (
          <Link to={`/recipes/${r.id}`} className="text-blue-600 hover:underline">{r.name}</Link>
        )} />
        <Column header="Type" sortable sortField="type" body={(r) => (
          <Tag value={r.type === 'SUB' ? 'Sub Recipe' : 'Final'}
            severity={r.type === 'SUB' ? 'info' : 'warning'} />
        )} />
        <Column field="portions" header="Portions" sortable />
        <Column header="Ingredients" body={(r) => r.lines?.length ?? 0} />
        <Column header="Total Cost" sortable sortField="totalCost" body={(r) =>
          r.totalCost != null ? `${Number(r.totalCost).toFixed(2)} EUR` : '-'
        } />
        <Column header="Price/Portion" sortable sortField="pricePerPortion" body={(r) =>
          r.pricePerPortion != null ? `${Number(r.pricePerPortion).toFixed(2)} EUR` : '-'
        } />
        <Column header="Status" sortable sortField="active" body={(r) => (
          <Tag value={r.active ? 'Active' : 'Inactive'}
            severity={r.active ? 'success' : 'secondary'} />
        )} />
        <Column header="Last Modified" sortable sortField="updatedAt" body={(r) =>
          new Date(r.updatedAt).toLocaleString()
        } />
      </DataTable>

      <CreateRecipeDialog visible={showCreate} onHide={() => setShowCreate(false)} />
    </div>
  );
}

type LineType = 'item' | 'sub-recipe';

interface LineForm {
  lineType: LineType;
  itemId: string;
  subRecipeId: string;
  quantity: string;
}

const typeOptions = [
  { label: 'Final', value: 'FINAL' },
  { label: 'Sub Recipe', value: 'SUB' },
];

function CreateRecipeDialog({ visible, onHide }: { visible: boolean; onHide: () => void }) {
  const createRecipe = useCreateRecipe();
  const { data: items } = useItems(true);
  const { data: subRecipes } = useSubRecipes();
  const [form, setForm] = useState({ name: '', portions: '1', notes: '', type: 'FINAL' as 'FINAL' | 'SUB' });
  const [lines, setLines] = useState<LineForm[]>([{ lineType: 'item', itemId: '', subRecipeId: '', quantity: '' }]);
  const [error, setError] = useState('');

  const itemOptions = (items ?? []).map(i => ({ label: `${i.name} (${i.recipeUnit})`, value: i.id }));
  const subRecipeOptions = (subRecipes ?? []).map(r => ({ label: r.name, value: r.id }));

  const handleSubmit = async (e: React.FormEvent) => {
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
      await createRecipe.mutateAsync({
        name: form.name,
        type: form.type,
        portions: Number(form.portions),
        notes: form.notes || undefined,
        lines: validLines,
      });
      resetAndClose();
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg || 'Failed to create recipe');
    }
  };

  const resetAndClose = () => {
    setForm({ name: '', portions: '1', notes: '', type: 'FINAL' });
    setLines([{ lineType: 'item', itemId: '', subRecipeId: '', quantity: '' }]);
    setError('');
    onHide();
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

  const inputClass = 'w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none';
  const labelClass = 'block text-sm text-gray-600 mb-1';

  const footer = (
    <div className="flex justify-end gap-2">
      <button type="button" onClick={resetAndClose}
        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
        Cancel
      </button>
      <button type="submit" form="create-recipe-form" disabled={!form.name || createRecipe.isPending}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
        {createRecipe.isPending ? 'Creating...' : 'Create'}
      </button>
    </div>
  );

  return (
    <Dialog header="Create Recipe" visible={visible} onHide={resetAndClose}
      footer={footer} style={{ width: '42rem' }} modal>
      <form id="create-recipe-form" onSubmit={handleSubmit} className="flex flex-col gap-5 pt-2">
        {error && (
          <p className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</p>
        )}

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label htmlFor="recipe-name" className={labelClass}>Name *</label>
            <input id="recipe-name" type="text" required value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className={inputClass} autoFocus />
          </div>
          <div>
            <label htmlFor="recipe-type" className={labelClass}>Type *</label>
            <Dropdown id="recipe-type" value={form.type}
              onChange={e => {
                setForm({ ...form, type: e.value });
                if (e.value === 'SUB') {
                  setLines(lines.map(l => ({ ...l, lineType: 'item' as LineType, subRecipeId: '' })));
                }
              }}
              options={typeOptions} className="w-full" />
          </div>
          <div>
            <label htmlFor="recipe-portions" className={labelClass}>Portions *</label>
            <input id="recipe-portions" type="number" min="1" required value={form.portions}
              onChange={e => setForm({ ...form, portions: e.target.value })}
              className={inputClass} />
          </div>
        </div>

        <div>
          <label htmlFor="recipe-notes" className={labelClass}>Notes</label>
          <textarea id="recipe-notes" value={form.notes} rows={2}
            onChange={e => setForm({ ...form, notes: e.target.value })}
            className={inputClass} placeholder="Optional notes..." />
        </div>

        <fieldset className="border-t pt-4">
          <legend className="text-sm text-gray-500 mb-3">Ingredients</legend>
          <div className="space-y-2">
            {lines.map((line, idx) => (
              <div key={idx} className="flex gap-2 items-end">
                {form.type === 'FINAL' && (
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
            className="mt-2 text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
            <i className="pi pi-plus text-xs" /> Add ingredient
          </button>
        </fieldset>
      </form>
    </Dialog>
  );
}
