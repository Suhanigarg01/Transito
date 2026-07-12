const { z } = require('zod');

const createUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(4),
  role: z.string(),
});

const updateUserSchema = z.object({
  name: z.string().min(1).optional(),
  role: z.string().optional(),
  active: z.boolean().optional(),
  password: z.string().min(4).optional(),
});

module.exports = { createUserSchema, updateUserSchema };
