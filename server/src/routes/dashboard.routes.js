const { Router } = require('express');
const { authenticate } = require('../middleware/auth');
const dashboardController = require('../controllers/dashboard.controller');

const router = Router();
router.use(authenticate);

router.get('/summary', dashboardController.summary);

module.exports = router;
