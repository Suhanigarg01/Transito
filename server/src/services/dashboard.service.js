const { prisma } = require('../prisma');
const { TRIP_STATUS_LABELS, VEHICLE_STATUS_LABELS } = require('../utils/enums');

// Builds the summary payload the frontend Dashboard consumes:
// { vehicles: {Available, "On Trip", "In Shop"}, trips: {active, pending},
//   recentTrips: [{ id, reference, route, vehicle, status }] }
async function getSummary() {
  const [vehicleGroups, activeTrips, pendingTrips, recent] = await Promise.all([
    prisma.vehicle.groupBy({ by: ['status'], _count: { _all: true } }),
    prisma.trip.count({ where: { status: 'DISPATCHED' } }),
    prisma.trip.count({ where: { status: 'DRAFT' } }),
    prisma.trip.findMany({ take: 5, orderBy: { updatedAt: 'desc' }, include: { vehicle: true } }),
  ]);

  const vehicles = { Available: 0, 'On Trip': 0, 'In Shop': 0 };
  for (const g of vehicleGroups) {
    vehicles[VEHICLE_STATUS_LABELS[g.status]] = g._count._all;
  }

  return {
    vehicles,
    trips: { active: activeTrips, pending: pendingTrips },
    recentTrips: recent.map((t) => ({
      id: t.id,
      reference: t.reference,
      route: `${t.source} → ${t.destination}`,
      vehicle: t.vehicle ? t.vehicle.registrationNumber : '—',
      status: TRIP_STATUS_LABELS[t.status],
    })),
  };
}

module.exports = { getSummary };
