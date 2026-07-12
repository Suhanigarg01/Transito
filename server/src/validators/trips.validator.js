const { z } = require('zod');

const createTripSchema = z.object({
  origin: z.string().min(1).optional(),
  source: z.string().min(1).optional(),
  destination: z.string().min(1),
  vehicleId: z.string().optional().nullable(),
  driverId: z.string().optional().nullable(),
  cargoWeight: z.coerce.number().nonnegative().optional(),
  plannedDistance: z.coerce.number().nonnegative().optional(),
  distanceKm: z.coerce.number().nonnegative().optional(),
  revenue: z.coerce.number().nonnegative().optional(),
  scheduledDate: z.string().optional().nullable(),
});

const dispatchTripSchema = z.object({
  vehicleId: z.string().min(1),
  driverId: z.string().min(1),
});

const completeTripSchema = z.object({
  endOdometer: z.coerce.number().int().nonnegative().optional(),
  notes: z.string().optional(),
});

module.exports = { createTripSchema, dispatchTripSchema, completeTripSchema };
