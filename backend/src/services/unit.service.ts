import { supabase } from '@/config/supabase';
import { AppError } from '@/middleware/error.middleware';

export class UnitService {
    async getAll() {
        const { data, error } = await supabase
            .from('units')
            .select('*')
            .order('name');

        if (error) throw new AppError(500, error.message);
        return data;
    }
}

export const unitService = new UnitService();
