const { asyncHandler } = require('../utils/asyncHandler');
const { presentExpense } = require('../utils/presenters');
const expensesService = require('../services/expenses.service');

const list = asyncHandler(async (req, res) => {
  const expenses = await expensesService.list(req.query);
  res.json(expenses.map(presentExpense));
});

const create = asyncHandler(async (req, res) => {
  const expense = await expensesService.create(req.body);
  res.status(201).json(presentExpense(expense));
});

const update = asyncHandler(async (req, res) => {
  const expense = await expensesService.update(req.params.id, req.body);
  res.json(presentExpense(expense));
});

const remove = asyncHandler(async (req, res) => {
  await expensesService.remove(req.params.id);
  res.status(204).send();
});

module.exports = { list, create, update, remove };
