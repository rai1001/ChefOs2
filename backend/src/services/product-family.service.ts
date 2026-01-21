import { supabase } from '@/config/supabase';
import { AppError } from '@/middleware/error.middleware';

export interface CreateFamilyDTO {
    organizationId: string;
    name: string;
    description?: string;
    safetyBufferPct?: number;
}

export interface UpdateFamilyDTO {
    id: string;
    name?: string;
    description?: string;
    safetyBufferPct?: number;
}

export class ProductFamilyService {
    async getAll(organizationId: string) {
        const { data, error } = await supabase
            .from('product_families')
            .select('*')
            .eq('organization_id', organizationId)
            .order('name');

        if (error) throw new AppError(500, error.message);
        return data;
    }

    async getById(id: string, organizationId: string) {
        const { data, error } = await supabase
            .from('product_families')
            .select('*')
            .eq('id', id)
            .eq('organization_id', organizationId)
            .single();

        if (error) throw new AppError(404, 'Family not found');
        return data;
    }

    async create(data: CreateFamilyDTO) {
        // Validate uniqueness in DB or trust DB constraint?
        // DB has UNIQUE(organization_id, name). We trust DB to throw error, or check first.

        // Validate safety buffer logic in Service or Controller? Controller has valid schema, logic here is fine too.
        if (data.safetyBufferPct && data.safetyBufferPct < 1.0) {
            throw new AppError(400, 'Safety Buffer must be >= 1.0');
        }

        const { data: family, error } = await supabase
            .from('product_families')
            .insert({
                organization_id: data.organizationId,
                name: data.name,
                description: data.description,
                safety_buffer_pct: data.safetyBufferPct ?? 1.10
            })
            .select()
            .single();

        if (error) {
            if (error.code === '23505') throw new AppError(409, 'Family with this name already exists');
            throw new AppError(500, error.message);
        }

        return family;
    }

    async update(organizationId: string, data: UpdateFamilyDTO) {
        if (data.safetyBufferPct && data.safetyBufferPct < 1.0) {
            throw new AppError(400, 'Safety Buffer must be >= 1.0');
        }

        const { data: family, error } = await supabase
            .from('product_families')
            .update({
                name: data.name,
                description: data.description,
                safety_buffer_pct: data.safetyBufferPct,
                updated_at: new Date().toISOString()
            })
            .eq('id', data.id)
            .eq('organization_id', organizationId)
            .select()
            .single();

        if (error) throw new AppError(500, error.message);
        return family;
    }

    async delete(id: string, organizationId: string) {
        const { error } = await supabase
            .from('product_families')
            .delete()
            .eq('id', id)
            .eq('organization_id', organizationId);

        if (error) throw new AppError(500, error.message);
        return { message: 'Family deleted successfully' };
    }
}

export const productFamilyService = new ProductFamilyService();
