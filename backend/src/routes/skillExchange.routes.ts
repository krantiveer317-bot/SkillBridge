import { Router } from 'express';
import { skillExchangeController } from '../controllers/skillExchange.controller';
import { authenticate } from '../middleware/authenticate';
import { validate } from '../middleware/validate';
import { skillExchangeSchema } from '../validators/common.validator';
import { idParamSchema, paginationSchema } from '../validators/common.validator';

const router = Router();

router.get('/', validate(paginationSchema, 'query'), skillExchangeController.findAll.bind(skillExchangeController));
router.get('/my', authenticate, validate(paginationSchema, 'query'), skillExchangeController.findMine.bind(skillExchangeController));
router.post('/', authenticate, validate(skillExchangeSchema), skillExchangeController.create.bind(skillExchangeController));
router.post('/:id/accept', authenticate, validate(idParamSchema, 'params'), skillExchangeController.accept.bind(skillExchangeController));
router.post('/:id/complete', authenticate, validate(idParamSchema, 'params'), skillExchangeController.complete.bind(skillExchangeController));
router.delete('/:id', authenticate, validate(idParamSchema, 'params'), skillExchangeController.cancel.bind(skillExchangeController));

export default router;
