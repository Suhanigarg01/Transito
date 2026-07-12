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

// Reads stay open (managers/analysts monitor trips); the whole trip lifecycle —
// create, dispatch, complete, cancel — belongs to the Driver role.
router.get('/', tripsController.list);
router.get('/:id', tripsController.getOne);
router.post('/', authorize('DRIVER'), validateBody(createTripSchema), tripsController.create);
router.post(
  '/:id/dispatch',
  authorize('DRIVER'),
  validateBody(dispatchTripSchema),
  tripsController.dispatch
);
router.post(
  '/:id/complete',
  authorize('DRIVER'),
  validateBody(completeTripSchema),
  tripsController.complete
);
router.post('/:id/cancel', authorize('DRIVER'), tripsController.cancel);

module.exports = router;
