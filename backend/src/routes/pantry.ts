import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { getPantry, addPantryItem, deletePantryItem, matchRecipes } from '../controllers/pantry';

const router = Router();

router.get('/match', requireAuth, matchRecipes);
router.get('/', requireAuth, getPantry);
router.post('/', requireAuth, addPantryItem);
router.delete('/:id', requireAuth, deletePantryItem);

export default router;