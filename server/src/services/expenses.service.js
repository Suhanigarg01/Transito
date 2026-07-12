const { prisma } = require('../prisma');
const { ApiError } = require('../utils/ApiError');
const { toExpenseType } = require('../utils/enums');

function buildData(body, isCreate) {
  const data = {};
  if (body.vehicleId !== undefined) data.vehicleId = body.vehicleId;

  const typeRaw = body.type !== undefined ? body.type : body.category;
  if (typeRaw !== undefined) {
    const t = toExpenseType(typeRaw);
    if (!t) throw ApiError.badRequest(`Invalid expense type: ${typeRaw}`);
    data.type = t;
  }
  if (body.amount !== undefined) data.amount = body.amount;

  const liters = body.liters !== undefined ? body.liters : body.litres;
  if (liters !== undefined) data.liters = liters;
  if (body.odometer !== undefined) data.odometer = body.odometer;
  if (body.date !== undefined) data.date = new Date(body.date);
  if (body.notes !== undefined) data.notes = body.notes;

  if (isCreate) {
    if (!data.vehicleId) throw ApiError.badRequest('vehicleId is required');
    if (data.amount === undefined) throw ApiError.badRequest('amount is required');
  }
  return data;
}

function list({ vehicleId, type, from, to } = {}) {
  const where = {};
  if (vehicleId) where.vehicleId = String(vehicleId);
  const t = toExpenseType(type);
  if (t) where.type = t;
  if (from || to) {
    where.date = {};
    if (from) where.date.gte = new Date(String(from));
    if (to) where.date.lte = new Date(String(to));
  }
  return prisma.expense.findMany({ where, include: { vehicle: true }, orderBy: { date: 'desc' } });
}

function create(body) {
  return prisma.expense.create({ data: buildData(body, true), include: { vehicle: true } });
}

function update(id, body) {
  return prisma.expense.update({ where: { id }, data: buildData(body, false), include: { vehicle: true } });
}

function remove(id) {
  return prisma.expense.delete({ where: { id } });
}

module.exports = { list, create, update, remove };
