const { prisma } = require('../prisma');
const { ApiError } = require('../utils/ApiError');
const { toVehicleStatus, toVehicleType } = require('../utils/enums');

// Maps a validated request body to Prisma data, normalizing enum labels and
// merging make/model into `name`.
function buildData(body, isCreate) {
  const data = {};
  const reg = body.registrationNumber !== undefined ? body.registrationNumber : body.regNumber;
  if (reg !== undefined) data.registrationNumber = reg;

  const name = body.name || [body.make, body.model].filter(Boolean).join(' ').trim();
  if (name) data.name = name;

  if (body.type !== undefined) {
    const t = toVehicleType(body.type);
    if (!t) throw ApiError.badRequest(`Invalid vehicle type: ${body.type}`);
    data.type = t;
  }
  if (body.maxLoadCapacity !== undefined) data.maxLoadCapacity = body.maxLoadCapacity;
  if (body.odometer !== undefined) data.odometer = body.odometer;
  if (body.acquisitionCost !== undefined) data.acquisitionCost = body.acquisitionCost;
  if (body.status !== undefined) {
    const s = toVehicleStatus(body.status);
    if (!s) throw ApiError.badRequest(`Invalid vehicle status: ${body.status}`);
    data.status = s;
  }

  if (isCreate && !data.registrationNumber) {
    throw ApiError.badRequest('registrationNumber (regNumber) is required');
  }
  if (isCreate && !data.name) throw ApiError.badRequest('name (make/model) is required');
  return data;
}

function list({ status, type, search } = {}) {
  const where = {};
  const s = toVehicleStatus(status);
  const t = toVehicleType(type);
  if (s) where.status = s;
  if (t) where.type = t;
  if (search) {
    where.OR = [
      { registrationNumber: { contains: String(search), mode: 'insensitive' } },
      { name: { contains: String(search), mode: 'insensitive' } },
    ];
  }
  return prisma.vehicle.findMany({ where, orderBy: { createdAt: 'desc' } });
}

async function getById(id) {
  const vehicle = await prisma.vehicle.findUnique({ where: { id } });
  if (!vehicle) throw ApiError.notFound('Vehicle not found');
  return vehicle;
}

function create(body) {
  return prisma.vehicle.create({ data: buildData(body, true) });
}

function update(id, body) {
  return prisma.vehicle.update({ where: { id }, data: buildData(body, false) });
}

function remove(id) {
  return prisma.vehicle.delete({ where: { id } });
}

module.exports = { list, getById, create, update, remove };
