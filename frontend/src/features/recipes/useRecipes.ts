import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../api/client';
import type { Recipe } from '../../api/types';

export function useRecipes(active?: boolean, search?: string) {
  return useQuery<Recipe[]>({
    queryKey: ['recipes', active, search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (active !== undefined) params.set('active', String(active));
      if (search) params.set('search', search);
      const { data } = await api.get(`/recipes?${params}`);
      return data;
    },
  });
}

export function useRecipe(id: string) {
  return useQuery<Recipe>({
    queryKey: ['recipes', id],
    queryFn: async () => (await api.get(`/recipes/${id}`)).data,
    enabled: !!id,
  });
}

export interface RecipeLineInput {
  itemId?: string;
  subRecipeId?: string;
  quantity: number;
  sortOrder?: number;
}

export interface CreateRecipeInput {
  name: string;
  type: 'FINAL' | 'SUB';
  portions: number;
  notes?: string;
  lines: RecipeLineInput[];
}

export interface UpdateRecipeInput {
  name?: string;
  type?: 'FINAL' | 'SUB';
  portions?: number;
  notes?: string;
  lines?: RecipeLineInput[];
  active?: boolean;
}

export function useCreateRecipe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (recipe: CreateRecipeInput) =>
      (await api.post('/recipes', recipe)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['recipes'] }),
  });
}

export function useUpdateRecipe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: { id: string } & UpdateRecipeInput) =>
      (await api.patch(`/recipes/${id}`, data)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['recipes'] }),
  });
}

export function useDeleteRecipe() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => api.delete(`/recipes/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['recipes'] }),
  });
}

export function useSubRecipes() {
  return useQuery<Recipe[]>({
    queryKey: ['recipes', 'sub-recipes'],
    queryFn: async () => (await api.get('/recipes/sub-recipes')).data,
  });
}
