const { Router } = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { validateBody } = require('../middleware/validate');
const { driverSchema } = require('../validators/drivers.validator');
const driversController = require('../controllers/drivers.controller');

const router = Router();
router.use(authenticate);

router.get('/', driversController.list);
router.get('/:id', driversController.getOne);
router.post('/', authorize('FLEET_MANAGER', 'SAFETY_OFFICER'), validateBody(driverSchema), driversController.create);
router.put('/:id', authorize('FLEET_MANAGER', 'SAFETY_OFFICER'), validateBody(driverSchema), driversController.update);
router.delete('/:id', authorize('FLEET_MANAGER'), driversController.remove);

module.exports = router;
