const { z } = require('zod');

const maintenanceSchema = z.object({
  vehicleId: z.string().min(1).optional(),
  type: z.string().optional(),
  description: z.string().optional(),
  cost: z.coerce.number().nonnegative().optional(),
  serviceDate: z.string().optional(),
  status: z.string().optional(),
});

module.exports = { maintenanceSchema };
