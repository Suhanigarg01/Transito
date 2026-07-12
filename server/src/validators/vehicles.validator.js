const { z } = require('zod');

// Accepts either the frontend field names (regNumber, make + model) or the
// canonical ones (registrationNumber, name). The service normalizes them.
const vehicleSchema = z.object({
  regNumber: z.string().min(1).optional(),
  registrationNumber: z.string().min(1).optional(),
  name: z.string().optional(),
  make: z.string().optional(),
  model: z.string().optional(),
  type: z.string().optional(),
  maxLoadCapacity: z.coerce.number().nonnegative().optional(),
  odometer: z.coerce.number().int().nonnegative().optional(),
  acquisitionCost: z.coerce.number().nonnegative().optional(),
  status: z.string().optional(),
});

module.exports = { vehicleSchema };
