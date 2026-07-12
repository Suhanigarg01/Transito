const { asyncHandler } = require('../utils/asyncHandler');
const { presentUser } = require('../utils/presenters');
const usersService = require('../services/users.service');

const list = asyncHandler(async (_req, res) => {
  const users = await usersService.list();
  res.json(users.map(presentUser));
});

const create = asyncHandler(async (req, res) => {
  const user = await usersService.create(req.body);
  res.status(201).json(presentUser(user));
});

const update = asyncHandler(async (req, res) => {
  const user = await usersService.update(req.params.id, req.body);
  res.json(presentUser(user));
});

const remove = asyncHandler(async (req, res) => {
  await usersService.remove(req.params.id);
  res.status(204).send();
});

module.exports = { list, create, update, remove };
