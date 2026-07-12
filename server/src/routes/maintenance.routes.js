const { Router } = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { validateBody } = require('../middleware/validate');
const { maintenanceSchema } = require('../validators/maintenance.validator');
const maintenanceController = require('../controllers/maintenance.controller');

const router = Router();
router.use(authenticate);

// Fleet Manager owns maintenance; Financial Analyst may read to review costs.
router.get('/', authorize('FLEET_MANAGER', 'FINANCIAL_ANALYST'), maintenanceController.list);
router.post('/', authorize('FLEET_MANAGER'), validateBody(maintenanceSchema), maintenanceController.create);
router.put('/:id', authorize('FLEET_MANAGER'), validateBody(maintenanceSchema), maintenanceController.update);
router.post('/:id/close', authorize('FLEET_MANAGER'), maintenanceController.close);
router.delete('/:id', authorize('FLEET_MANAGER'), maintenanceController.remove);

module.exports = router;
