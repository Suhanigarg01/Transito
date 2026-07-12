const { Router } = require('express');
const { authenticate, authorize } = require('../middleware/auth');
const { validateBody } = require('../middleware/validate');
const { createUserSchema, updateUserSchema } = require('../validators/users.validator');
const usersController = require('../controllers/users.controller');

const router = Router();

// Account administration is limited to fleet managers.
router.use(authenticate, authorize('FLEET_MANAGER'));

router.get('/', usersController.list);
router.post('/', validateBody(createUserSchema), usersController.create);
router.put('/:id', validateBody(updateUserSchema), usersController.update);
router.delete('/:id', usersController.remove);

module.exports = router;
