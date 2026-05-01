import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/client';
import type { Item, Purchase, UnitResponse } from '../../api/types';

export function useItems(active?: boolean, search?: string) {
  return useQuery<Item[]>({
    queryKey: ['items', active, search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (active !== undefined) params.set('active', String(active));
      if (search) params.set('search', search);
      const { data } = await api.get(`/items?${params}`);
      return data;
    },
  });
}

export function useItem(id: string) {
  return useQuery<Item>({
    queryKey: ['items', id],
    queryFn: async () => (await api.get(`/items/${id}`)).data,
    enabled: !!id,
  });
}

export function useCreateItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (item: Partial<Item>) => (await api.post('/items', item)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['items'] }),
  });
}

export function useUpdateItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & Partial<Item>) =>
      (await api.patch(`/items/${id}`, data)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['items'] }),
  });
}

export function useDeleteItem() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => api.delete(`/items/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['items'] }),
  });
}

export function usePriceHistory(itemId: string) {
  return useQuery<Purchase[]>({
    queryKey: ['price-history', itemId],
    queryFn: async () => (await api.get(`/raw-materials/${itemId}/price-history`)).data,
    enabled: !!itemId,
  });
}

export function useAddPurchase() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ itemId, ...data }: { itemId: string; supplier?: string; purchaseQuantity: number; purchaseUnit: string; totalPriceEur: number }) =>
      (await api.post(`/raw-materials/${itemId}/price`, data)).data,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['price-history'] });
      qc.invalidateQueries({ queryKey: ['items'] });
    },
  });
}

export function useUnits() {
  return useQuery<UnitResponse[]>({
    queryKey: ['units'],
    queryFn: async () => (await api.get('/units')).data,
  });
}
