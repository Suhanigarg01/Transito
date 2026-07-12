const { Router } = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { validateBody } = require('../middleware/validate');
const { expenseSchema } = require('../validators/expenses.validator');
const expensesController = require('../controllers/expenses.controller');

const router = Router();
router.use(authenticate);

// Expenses / fuel logs are the Financial Analyst's domain end to end.
router.get('/', authorize('FINANCIAL_ANALYST'), expensesController.list);
router.post('/', authorize('FINANCIAL_ANALYST'), validateBody(expenseSchema), expensesController.create);
router.put('/:id', authorize('FINANCIAL_ANALYST'), validateBody(expenseSchema), expensesController.update);
router.delete('/:id', authorize('FINANCIAL_ANALYST'), expensesController.remove);

module.exports = router;
