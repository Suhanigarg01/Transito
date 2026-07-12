// Shape Prisma records into the exact JSON the React frontend expects:
// ids stay as cuid strings but status/type fields are rendered as the human
// labels the UI uses, and vehicle/driver relations are flattened.

const {
  DRIVER_STATUS_LABELS,
  EXPENSE_TYPE_LABELS,
  MAINTENANCE_STATUS_LABELS,
  MAINTENANCE_TYPE_LABELS,
  ROLE_LABELS,
  TRIP_STATUS_LABELS,
  VEHICLE_STATUS_LABELS,
  VEHICLE_TYPE_LABELS,
} = require('./enums');

function presentUser(u) {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    role: u.role,
    roleLabel: ROLE_LABELS[u.role],
    active: u.active,
    createdAt: u.createdAt,
  };
}

function presentVehicle(v) {
  return {
    id: v.id,
    regNumber: v.registrationNumber,
    name: v.name,
    type: VEHICLE_TYPE_LABELS[v.type],
    maxLoadCapacity: v.maxLoadCapacity,
    odometer: v.odometer,
    acquisitionCost: v.acquisitionCost,
    status: VEHICLE_STATUS_LABELS[v.status],
    createdAt: v.createdAt,
    updatedAt: v.updatedAt,
  };
}

function presentDriver(d) {
  return {
    id: d.id,
    name: d.name,
    licenseNumber: d.licenseNumber,
    licenseCategory: d.licenseCategory,
    licenseExpiry: d.licenseExpiry ? d.licenseExpiry.toISOString().slice(0, 10) : null,
    phone: d.contactNumber,
    contactNumber: d.contactNumber,
    safetyScore: d.safetyScore,
    status: DRIVER_STATUS_LABELS[d.status],
    createdAt: d.createdAt,
    updatedAt: d.updatedAt,
  };
}

function presentTrip(t) {
  return {
    id: t.id,
    reference: t.reference,
    origin: t.source,
    destination: t.destination,
    route: `${t.source} → ${t.destination}`,
    cargoWeight: t.cargoWeight,
    plannedDistance: t.plannedDistance,
    actualDistance: t.actualDistance,
    revenue: t.revenue,
    status: TRIP_STATUS_LABELS[t.status],
    vehicleId: t.vehicleId,
    driverId: t.driverId,
    vehicle: t.vehicle ? t.vehicle.registrationNumber : '',
    driver: t.driver ? t.driver.name : '',
    scheduledDate: t.scheduledAt,
    dispatchedAt: t.dispatchedAt,
    completedAt: t.completedAt,
    startOdometer: t.startOdometer,
    endOdometer: t.endOdometer,
    notes: t.notes,
    createdAt: t.createdAt,
    updatedAt: t.updatedAt,
  };
}

function presentMaintenance(m) {
  return {
    id: m.id,
    vehicleId: m.vehicleId,
    vehicle: m.vehicle ? m.vehicle.registrationNumber : '',
    type: MAINTENANCE_TYPE_LABELS[m.type],
    description: m.description,
    cost: m.cost,
    serviceDate: m.serviceDate ? m.serviceDate.toISOString().slice(0, 10) : null,
    status: MAINTENANCE_STATUS_LABELS[m.status],
    createdAt: m.createdAt,
    updatedAt: m.updatedAt,
  };
}

function presentExpense(e) {
  return {
    id: e.id,
    vehicleId: e.vehicleId,
    vehicle: e.vehicle ? e.vehicle.registrationNumber : '',
    category: EXPENSE_TYPE_LABELS[e.type],
    amount: e.amount,
    litres: e.liters,
    odometer: e.odometer,
    date: e.date ? e.date.toISOString().slice(0, 10) : null,
    notes: e.notes,
    createdAt: e.createdAt,
    updatedAt: e.updatedAt,
  };
}

module.exports = {
  presentUser,
  presentVehicle,
  presentDriver,
  presentTrip,
  presentMaintenance,
  presentExpense,
};
