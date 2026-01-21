import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { ingredientService } from '@/services/ingredient.service';
import { AppError } from '@/middleware/error.middleware';

const createSchema = z.object({
    name: z.string().min(2),
    description: z.string().optional(),
    familyId: z.string().uuid().optional(),
    supplierId: z.string().uuid().optional(),
    unitId: z.string().uuid(),
    costPrice: z.number().min(0).optional(),
    stockCurrent: z.number().min(0).optional(),
    stockMin: z.number().min(0).optional(),
    barcode: z.string().optional(),
});

const updateSchema = createSchema.partial();

export const ingredientController = {
    getAll: async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user || !req.user.organizationIds.length) throw new AppError(403, 'No organization context');
            const orgId = req.user.organizationIds[0];
            const { familyId, lowStock } = req.query;

            const result = await ingredientService.getAll(orgId, {
                familyId: familyId as string,
                lowStock: lowStock === 'true'
            });
            res.json({ status: 'success', data: result });
        } catch (error) { next(error); }
    },

    getById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user || !req.user.organizationIds.length) throw new AppError(403, 'No organization context');
            const orgId = req.user.organizationIds[0];
            const result = await ingredientService.getById(req.params.id, orgId);
            res.json({ status: 'success', data: result });
        } catch (error) { next(error); }
    },

    create: async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user || !req.user.organizationIds.length) throw new AppError(403, 'No organization context');
            const orgId = req.user.organizationIds[0];
            const data = createSchema.parse(req.body);

            const result = await ingredientService.create({ ...data, organizationId: orgId });
            res.status(201).json({ status: 'success', data: result });
        } catch (error) { next(error); }
    },

    update: async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user || !req.user.organizationIds.length) throw new AppError(403, 'No organization context');
            const orgId = req.user.organizationIds[0];
            const data = updateSchema.parse(req.body);

            const result = await ingredientService.update(orgId, { ...data, id: req.params.id });
            res.json({ status: 'success', data: result });
        } catch (error) { next(error); }
    },

    delete: async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user || !req.user.organizationIds.length) throw new AppError(403, 'No organization context');
            const orgId = req.user.organizationIds[0];
            const result = await ingredientService.delete(req.params.id, orgId);
            res.json({ status: 'success', data: result });
        } catch (error) { next(error); }
    }
};
