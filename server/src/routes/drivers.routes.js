const { Router } = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { validateBody } = require('../middleware/validate');
const { driverSchema } = require('../validators/drivers.validator');
const driversController = require('../controllers/drivers.controller');

const router = Router();
router.use(authenticate);

// Reads stay open to any authenticated user (drivers must appear in the
// dispatcher's assignment dropdowns). Managing driver compliance — creating,
// editing and removing driver records — is the Safety Officer's remit.
router.get('/', driversController.list);
router.get('/:id', driversController.getOne);
router.post('/', authorize('SAFETY_OFFICER'), validateBody(driverSchema), driversController.create);
router.put('/:id', authorize('SAFETY_OFFICER'), validateBody(driverSchema), driversController.update);
router.delete('/:id', authorize('SAFETY_OFFICER'), driversController.remove);

module.exports = router;
