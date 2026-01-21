import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productFamilyService, ProductFamily } from '@/services/product-families.service';
import { ingredientService } from '@/services/ingredients.service';
import api from '@/lib/axios';

// --- Units ---
export const useUnits = () => {
    return useQuery({
        queryKey: ['units'],
        queryFn: async () => {
            const { data } = await api.get<{ data: { id: string; name: string; abbreviation: string }[] }>('/units');
            return data.data;
        }
    });
};

// --- Families ---

export const useProductFamilies = () => {
    return useQuery({
        queryKey: ['product-families'],
        queryFn: productFamilyService.getAll,
    });
};

export const useCreateFamily = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: productFamilyService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['product-families'] });
        },
    });
};

// --- Ingredients ---

export const useIngredients = (filters?: { familyId?: string; lowStock?: boolean }) => {
    return useQuery({
        queryKey: ['ingredients', filters],
        queryFn: () => ingredientService.getAll(filters),
    });
};

export const useCreateIngredient = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ingredientService.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['ingredients'] });
        },
    });
};
