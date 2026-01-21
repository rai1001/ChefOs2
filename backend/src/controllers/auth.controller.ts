import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { authService } from '@/services/auth.service';

const registerSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    fullName: z.string().min(2),
    organizationName: z.string().min(2),
});

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1),
});

export const authController = {
    register: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = registerSchema.parse(req.body);
            const result = await authService.register(data);
            res.status(201).json({
                status: 'success',
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    login: async (req: Request, res: Response, next: NextFunction) => {
        try {
            const data = loginSchema.parse(req.body);
            const result = await authService.login(data);
            res.status(200).json({
                status: 'success',
                data: result
            });
        } catch (error) {
            next(error);
        }
    },

    me: async (req: Request, res: Response, next: NextFunction) => {
        // Protected route test
        res.json({
            status: 'success',
            data: {
                user: req.user
            }
        });
    }
};
