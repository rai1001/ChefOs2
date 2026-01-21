import { supabase } from '@/config/supabase';
import { AppError } from '@/middleware/error.middleware';

export interface CreateIngredientDTO {
    organizationId: string;
    name: string;
    description?: string;
    familyId?: string;
    supplierId?: string;
    unitId: string;
    costPrice?: number;
    stockCurrent?: number;
    stockMin?: number;
    barcode?: string;
}

export interface UpdateIngredientDTO {
    id: string;
    name?: string;
    description?: string;
    familyId?: string;
    supplierId?: string;
    unitId?: string;
    costPrice?: number;
    stockCurrent?: number;
    stockMin?: number;
    barcode?: string;
}

export class IngredientService {
    async getAll(organizationId: string, filters?: { familyId?: string; lowStock?: boolean }) {
        let query = supabase
            .from('ingredients')
            .select('*, family:product_families(name), unit:units(abbreviation)')
            .eq('organization_id', organizationId)
            .order('name');

        if (filters?.familyId) {
            query = query.eq('family_id', filters.familyId);
        }

        // "Low Stock" filter usually handled in DB logic, but Supabase generic filter limitation?
        // We can filter in memory or use logic. 
        // Logic: stock_current <= stock_min
        // Supabase PostgREST doesn't support col comparison easy without RPC.
        // For MVP, if lowStock is true, we might fetch all and filter in JS, or use a specific RPC?
        // Let's implement checkLowStock as separate method or JS filter for now.

        // Efficiency Note: For large datasets, use RPC. For MVP, JS filter is OK.

        const { data, error } = await query;
        if (error) throw new AppError(500, error.message);

        if (filters?.lowStock) {
            return data.filter((item: any) => item.stock_current <= item.stock_min);
        }

        return data;
    }

    async getById(id: string, organizationId: string) {
        const { data, error } = await supabase
            .from('ingredients')
            .select('*, family:product_families(*), supplier:suppliers(*), unit:units(*)')
            .eq('id', id)
            .eq('organization_id', organizationId)
            .single();

        if (error) throw new AppError(404, 'Ingredient not found');
        return data;
    }

    async create(data: CreateIngredientDTO) {
        const { data: ingredient, error } = await supabase
            .from('ingredients')
            .insert({
                organization_id: data.organizationId,
                name: data.name,
                description: data.description,
                family_id: data.familyId,
                supplier_id: data.supplierId,
                unit_id: data.unitId,
                cost_price: data.costPrice ?? 0,
                stock_current: data.stockCurrent ?? 0,
                stock_min: data.stockMin ?? 0,
                barcode: data.barcode
            })
            .select()
            .single();

        if (error) {
            if (error.code === '23505') throw new AppError(409, 'Ingredient already exists (Name or Barcode)');
            throw new AppError(500, error.message);
        }
        return ingredient;
    }

    async update(organizationId: string, data: UpdateIngredientDTO) {
        const { data: ingredient, error } = await supabase
            .from('ingredients')
            .update({
                name: data.name,
                description: data.description,
                family_id: data.familyId,
                supplier_id: data.supplierId,
                unit_id: data.unitId,
                cost_price: data.costPrice,
                stock_current: data.stockCurrent,
                stock_min: data.stockMin,
                barcode: data.barcode,
                updated_at: new Date().toISOString()
            })
            .eq('id', data.id)
            .eq('organization_id', organizationId)
            .select()
            .single();

        if (error) throw new AppError(500, error.message);
        return ingredient;
    }

    async delete(id: string, organizationId: string) {
        // Soft delete usually? Schema says deleted_at is nullable.
        // Let's implement Soft Delete.
        const { error } = await supabase
            .from('ingredients')
            .update({ deleted_at: new Date().toISOString() })
            .eq('id', id)
            .eq('organization_id', organizationId);

        // Or Hard Delete? Schema migrations typically allow hard delete unless "deleted_at" implies soft.
        // My schema has deleted_at column. So Soft Delete.

        if (error) throw new AppError(500, error.message);
        return { message: 'Ingredient deleted successfully' };
    }

    async getLowStock(organizationId: string) {
        // Specialized method for dashboard/alerts
        // To do this efficiently in one query without RPC: 
        // Supabase-js doesn't natively support "where col1 <= col2". 
        // We will create a small RPC for this later if perf is issue.
        // For now, reuse getAll filtering.
        return this.getAll(organizationId, { lowStock: true });
    }
}

export const ingredientService = new IngredientService();
