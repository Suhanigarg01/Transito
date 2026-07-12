// The database stores enums in UPPER_SNAKE_CASE (per the schema), but the
// existing React frontend speaks human labels ("On Trip", "Routine Service").
// These helpers translate both ways so the API is a drop-in for the UI.

const VEHICLE_TYPE_LABELS = {
  TRUCK: 'Truck',
  VAN: 'Van',
  BUS: 'Bus',
  CAR: 'Car',
  TRAILER: 'Trailer',
};

const VEHICLE_STATUS_LABELS = {
  AVAILABLE: 'Available',
  ON_TRIP: 'On Trip',
  IN_SHOP: 'In Shop',
  RETIRED: 'Retired',
};

const DRIVER_STATUS_LABELS = {
  AVAILABLE: 'Available',
  ON_TRIP: 'On Trip',
  OFF_DUTY: 'Off Duty',
};

const TRIP_STATUS_LABELS = {
  DRAFT: 'Draft',
  DISPATCHED: 'Dispatched',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

const MAINTENANCE_TYPE_LABELS = {
  ROUTINE_SERVICE: 'Routine Service',
  REPAIR: 'Repair',
  INSPECTION: 'Inspection',
  TYRE: 'Tyre',
  BODYWORK: 'Bodywork',
  OTHER: 'Other',
};

const MAINTENANCE_STATUS_LABELS = {
  OPEN: 'Open',
  CLOSED: 'Closed',
};

const EXPENSE_TYPE_LABELS = {
  FUEL: 'Fuel',
  TOLL: 'Toll',
  PARKING: 'Parking',
  FINE: 'Fine',
  OTHER: 'Other',
};

const ROLE_LABELS = {
  FLEET_MANAGER: 'Fleet Manager',
  DRIVER: 'Driver',
  SAFETY_OFFICER: 'Safety Officer',
  FINANCIAL_ANALYST: 'Financial Analyst',
};

// Build a reverse lookup that accepts either the enum key ("ON_TRIP"),
// the label ("On Trip"), or loose casing/spacing.
function reverse(labels) {
  const map = new Map();
  for (const key of Object.keys(labels)) {
    map.set(key.toUpperCase(), key);
    map.set(labels[key].toUpperCase(), key);
  }
  return (input) => {
    if (input == null) return undefined;
    const raw = String(input).trim().toUpperCase();
    const norm = raw.replace(/[\s-]+/g, '_');
    return map.get(raw) || map.get(norm);
  };
}

module.exports = {
  VEHICLE_TYPE_LABELS,
  VEHICLE_STATUS_LABELS,
  DRIVER_STATUS_LABELS,
  TRIP_STATUS_LABELS,
  MAINTENANCE_TYPE_LABELS,
  MAINTENANCE_STATUS_LABELS,
  EXPENSE_TYPE_LABELS,
  ROLE_LABELS,
  toVehicleType: reverse(VEHICLE_TYPE_LABELS),
  toVehicleStatus: reverse(VEHICLE_STATUS_LABELS),
  toDriverStatus: reverse(DRIVER_STATUS_LABELS),
  toTripStatus: reverse(TRIP_STATUS_LABELS),
  toMaintenanceType: reverse(MAINTENANCE_TYPE_LABELS),
  toMaintenanceStatus: reverse(MAINTENANCE_STATUS_LABELS),
  toExpenseType: reverse(EXPENSE_TYPE_LABELS),
  toRole: reverse(ROLE_LABELS),
};
