const { Router } = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const reportsController = require('../controllers/reports.controller');

const router = Router();
router.use(authenticate);

// Profitability / ROI analytics are limited to the Financial Analyst.
router.get('/', authorize('FINANCIAL_ANALYST'), reportsController.roi);

module.exports = router;
