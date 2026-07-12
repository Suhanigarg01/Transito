const { z } = require('zod');

const driverSchema = z.object({
  name: z.string().min(1).optional(),
  licenseNumber: z.string().min(1).optional(),
  licenseCategory: z.string().optional(),
  licenseExpiry: z.string().optional(),
  phone: z.string().optional(),
  contactNumber: z.string().optional(),
  safetyScore: z.coerce.number().min(0).max(100).optional(),
  status: z.string().optional(),
});

module.exports = { driverSchema };
