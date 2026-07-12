const { asyncHandler } = require('../utils/asyncHandler');
const { presentUser } = require('../utils/presenters');
const authService = require('../services/auth.service');

const register = asyncHandler(async (req, res) => {
  const { token, user } = await authService.register(req.body);
  res.status(201).json({ token, user: presentUser(user) });
});

const login = asyncHandler(async (req, res) => {
  const { token, user } = await authService.login(req.body);
  res.json({ token, user: presentUser(user) });
});

const me = asyncHandler(async (req, res) => {
  const user = await authService.getById(req.user.sub);
  res.json({ user: presentUser(user) });
});

module.exports = { register, login, me };
