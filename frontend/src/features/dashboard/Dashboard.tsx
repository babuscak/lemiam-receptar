import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import type { Item } from '../../api/types';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

export default function Dashboard() {
  const { data: items } = useQuery<Item[]>({
    queryKey: ['items'],
    queryFn: async () => (await api.get('/items')).data,
  });

  const activeCount = items?.filter(i => i.active).length ?? 0;
  const totalCount = items?.length ?? 0;

  const recentItems = [...(items ?? [])]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 mb-8 max-w-md">
        <Card className="bg-green-50">
          <p className="text-xs font-medium text-green-700 opacity-70">Active Items</p>
          <p className="text-2xl font-bold text-green-700 mt-1">{activeCount}</p>
        </Card>
        <Card className="bg-gray-50">
          <p className="text-xs font-medium text-gray-700 opacity-70">Total Items</p>
          <p className="text-2xl font-bold text-gray-700 mt-1">{totalCount}</p>
        </Card>
      </div>

      <Card title="Recently Updated Items">
        <DataTable value={recentItems} emptyMessage="No items yet" size="small" stripedRows>
          <Column header="Name" body={(item) => (
            <Link to={`/items/${item.id}`} className="text-blue-600 hover:underline">{item.name}</Link>
          )} />
          <Column field="packageUnit" header="Pkg Unit" />
          <Column field="recipeUnit" header="Recipe Unit" />
          <Column header="Price/Unit" body={(item) =>
            item.pricePerRecipeUnit != null
              ? `${Number(item.pricePerRecipeUnit).toFixed(4)} EUR/${item.recipeUnit}`
              : '-'
          } />
          <Column header="Updated" body={(item) => new Date(item.updatedAt).toLocaleString()} />
        </DataTable>
      </Card>
    </div>
  );
}
