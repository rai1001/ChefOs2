import { Router, Request, Response, NextFunction } from 'express';
import { unitService } from '@/services/unit.service';

const router = Router();

router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const result = await unitService.getAll();
        res.json({ status: 'success', data: result });
    } catch (error) { next(error); }
});

export default router;
