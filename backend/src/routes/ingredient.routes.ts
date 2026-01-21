import { Router } from 'express';
import { ingredientController } from '@/controllers/ingredient.controller';
import { authMiddleware } from '@/middleware/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', ingredientController.getAll);
router.post('/', ingredientController.create);
router.get('/:id', ingredientController.getById);
router.patch('/:id', ingredientController.update);
router.delete('/:id', ingredientController.delete);

export default router;
