import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { productFamilyService } from '@/services/product-family.service';
import { AppError } from '@/middleware/error.middleware';

const createSchema = z.object({
    name: z.string().min(2),
    description: z.string().optional(),
    safetyBufferPct: z.number().min(1.0).max(2.0).optional().default(1.10),
});

const updateSchema = z.object({
    name: z.string().min(2).optional(),
    description: z.string().optional(),
    safetyBufferPct: z.number().min(1.0).max(2.0).optional(),
});

export const productFamilyController = {
    getAll: async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user || !req.user.organizationIds.length) throw new AppError(403, 'No organization context');
            const orgId = req.user.organizationIds[0]; // MVP: Use first org
            const result = await productFamilyService.getAll(orgId);
            res.json({ status: 'success', data: result });
        } catch (error) { next(error); }
    },

    getById: async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user || !req.user.organizationIds.length) throw new AppError(403, 'No organization context');
            const orgId = req.user.organizationIds[0];
            const result = await productFamilyService.getById(req.params.id, orgId);
            res.json({ status: 'success', data: result });
        } catch (error) { next(error); }
    },

    create: async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user || !req.user.organizationIds.length) throw new AppError(403, 'No organization context');
            const orgId = req.user.organizationIds[0];
            const data = createSchema.parse(req.body);

            const result = await productFamilyService.create({ ...data, organizationId: orgId });
            res.status(201).json({ status: 'success', data: result });
        } catch (error) { next(error); }
    },

    update: async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user || !req.user.organizationIds.length) throw new AppError(403, 'No organization context');
            const orgId = req.user.organizationIds[0];
            const data = updateSchema.parse(req.body);

            const result = await productFamilyService.update(orgId, { ...data, id: req.params.id });
            res.json({ status: 'success', data: result });
        } catch (error) { next(error); }
    },

    delete: async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.user || !req.user.organizationIds.length) throw new AppError(403, 'No organization context');
            const orgId = req.user.organizationIds[0];

            const result = await productFamilyService.delete(req.params.id, orgId);
            res.json({ status: 'success', data: result });
        } catch (error) { next(error); }
    }
};
