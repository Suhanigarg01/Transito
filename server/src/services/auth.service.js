const bcrypt = require('bcryptjs');
const { prisma } = require('../prisma');
const { ApiError } = require('../utils/ApiError');
const { signToken } = require('../utils/jwt');
const { toRole } = require('../utils/enums');

async function register({ name, email, password, role }) {
  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: {
      name,
      email: email.toLowerCase(),
      password: hash,
      role: toRole(role) || 'FLEET_MANAGER',
    },
  });
  return { token: issueToken(user), user };
}

async function login({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user || !user.active) throw ApiError.unauthorized('Invalid email or password');

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw ApiError.unauthorized('Invalid email or password');

  return { token: issueToken(user), user };
}

async function getById(id) {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw ApiError.notFound('User not found');
  return user;
}

function issueToken(user) {
  return signToken({ sub: user.id, email: user.email, role: user.role });
}

module.exports = { register, login, getById };
