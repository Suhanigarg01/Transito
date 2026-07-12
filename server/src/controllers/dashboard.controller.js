const { asyncHandler } = require('../utils/asyncHandler');
const dashboardService = require('../services/dashboard.service');

const summary = asyncHandler(async (_req, res) => {
  res.json(await dashboardService.getSummary());
});

module.exports = { summary };
