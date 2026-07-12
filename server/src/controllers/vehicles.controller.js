const { asyncHandler } = require('../utils/asyncHandler');
const { presentVehicle } = require('../utils/presenters');
const vehiclesService = require('../services/vehicles.service');

const list = asyncHandler(async (req, res) => {
  const vehicles = await vehiclesService.list(req.query);
  res.json(vehicles.map(presentVehicle));
});

const getOne = asyncHandler(async (req, res) => {
  const vehicle = await vehiclesService.getById(req.params.id);
  res.json(presentVehicle(vehicle));
});

const create = asyncHandler(async (req, res) => {
  const vehicle = await vehiclesService.create(req.body);
  res.status(201).json(presentVehicle(vehicle));
});

const update = asyncHandler(async (req, res) => {
  const vehicle = await vehiclesService.update(req.params.id, req.body);
  res.json(presentVehicle(vehicle));
});

const remove = asyncHandler(async (req, res) => {
  await vehiclesService.remove(req.params.id);
  res.status(204).send();
});

module.exports = { list, getOne, create, update, remove };
