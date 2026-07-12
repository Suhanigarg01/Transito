const { prisma } = require('../prisma');
const { ApiError } = require('../utils/ApiError');
const { toMaintenanceStatus, toMaintenanceType } = require('../utils/enums');

function buildData(body, isCreate) {
  const data = {};
  if (body.vehicleId !== undefined) data.vehicleId = body.vehicleId;
  if (body.type !== undefined) {
    const t = toMaintenanceType(body.type);
    if (!t) throw ApiError.badRequest(`Invalid maintenance type: ${body.type}`);
    data.type = t;
  }
  if (body.description !== undefined) data.description = body.description;
  if (body.cost !== undefined) data.cost = body.cost;
  if (body.serviceDate !== undefined) data.serviceDate = new Date(body.serviceDate);
  if (body.status !== undefined) {
    const s = toMaintenanceStatus(body.status);
    if (!s) throw ApiError.badRequest(`Invalid maintenance status: ${body.status}`);
    data.status = s;
  }
  if (isCreate && !data.vehicleId) throw ApiError.badRequest('vehicleId is required');
  return data;
}

// Applies the "open record => vehicle IN_SHOP" cascade. Never disturbs a
// vehicle that's ON_TRIP or RETIRED.
async function syncVehicleShopStatus(vehicleId) {
  const openCount = await prisma.maintenanceLog.count({ where: { vehicleId, status: 'OPEN' } });
  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
  if (!vehicle || vehicle.status === 'ON_TRIP' || vehicle.status === 'RETIRED') return;

  const target = openCount > 0 ? 'IN_SHOP' : 'AVAILABLE';
  if (vehicle.status !== target) {
    await prisma.vehicle.update({ where: { id: vehicleId }, data: { status: target } });
  }
}

function list({ status, vehicleId } = {}) {
  const where = {};
  const s = toMaintenanceStatus(status);
  if (s) where.status = s;
  if (vehicleId) where.vehicleId = String(vehicleId);
  return prisma.maintenanceLog.findMany({
    where,
    include: { vehicle: true },
    orderBy: { serviceDate: 'desc' },
  });
}

async function create(body) {
  const record = await prisma.maintenanceLog.create({
    data: buildData(body, true),
    include: { vehicle: true },
  });
  await syncVehicleShopStatus(record.vehicleId);
  return prisma.maintenanceLog.findUnique({ where: { id: record.id }, include: { vehicle: true } });
}

async function update(id, body) {
  const record = await prisma.maintenanceLog.update({
    where: { id },
    data: buildData(body, false),
    include: { vehicle: true },
  });
  await syncVehicleShopStatus(record.vehicleId);
  return record;
}

// Closes the record; frees the vehicle if no other open records remain.
async function close(id) {
  const record = await prisma.maintenanceLog.update({
    where: { id },
    data: { status: 'CLOSED' },
    include: { vehicle: true },
  });
  await syncVehicleShopStatus(record.vehicleId);
  return prisma.maintenanceLog.findUnique({ where: { id: record.id }, include: { vehicle: true } });
}

async function remove(id) {
  const record = await prisma.maintenanceLog.delete({ where: { id } });
  await syncVehicleShopStatus(record.vehicleId);
}

module.exports = { list, create, update, close, remove };
