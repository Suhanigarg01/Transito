const { prisma } = require('../prisma');

// Returns per-vehicle rows the frontend Report page derives ROI/efficiency from:
// { vehicle, revenue, fuelCost, maintenanceCost, otherCost, distanceKm, fuelLitres }
async function getRoiRows({ vehicleId, from, to } = {}) {
  const dateFilter = {};
  if (from) dateFilter.gte = new Date(String(from));
  if (to) dateFilter.lte = new Date(String(to));
  const hasDate = Object.keys(dateFilter).length > 0;

  const vehicles = await prisma.vehicle.findMany({
    where: vehicleId ? { id: String(vehicleId) } : undefined,
    orderBy: { registrationNumber: 'asc' },
  });

  return Promise.all(
    vehicles.map(async (v) => {
      const [expenses, maintenance, completedTrips] = await Promise.all([
        prisma.expense.findMany({
          where: { vehicleId: v.id, ...(hasDate ? { date: dateFilter } : {}) },
        }),
        prisma.maintenanceLog.aggregate({
          _sum: { cost: true },
          where: { vehicleId: v.id, ...(hasDate ? { serviceDate: dateFilter } : {}) },
        }),
        prisma.trip.findMany({
          where: { vehicleId: v.id, status: 'COMPLETED', ...(hasDate ? { completedAt: dateFilter } : {}) },
        }),
      ]);

      let fuelCost = 0;
      let otherCost = 0;
      let fuelLitres = 0;
      for (const e of expenses) {
        if (e.type === 'FUEL') {
          fuelCost += e.amount;
          fuelLitres += e.liters || 0;
        } else {
          otherCost += e.amount;
        }
      }

      const revenue = completedTrips.reduce((s, t) => s + t.revenue, 0);
      const distanceKm = completedTrips.reduce(
        (s, t) => s + (t.actualDistance != null ? t.actualDistance : t.plannedDistance || 0),
        0
      );

      return {
        vehicleId: v.id,
        vehicle: v.registrationNumber,
        revenue,
        fuelCost,
        maintenanceCost: maintenance._sum.cost || 0,
        otherCost,
        distanceKm,
        fuelLitres,
      };
    })
  );
}

module.exports = { getRoiRows };
