const { Router } = require('express');
const authRoutes = require('./auth.routes');
const usersRoutes = require('./users.routes');
const vehiclesRoutes = require('./vehicles.routes');
const driversRoutes = require('./drivers.routes');
const tripsRoutes = require('./trips.routes');
const maintenanceRoutes = require('./maintenance.routes');
const expensesRoutes = require('./expenses.routes');
const dashboardRoutes = require('./dashboard.routes');
const reportsRoutes = require('./reports.routes');

const router = Router();

router.get('/health', (_req, res) => res.json({ status: 'ok', service: 'transitops-api' }));

router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
router.use('/vehicles', vehiclesRoutes);
router.use('/drivers', driversRoutes);
router.use('/trips', tripsRoutes);
router.use('/maintenance', maintenanceRoutes);
router.use('/expenses', expensesRoutes);
router.use('/dashboard', dashboardRoutes);
router.use('/reports', reportsRoutes);

module.exports = router;
