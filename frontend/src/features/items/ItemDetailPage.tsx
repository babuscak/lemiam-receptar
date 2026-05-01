import { useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useItem, usePriceHistory, useAddPurchase, useUnits } from './useItems';
import { TabView, TabPanel } from 'primereact/tabview';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

export default function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { data: item, isLoading } = useItem(id!);
  const toast = useRef<Toast>(null);

  if (isLoading || !item) return <p className="text-gray-500">Loading...</p>;

  return (
    <div>
      <Toast ref={toast} />
      <div className="mb-4">
        <Link to="/items">
          <Button label="Items" icon="pi pi-arrow-left" text size="small" />
        </Link>
      </div>
      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-2xl font-bold">{item.name}</h1>
        <Tag value={item.active ? 'Active' : 'Inactive'} severity={item.active ? 'success' : 'danger'} />
      </div>

      <TabView className="mt-2">
        <TabPanel header="Details">
          <DetailsTab item={item} />
        </TabPanel>
        <TabPanel header="Pricing">
          <PricingTab itemId={item.id} toast={toast} />
        </TabPanel>
      </TabView>
    </div>
  );
}

function DetailsTab({ item }: { item: any }) {
  return (
    <Card className="max-w-2xl">
      <div className="grid grid-cols-2 gap-x-6 gap-y-4">
        <div>
          <p className="text-sm text-gray-500 font-medium">SKU</p>
          <p className="text-base">{item.sku || '-'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Status</p>
          <p className="text-base">{item.active ? 'Active' : 'Inactive'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Package Unit</p>
          <p className="text-base">{item.packageUnit}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Package Qty</p>
          <p className="text-base">{item.packageQuantity ?? '-'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Package Price</p>
          <p className="text-base">{item.packagePriceEur != null ? `${Number(item.packagePriceEur).toFixed(2)} EUR` : '-'}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 font-medium">Recipe Unit</p>
          <p className="text-base">{item.recipeUnit}</p>
        </div>
        <div className="col-span-2">
          <p className="text-sm text-gray-500 font-medium">Price per Recipe Unit</p>
          <p className="text-base font-semibold">{item.pricePerRecipeUnit != null ? `${Number(item.pricePerRecipeUnit).toFixed(4)} EUR/${item.recipeUnit}` : '-'}</p>
        </div>
        <div className="col-span-2">
          <p className="text-sm text-gray-500 font-medium">Last Modified</p>
          <p className="text-base">{new Date(item.updatedAt).toLocaleString()}</p>
        </div>
      </div>
      {item.allergens?.length > 0 && (
        <div className="mt-4">
          <p className="text-sm text-gray-500 font-medium mb-1">Allergens</p>
          <div className="flex flex-wrap gap-1">
            {item.allergens.map((a: string) => (
              <Tag key={a} value={a} severity="danger" />
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

function PricingTab({ itemId, toast }: { itemId: string; toast: React.RefObject<Toast | null> }) {
  const { data: history, isLoading } = usePriceHistory(itemId);
  const { data: units } = useUnits();
  const addPurchase = useAddPurchase();

  const unitOptions = units?.map(u => ({ label: u.abbreviation, value: u.abbreviation })) ?? [];

  const [form, setForm] = useState({ supplier: '', purchaseQuantity: null as number | null, purchaseUnit: 'kg', totalPriceEur: null as number | null });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await addPurchase.mutateAsync({
      itemId,
      supplier: form.supplier || undefined,
      purchaseQuantity: form.purchaseQuantity!,
      purchaseUnit: form.purchaseUnit,
      totalPriceEur: form.totalPriceEur!,
    });
    setForm({ supplier: '', purchaseQuantity: null, purchaseUnit: 'kg', totalPriceEur: null });
    toast.current?.show({ severity: 'success', summary: 'Purchase Added', life: 3000 });
  };

  return (
    <div className="space-y-6">
      <Card title="Add Purchase" className="max-w-lg">
        <form onSubmit={handleAdd} className="space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">Supplier</label>
            <InputText value={form.supplier} onChange={e => setForm({ ...form, supplier: e.target.value })}
              className="w-full" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Quantity</label>
              <InputNumber value={form.purchaseQuantity}
                onValueChange={e => setForm({ ...form, purchaseQuantity: e.value ?? null })}
                minFractionDigits={0} maxFractionDigits={2} className="w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Unit</label>
              <Dropdown value={form.purchaseUnit} onChange={e => setForm({ ...form, purchaseUnit: e.value })}
                options={unitOptions} className="w-full" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Total Price (EUR)</label>
              <InputNumber value={form.totalPriceEur}
                onValueChange={e => setForm({ ...form, totalPriceEur: e.value ?? null })}
                minFractionDigits={0} maxFractionDigits={2} mode="currency" currency="EUR" className="w-full" />
            </div>
          </div>
          <Button type="submit" label={addPurchase.isPending ? 'Adding...' : 'Add Purchase'}
            icon="pi pi-plus" loading={addPurchase.isPending}
            disabled={form.purchaseQuantity == null || form.totalPriceEur == null} />
        </form>
      </Card>

      <Card title="Price History">
        <DataTable value={history ?? []} loading={isLoading} emptyMessage="No purchases yet"
          size="small" stripedRows>
          <Column header="Date" body={(p) => new Date(p.purchasedAt).toLocaleDateString()} />
          <Column field="supplier" header="Supplier" body={(p) => p.supplier || '-'} />
          <Column header="Qty" body={(p) => `${p.purchaseQuantity} ${p.purchaseUnit}`} />
          <Column header="Total EUR" body={(p) => Number(p.totalPriceEur).toFixed(2)} />
          <Column header="Price/Unit" body={(p) => Number(p.pricePerBaseUnit).toFixed(4)} />
        </DataTable>
      </Card>
    </div>
  );
}
