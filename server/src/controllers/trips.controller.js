const { asyncHandler } = require('../utils/asyncHandler');
const { presentTrip } = require('../utils/presenters');
const tripsService = require('../services/trips.service');

const list = asyncHandler(async (req, res) => {
  const trips = await tripsService.list(req.query);
  res.json(trips.map(presentTrip));
});

const getOne = asyncHandler(async (req, res) => {
  const trip = await tripsService.getById(req.params.id);
  res.json(presentTrip(trip));
});

const create = asyncHandler(async (req, res) => {
  const trip = await tripsService.create(req.body);
  res.status(201).json(presentTrip(trip));
});

const dispatch = asyncHandler(async (req, res) => {
  const trip = await tripsService.dispatch(req.params.id, req.body);
  res.json(presentTrip(trip));
});

const complete = asyncHandler(async (req, res) => {
  const trip = await tripsService.complete(req.params.id, req.body);
  res.json(presentTrip(trip));
});

const cancel = asyncHandler(async (req, res) => {
  const trip = await tripsService.cancel(req.params.id);
  res.json(presentTrip(trip));
});

module.exports = { list, getOne, create, dispatch, complete, cancel };
