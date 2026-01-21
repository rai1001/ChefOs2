import { Router } from 'express';
import { productFamilyController } from '@/controllers/product-family.controller';
import { authMiddleware } from '@/middleware/auth.middleware';

const router = Router();

router.use(authMiddleware); // Protect all routes

router.get('/', productFamilyController.getAll);
router.post('/', productFamilyController.create);
router.get('/:id', productFamilyController.getById);
router.patch('/:id', productFamilyController.update);
router.delete('/:id', productFamilyController.delete);

export default router;
