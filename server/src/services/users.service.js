const bcrypt = require('bcryptjs');
const { prisma } = require('../prisma');
const { ApiError } = require('../utils/ApiError');
const { toRole } = require('../utils/enums');

function list() {
  return prisma.user.findMany({ orderBy: { createdAt: 'desc' } });
}

async function create(body) {
  const role = toRole(body.role);
  if (!role) throw ApiError.badRequest('Invalid role');

  const hash = await bcrypt.hash(body.password, 10);
  return prisma.user.create({
    data: { name: body.name, email: body.email.toLowerCase(), password: hash, role },
  });
}

async function update(id, body) {
  const data = {};
  if (body.name !== undefined) data.name = body.name;
  if (body.active !== undefined) data.active = body.active;
  if (body.role !== undefined) {
    const role = toRole(body.role);
    if (!role) throw ApiError.badRequest('Invalid role');
    data.role = role;
  }
  if (body.password !== undefined) data.password = await bcrypt.hash(body.password, 10);

  return prisma.user.update({ where: { id }, data });
}

function remove(id) {
  return prisma.user.delete({ where: { id } });
}

module.exports = { list, create, update, remove };
