const { Router } = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { validateBody } = require('../middleware/validate');
const { expenseSchema } = require('../validators/expenses.validator');
const expensesController = require('../controllers/expenses.controller');

const router = Router();
router.use(authenticate);

router.get('/', expensesController.list);
router.post('/', authorize('FLEET_MANAGER', 'FINANCIAL_ANALYST'), validateBody(expenseSchema), expensesController.create);
router.put('/:id', authorize('FLEET_MANAGER', 'FINANCIAL_ANALYST'), validateBody(expenseSchema), expensesController.update);
router.delete('/:id', authorize('FLEET_MANAGER', 'FINANCIAL_ANALYST'), expensesController.remove);

module.exports = router;
