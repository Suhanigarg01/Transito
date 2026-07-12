const { asyncHandler } = require('../utils/asyncHandler');
const reportsService = require('../services/reports.service');

const roi = asyncHandler(async (req, res) => {
  const rows = await reportsService.getRoiRows(req.query);
  res.json({ type: String(req.query.type || 'roi'), rows });
});

module.exports = { roi };
