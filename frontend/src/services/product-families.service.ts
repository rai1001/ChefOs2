import api from '@/lib/axios';

export interface ProductFamily {
    id: string;
    name: string;
    description?: string;
    safety_buffer_pct: number;
}

export const productFamilyService = {
    getAll: async () => {
        const { data } = await api.get<{ data: ProductFamily[] }>('/product-families');
        return data.data;
    },

    create: async (payload: { name: string; description?: string; safetyBufferPct?: number }) => {
        const { data } = await api.post<{ data: ProductFamily }>('/product-families', payload);
        return data.data;
    },

    update: async (id: string, payload: Partial<{ name: string; description?: string; safetyBufferPct?: number }>) => {
        const { data } = await api.patch<{ data: ProductFamily }>(`/product-families/${id}`, payload);
        return data.data;
    },

    delete: async (id: string) => {
        await api.delete(`/product-families/${id}`);
    }
};
