const { Router } = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { validateBody } = require('../middleware/validate');
const {
  createTripSchema,
  dispatchTripSchema,
  completeTripSchema,
} = require('../validators/trips.validator');
const tripsController = require('../controllers/trips.controller');

const router = Router();
router.use(authenticate);

router.get('/', tripsController.list);
router.get('/:id', tripsController.getOne);
router.post('/', authorize('FLEET_MANAGER'), validateBody(createTripSchema), tripsController.create);
router.post(
  '/:id/dispatch',
  authorize('FLEET_MANAGER'),
  validateBody(dispatchTripSchema),
  tripsController.dispatch
);
router.post(
  '/:id/complete',
  authorize('FLEET_MANAGER', 'DRIVER'),
  validateBody(completeTripSchema),
  tripsController.complete
);
router.post('/:id/cancel', authorize('FLEET_MANAGER'), tripsController.cancel);

module.exports = router;
