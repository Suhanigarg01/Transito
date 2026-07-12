const { Router } = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { validateBody } = require('../middleware/validate');
const { vehicleSchema } = require('../validators/vehicles.validator');
const vehiclesController = require('../controllers/vehicles.controller');

const router = Router();
router.use(authenticate);

router.get('/', vehiclesController.list);
router.get('/:id', vehiclesController.getOne);
router.post('/', authorize('FLEET_MANAGER'), validateBody(vehicleSchema), vehiclesController.create);
router.put('/:id', authorize('FLEET_MANAGER'), validateBody(vehicleSchema), vehiclesController.update);
router.delete('/:id', authorize('FLEET_MANAGER'), vehiclesController.remove);

module.exports = router;
