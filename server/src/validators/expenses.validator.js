const { z } = require('zod');

const expenseSchema = z.object({
  vehicleId: z.string().min(1).optional(),
  category: z.string().optional(),
  type: z.string().optional(),
  amount: z.coerce.number().nonnegative().optional(),
  litres: z.coerce.number().nonnegative().nullable().optional(),
  liters: z.coerce.number().nonnegative().nullable().optional(),
  odometer: z.coerce.number().int().nonnegative().nullable().optional(),
  date: z.string().optional(),
  notes: z.string().optional(),
});

module.exports = { expenseSchema };
