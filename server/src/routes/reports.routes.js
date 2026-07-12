const { Router } = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const reportsController = require('../controllers/reports.controller');

const router = Router();
router.use(authenticate);

router.get('/', authorize('FLEET_MANAGER', 'FINANCIAL_ANALYST'), reportsController.roi);

module.exports = router;
