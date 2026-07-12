const { asyncHandler } = require('../utils/asyncHandler');
const { presentMaintenance } = require('../utils/presenters');
const maintenanceService = require('../services/maintenance.service');

const list = asyncHandler(async (req, res) => {
  const records = await maintenanceService.list(req.query);
  res.json(records.map(presentMaintenance));
});

const create = asyncHandler(async (req, res) => {
  const record = await maintenanceService.create(req.body);
  res.status(201).json(presentMaintenance(record));
});

const update = asyncHandler(async (req, res) => {
  const record = await maintenanceService.update(req.params.id, req.body);
  res.json(presentMaintenance(record));
});

const close = asyncHandler(async (req, res) => {
  const record = await maintenanceService.close(req.params.id);
  res.json(presentMaintenance(record));
});

const remove = asyncHandler(async (req, res) => {
  await maintenanceService.remove(req.params.id);
  res.status(204).send();
});

module.exports = { list, create, update, close, remove };
