const { prisma } = require('../prisma');
const { ApiError } = require('../utils/ApiError');
const { toTripStatus } = require('../utils/enums');

const withRels = { vehicle: true, driver: true };

// Generate the next TRP-#### reference within a transaction.
async function nextReference(tx) {
  const last = await tx.trip.findFirst({
    where: { reference: { startsWith: 'TRP-' } },
    orderBy: { reference: 'desc' },
    select: { reference: true },
  });
  const n = last ? parseInt(last.reference.replace('TRP-', ''), 10) || 1041 : 1041;
  return `TRP-${n + 1}`;
}

function list({ status } = {}) {
  const where = {};
  const s = toTripStatus(status);
  if (s) where.status = s;
  return prisma.trip.findMany({ where, include: withRels, orderBy: { createdAt: 'desc' } });
}

async function getById(id) {
  const trip = await prisma.trip.findUnique({ where: { id }, include: withRels });
  if (!trip) throw ApiError.notFound('Trip not found');
  return trip;
}

// Creates a Draft trip; the server assigns the reference.
function create(body) {
  const source = body.source || body.origin;
  if (!source) throw ApiError.badRequest('origin/source is required');

  const cargoWeight = body.cargoWeight || 0;

  return prisma.$transaction(async (tx) => {
    // If a vehicle is assigned up front, the cargo must fit its capacity.
    if (body.vehicleId) {
      const vehicle = await tx.vehicle.findUnique({ where: { id: body.vehicleId } });
      if (!vehicle) throw ApiError.badRequest('Vehicle not found');
      if (cargoWeight > vehicle.maxLoadCapacity) {
        throw ApiError.badRequest(
          `Cargo weight (${cargoWeight} kg) exceeds ${vehicle.registrationNumber}'s capacity (${vehicle.maxLoadCapacity} kg)`
        );
      }
    }

    const reference = await nextReference(tx);
    return tx.trip.create({
      data: {
        reference,
        source,
        destination: body.destination,
        cargoWeight: body.cargoWeight || 0,
        plannedDistance: body.plannedDistance || body.distanceKm || 0,
        revenue: body.revenue || 0,
        vehicleId: body.vehicleId || null,
        driverId: body.driverId || null,
        scheduledAt: body.scheduledDate ? new Date(body.scheduledDate) : null,
        status: 'DRAFT',
      },
      include: withRels,
    });
  });
}

// Draft -> Dispatched. Marks vehicle & driver ON_TRIP; records start odometer.
function dispatch(id, { vehicleId, driverId }) {
  return prisma.$transaction(async (tx) => {
    const trip = await tx.trip.findUnique({ where: { id } });
    if (!trip) throw ApiError.notFound('Trip not found');
    if (trip.status !== 'DRAFT') {
      throw ApiError.conflict(`Only Draft trips can be dispatched (current: ${trip.status})`);
    }

    const vehicle = await tx.vehicle.findUnique({ where: { id: vehicleId } });
    if (!vehicle) throw ApiError.badRequest('Vehicle not found');
    // Blocks RETIRED / IN_SHOP / ON_TRIP vehicles (only AVAILABLE may dispatch).
    if (vehicle.status !== 'AVAILABLE') {
      throw ApiError.conflict(`Vehicle ${vehicle.registrationNumber} is not available (${vehicle.status})`);
    }
    // Cargo must not exceed the assigned vehicle's maximum load capacity.
    if (trip.cargoWeight > vehicle.maxLoadCapacity) {
      throw ApiError.badRequest(
        `Cargo weight (${trip.cargoWeight} kg) exceeds ${vehicle.registrationNumber}'s capacity (${vehicle.maxLoadCapacity} kg)`
      );
    }

    const driver = await tx.driver.findUnique({ where: { id: driverId } });
    if (!driver) throw ApiError.badRequest('Driver not found');
    // Blocks SUSPENDED / OFF_DUTY / ON_TRIP drivers (only AVAILABLE may dispatch).
    if (driver.status !== 'AVAILABLE') {
      throw ApiError.conflict(`Driver ${driver.name} is not available (${driver.status})`);
    }
    if (driver.licenseExpiry.getTime() < Date.now()) {
      throw ApiError.conflict(`Driver ${driver.name}'s licence has expired`);
    }

    await tx.vehicle.update({ where: { id: vehicleId }, data: { status: 'ON_TRIP' } });
    await tx.driver.update({ where: { id: driverId }, data: { status: 'ON_TRIP' } });

    return tx.trip.update({
      where: { id },
      data: {
        vehicleId,
        driverId,
        status: 'DISPATCHED',
        dispatchedAt: new Date(),
        startOdometer: vehicle.odometer,
      },
      include: withRels,
    });
  });
}

// Dispatched -> Completed. Frees vehicle & driver, updates odometer/distance.
function complete(id, { endOdometer, notes }) {
  return prisma.$transaction(async (tx) => {
    const trip = await tx.trip.findUnique({ where: { id } });
    if (!trip) throw ApiError.notFound('Trip not found');
    if (trip.status !== 'DISPATCHED') {
      throw ApiError.conflict(`Only Dispatched trips can be completed (current: ${trip.status})`);
    }

    let actualDistance = trip.actualDistance;
    if (endOdometer !== undefined && trip.vehicleId) {
      if (trip.startOdometer != null && endOdometer < trip.startOdometer) {
        throw ApiError.badRequest('End odometer cannot be less than start odometer');
      }
      actualDistance = trip.startOdometer != null ? endOdometer - trip.startOdometer : actualDistance;
      await tx.vehicle.update({
        where: { id: trip.vehicleId },
        data: { odometer: endOdometer, status: 'AVAILABLE' },
      });
    } else if (trip.vehicleId) {
      await tx.vehicle.update({ where: { id: trip.vehicleId }, data: { status: 'AVAILABLE' } });
    }

    if (trip.driverId) {
      await tx.driver.update({ where: { id: trip.driverId }, data: { status: 'AVAILABLE' } });
    }

    return tx.trip.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        endOdometer: endOdometer !== undefined ? endOdometer : trip.endOdometer,
        actualDistance,
        notes: notes !== undefined ? notes : trip.notes,
      },
      include: withRels,
    });
  });
}

// Draft or Dispatched -> Cancelled. Releases any assigned vehicle/driver.
function cancel(id) {
  return prisma.$transaction(async (tx) => {
    const trip = await tx.trip.findUnique({ where: { id } });
    if (!trip) throw ApiError.notFound('Trip not found');
    if (trip.status === 'COMPLETED' || trip.status === 'CANCELLED') {
      throw ApiError.conflict(`Cannot cancel a ${trip.status} trip`);
    }

    if (trip.status === 'DISPATCHED') {
      if (trip.vehicleId) {
        await tx.vehicle.update({ where: { id: trip.vehicleId }, data: { status: 'AVAILABLE' } });
      }
      if (trip.driverId) {
        await tx.driver.update({ where: { id: trip.driverId }, data: { status: 'AVAILABLE' } });
      }
    }

    return tx.trip.update({
      where: { id },
      data: { status: 'CANCELLED', cancelledAt: new Date() },
      include: withRels,
    });
  });
}

module.exports = { list, getById, create, dispatch, complete, cancel };
