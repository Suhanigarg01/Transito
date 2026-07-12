const { asyncHandler } = require('../utils/asyncHandler');
const { presentDriver } = require('../utils/presenters');
const driversService = require('../services/drivers.service');

const list = asyncHandler(async (req, res) => {
  const drivers = await driversService.list(req.query);
  res.json(drivers.map(presentDriver));
});

const getOne = asyncHandler(async (req, res) => {
  const driver = await driversService.getById(req.params.id);
  res.json(presentDriver(driver));
});

const create = asyncHandler(async (req, res) => {
  const driver = await driversService.create(req.body);
  res.status(201).json(presentDriver(driver));
});

const update = asyncHandler(async (req, res) => {
  const driver = await driversService.update(req.params.id, req.body);
  res.json(presentDriver(driver));
});

const remove = asyncHandler(async (req, res) => {
  await driversService.remove(req.params.id);
  res.status(204).send();
});

module.exports = { list, getOne, create, update, remove };
