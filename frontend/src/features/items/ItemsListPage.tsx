import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useItems, useCreateItem, useUnits } from './useItems';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Tag } from 'primereact/tag';
import { Dialog } from 'primereact/dialog';
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import { InputText } from 'primereact/inputtext';

export default function ItemsListPage() {
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const { data: items, isLoading } = useItems(undefined, search || undefined);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">Items</h1>
        <Button label="New Item" icon="pi pi-plus" onClick={() => setShowCreate(true)} />
      </div>

      <div className="flex gap-3 mb-4">
        <IconField iconPosition="left">
          <InputIcon className="pi pi-search" />
          <InputText placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
        </IconField>
      </div>

      <DataTable value={items ?? []} loading={isLoading} emptyMessage="No items found"
        stripedRows size="small" sortMode="multiple">
        <Column header="Name" sortable sortField="name" body={(item) => (
          <Link to={`/items/${item.id}`} className="text-blue-600 hover:underline">{item.name}</Link>
        )} />
        <Column field="sku" header="SKU" sortable body={(item) => item.sku || '-'} />
        <Column header="Package" body={(item) => {
          if (item.packageQuantity == null) return '-';
          let s = `${item.packageQuantity} ${item.packageUnit}`;
          if (item.packagePriceEur != null) s += ` / ${Number(item.packagePriceEur).toFixed(2)} EUR`;
          return s;
        }} />
        <Column field="recipeUnit" header="Recipe Unit" sortable />
        <Column header="Price/Recipe Unit" body={(item) =>
          item.pricePerRecipeUnit != null
            ? `${Number(item.pricePerRecipeUnit).toFixed(4)} EUR/${item.recipeUnit}`
            : '-'
        } />
        <Column header="Status" sortable sortField="active" body={(item) => (
          <Tag value={item.active ? 'Active' : 'Inactive'}
            severity={item.active ? 'success' : 'secondary'} />
        )} />
        <Column header="Last Modified" sortable sortField="updatedAt" body={(item) =>
          new Date(item.updatedAt).toLocaleString()
        } />
      </DataTable>

      <CreateItemDialog visible={showCreate} onHide={() => setShowCreate(false)} />
    </div>
  );
}

function CreateItemDialog({ visible, onHide }: { visible: boolean; onHide: () => void }) {
  const createItem = useCreateItem();
  const { data: units } = useUnits();
  const [form, setForm] = useState({
    name: '',
    sku: '',
    packageUnit: 'kg',
    packageQuantity: '',
    packagePriceEur: '',
    recipeUnit: 'g',
    allergens: '',
  });
  const [error, setError] = useState('');

  const selectedPkgFamily = units?.find(u => u.abbreviation === form.packageUnit)?.unitFamily;
  const recipeUnitOptions = units?.filter(u => u.unitFamily === selectedPkgFamily) ?? [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await createItem.mutateAsync({
        name: form.name,
        sku: form.sku || undefined,
        packageUnit: form.packageUnit,
        packageQuantity: form.packageQuantity ? Number(form.packageQuantity) : undefined,
        packagePriceEur: form.packagePriceEur ? Number(form.packagePriceEur) : undefined,
        recipeUnit: form.recipeUnit,
        allergens: form.allergens ? form.allergens.split(',').map(s => s.trim()) : [],
      } as any);
      resetAndClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to create item');
    }
  };

  const resetAndClose = () => {
    setForm({ name: '', sku: '', packageUnit: 'kg', packageQuantity: '', packagePriceEur: '', recipeUnit: 'g', allergens: '' });
    setError('');
    onHide();
  };

  const handlePackageUnitChange = (newUnit: string) => {
    const newFamily = units?.find(u => u.abbreviation === newUnit)?.unitFamily;
    const currentRecipeFamily = units?.find(u => u.abbreviation === form.recipeUnit)?.unitFamily;
    const recipeUnit = newFamily !== currentRecipeFamily
      ? (units?.find(u => u.unitFamily === newFamily)?.abbreviation ?? form.recipeUnit)
      : form.recipeUnit;
    setForm({ ...form, packageUnit: newUnit, recipeUnit });
  };

  const inputClass = 'w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none';
  const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

  const footer = (
    <div className="flex justify-end gap-2">
      <button type="button" onClick={resetAndClose}
        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
        Cancel
      </button>
      <button type="submit" form="create-item-form" disabled={!form.name || createItem.isPending}
        className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
        {createItem.isPending ? 'Creating...' : 'Create'}
      </button>
    </div>
  );

  return (
    <Dialog header="Create Item" visible={visible} onHide={resetAndClose}
      footer={footer} style={{ width: '36rem' }} modal>
      <form id="create-item-form" onSubmit={handleSubmit} className="flex flex-col gap-5 pt-2">
        {error && (
          <p className="rounded-md bg-red-50 border border-red-200 px-3 py-2 text-sm text-red-700">{error}</p>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="item-name" className={labelClass}>Name *</label>
            <input id="item-name" type="text" required value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className={inputClass} autoFocus />
          </div>
          <div>
            <label htmlFor="item-sku" className={labelClass}>SKU</label>
            <input id="item-sku" type="text" value={form.sku}
              onChange={e => setForm({ ...form, sku: e.target.value })}
              className={inputClass} placeholder="Optional" />
          </div>
        </div>

        <fieldset className="border-t pt-4">
          <legend className="text-sm font-semibold text-gray-600 mb-3">Packaging</legend>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label htmlFor="pkg-unit" className={labelClass}>Unit *</label>
              <select id="pkg-unit" value={form.packageUnit}
                onChange={e => handlePackageUnitChange(e.target.value)}
                className={inputClass}>
                {units?.map(u => (
                  <option key={u.abbreviation} value={u.abbreviation}>{u.abbreviation}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="pkg-qty" className={labelClass}>Quantity</label>
              <input id="pkg-qty" type="number" step="any" min="0" value={form.packageQuantity}
                onChange={e => setForm({ ...form, packageQuantity: e.target.value })}
                className={inputClass} />
            </div>
            <div>
              <label htmlFor="pkg-price" className={labelClass}>Price (EUR)</label>
              <input id="pkg-price" type="number" step="0.01" min="0" value={form.packagePriceEur}
                onChange={e => setForm({ ...form, packagePriceEur: e.target.value })}
                className={inputClass} />
            </div>
          </div>
        </fieldset>

        <fieldset className="border-t pt-4">
          <legend className="text-sm font-semibold text-gray-600 mb-3">Recipe</legend>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="recipe-unit" className={labelClass}>Recipe Unit *</label>
              <select id="recipe-unit" value={form.recipeUnit}
                onChange={e => setForm({ ...form, recipeUnit: e.target.value })}
                className={inputClass}>
                {recipeUnitOptions.map(u => (
                  <option key={u.abbreviation} value={u.abbreviation}>{u.abbreviation}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="allergens" className={labelClass}>Allergens</label>
              <input id="allergens" type="text" value={form.allergens}
                onChange={e => setForm({ ...form, allergens: e.target.value })}
                className={inputClass} placeholder="gluten, dairy" />
            </div>
          </div>
        </fieldset>
      </form>
    </Dialog>
  );
}
