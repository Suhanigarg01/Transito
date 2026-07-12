const { prisma } = require('../prisma');
const { ApiError } = require('../utils/ApiError');
const { toDriverStatus } = require('../utils/enums');

function buildData(body, isCreate) {
  const data = {};
  if (body.name !== undefined) data.name = body.name;
  if (body.licenseNumber !== undefined) data.licenseNumber = body.licenseNumber;
  if (body.licenseCategory !== undefined) data.licenseCategory = body.licenseCategory;
  if (body.licenseExpiry !== undefined) {
    const d = new Date(body.licenseExpiry);
    if (Number.isNaN(d.getTime())) throw ApiError.badRequest('Invalid licenseExpiry date');
    data.licenseExpiry = d;
  }
  const contact = body.contactNumber !== undefined ? body.contactNumber : body.phone;
  if (contact !== undefined) data.contactNumber = contact;
  if (body.safetyScore !== undefined) data.safetyScore = body.safetyScore;
  if (body.status !== undefined) {
    const s = toDriverStatus(body.status);
    if (!s) throw ApiError.badRequest(`Invalid driver status: ${body.status}`);
    data.status = s;
  }

  if (isCreate) {
    if (!data.name) throw ApiError.badRequest('name is required');
    if (!data.licenseNumber) throw ApiError.badRequest('licenseNumber is required');
    if (!data.licenseExpiry) throw ApiError.badRequest('licenseExpiry is required');
  }
  return data;
}

function list({ status, search } = {}) {
  const where = {};
  const s = toDriverStatus(status);
  if (s) where.status = s;
  if (search) {
    where.OR = [
      { name: { contains: String(search), mode: 'insensitive' } },
      { licenseNumber: { contains: String(search), mode: 'insensitive' } },
    ];
  }
  return prisma.driver.findMany({ where, orderBy: { createdAt: 'desc' } });
}

async function getById(id) {
  const driver = await prisma.driver.findUnique({ where: { id } });
  if (!driver) throw ApiError.notFound('Driver not found');
  return driver;
}

function create(body) {
  return prisma.driver.create({ data: buildData(body, true) });
}

function update(id, body) {
  return prisma.driver.update({ where: { id }, data: buildData(body, false) });
}

function remove(id) {
  return prisma.driver.delete({ where: { id } });
}

module.exports = { list, getById, create, update, remove };
