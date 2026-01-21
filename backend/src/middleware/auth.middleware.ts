import { Request, Response, NextFunction } from 'express';
import { supabase } from '@/config/supabase';
import { AppError } from './error.middleware';
import '@/types/auth.types'; // Ensure types are loaded

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            throw new AppError(401, 'No token provided');
        }

        const token = authHeader.split(' ')[1];

        // Verify token with Supabase
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            throw new AppError(401, 'Invalid or expired token');
        }

        // Fetch user context (Role & Org)
        // For MVP, we fetch the first organization role.
        // In future, we might require an 'x-organization-id' header context.
        const { data: memberData } = await supabase
            .from('organization_members')
            .select('organization_id, role')
            .eq('user_id', user.id);

        const organizationIds = memberData?.map(m => m.organization_id) || [];
        const role = memberData?.[0]?.role; // Simplified for MVP

        req.user = {
            id: user.id,
            email: user.email!,
            organizationIds,
            role
        };

        next();
    } catch (error) {
        next(error);
    }
};
