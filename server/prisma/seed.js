const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding TransitOps…');

  // --- Users (one per role) ---
  const password = await bcrypt.hash('password123', 10);
  const users = [
    { name: 'Priya Fleet', email: 'manager@transitops.dev', role: 'FLEET_MANAGER' },
    { name: 'Ramesh Kumar', email: 'driver@transitops.dev', role: 'DRIVER' },
    { name: 'Sana Safety', email: 'safety@transitops.dev', role: 'SAFETY_OFFICER' },
    { name: 'Farid Finance', email: 'finance@transitops.dev', role: 'FINANCIAL_ANALYST' },
  ];
  for (const u of users) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: { ...u, password },
    });
  }

  // --- Vehicles ---
  const vehicleSeed = [
    { registrationNumber: 'MH-12-AB-1234', name: 'Tata LPT 1613', type: 'TRUCK', odometer: 84200, status: 'AVAILABLE', maxLoadCapacity: 9000, acquisitionCost: 2200000 },
    { registrationNumber: 'MH-14-CD-9911', name: 'Ashok Leyland Dost', type: 'VAN', odometer: 41230, status: 'AVAILABLE', maxLoadCapacity: 1500, acquisitionCost: 900000 },
    { registrationNumber: 'MH-12-EF-5522', name: 'Eicher Pro 2049', type: 'TRUCK', odometer: 122900, status: 'AVAILABLE', maxLoadCapacity: 5000, acquisitionCost: 1800000 },
    { registrationNumber: 'MH-01-GH-7788', name: 'Force Traveller', type: 'BUS', odometer: 156700, status: 'AVAILABLE', maxLoadCapacity: 3000, acquisitionCost: 1500000 },
  ];
  const vehicles = {};
  for (const v of vehicleSeed) {
    const rec = await prisma.vehicle.upsert({
      where: { registrationNumber: v.registrationNumber },
      update: {},
      create: v,
    });
    vehicles[v.registrationNumber] = rec.id;
  }

  // --- Drivers ---
  const driverSeed = [
    { name: 'Ramesh Kumar', licenseNumber: 'DL-0420110149646', licenseExpiry: new Date('2027-03-15'), contactNumber: '+91 98200 11223', status: 'AVAILABLE', safetyScore: 92 },
    { name: 'Suresh Patil', licenseNumber: 'MH-1420190004521', licenseExpiry: new Date('2026-08-01'), contactNumber: '+91 99870 55412', status: 'AVAILABLE', safetyScore: 88 },
    { name: 'Anita Desai', licenseNumber: 'MH-0120170098712', licenseExpiry: new Date('2026-07-30'), contactNumber: '+91 90045 78123', status: 'AVAILABLE', safetyScore: 95 },
    { name: 'Vijay Singh', licenseNumber: 'DL-0520150031200', licenseExpiry: new Date('2025-12-10'), contactNumber: '+91 98115 66200', status: 'OFF_DUTY', safetyScore: 79 },
  ];
  const drivers = {};
  for (const d of driverSeed) {
    const rec = await prisma.driver.upsert({
      where: { licenseNumber: d.licenseNumber },
      update: {},
      create: d,
    });
    drivers[d.name] = rec.id;
  }

  // --- Maintenance (one OPEN record puts EF-5522 in the shop) ---
  const maint = [
    { reg: 'MH-12-EF-5522', type: 'REPAIR', description: 'Clutch replacement', cost: 18500, serviceDate: new Date('2026-07-08'), status: 'OPEN' },
    { reg: 'MH-12-AB-1234', type: 'ROUTINE_SERVICE', description: '80k km service', cost: 6200, serviceDate: new Date('2026-06-20'), status: 'CLOSED' },
    { reg: 'MH-01-GH-7788', type: 'TYRE', description: '4 x front tyres', cost: 24000, serviceDate: new Date('2026-05-30'), status: 'CLOSED' },
  ];
  for (const m of maint) {
    await prisma.maintenanceLog.create({
      data: {
        vehicleId: vehicles[m.reg],
        type: m.type,
        description: m.description,
        cost: m.cost,
        serviceDate: m.serviceDate,
        status: m.status,
      },
    });
  }
  // Reflect the open repair in the vehicle's status.
  await prisma.vehicle.update({
    where: { id: vehicles['MH-12-EF-5522'] },
    data: { status: 'IN_SHOP' },
  });

  // --- Expenses ---
  const expenses = [
    { reg: 'MH-14-CD-9911', type: 'FUEL', amount: 5400, liters: 55, odometer: 41230, date: new Date('2026-07-10'), notes: 'HP Riverside' },
    { reg: 'MH-12-AB-1234', type: 'FUEL', amount: 6100, liters: 62, odometer: 84200, date: new Date('2026-07-09'), notes: 'IOCL Depot A' },
    { reg: 'MH-01-GH-7788', type: 'TOLL', amount: 320, liters: null, odometer: null, date: new Date('2026-07-08'), notes: 'Expressway' },
  ];
  for (const e of expenses) {
    await prisma.expense.create({
      data: {
        vehicleId: vehicles[e.reg],
        type: e.type,
        amount: e.amount,
        liters: e.liters,
        odometer: e.odometer,
        date: e.date,
        notes: e.notes,
      },
    });
  }

  // --- Trips ---
  // A completed trip (revenue feeds ROI), plus a draft awaiting dispatch.
  await prisma.trip.create({
    data: {
      reference: 'TRP-1041', source: 'Warehouse', destination: 'Airport',
      vehicleId: vehicles['MH-14-CD-9911'], driverId: drivers['Suresh Patil'],
      status: 'COMPLETED', cargoWeight: 1200, plannedDistance: 62, actualDistance: 60,
      revenue: 9800, startOdometer: 41170, endOdometer: 41230,
      dispatchedAt: new Date('2026-07-09T08:00:00Z'), completedAt: new Date('2026-07-09T12:00:00Z'),
    },
  });
  await prisma.trip.create({
    data: {
      reference: 'TRP-1042', source: 'Depot A', destination: 'Riverside',
      status: 'DRAFT', cargoWeight: 3000, plannedDistance: 45, revenue: 7200,
    },
  });

  console.log('✅ Seed complete.');
  console.log('   Login: manager@transitops.dev / password123 (FLEET_MANAGER)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
