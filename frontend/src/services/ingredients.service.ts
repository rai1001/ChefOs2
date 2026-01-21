import api from '@/lib/axios';

export interface Ingredient {
    id: string;
    name: string;
    stock_current: number;
    stock_min: number;
    unit: { abbreviation: string };
    family?: { name: string };
    cost_price: number;
}

export const ingredientService = {
    getAll: async (filters?: { familyId?: string; lowStock?: boolean }) => {
        const params = new URLSearchParams();
        if (filters?.familyId) params.append('familyId', filters.familyId);
        if (filters?.lowStock) params.append('lowStock', 'true');

        const { data } = await api.get<{ data: Ingredient[] }>(`/ingredients?${params.toString()}`);
        return data.data;
    },

    create: async (payload: any) => {
        const { data } = await api.post('/ingredients', payload);
        return data.data;
    },

    // ... update/delete methods as needed
};
