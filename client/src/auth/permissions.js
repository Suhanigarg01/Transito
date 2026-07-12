/**
 * Role-based access control for the client.
 *
 * Roles mirror the backend `Role` enum (the JWT/user payload carries the enum
 * key, e.g. "FLEET_MANAGER"). This module is the single source of truth the UI
 * uses to decide which pages to show and which actions to enable. The backend
 * enforces the same rules independently — this layer is UX, not security.
 *
 * Role responsibilities:
 *   Fleet Manager     — vehicle registry + maintenance, fleet dashboard.
 *   Driver            — trip lifecycle (create → dispatch → complete → cancel).
 *   Safety Officer    — driver compliance (licences, safety scores, status).
 *   Financial Analyst — expenses / fuel logs, maintenance-cost review, reports.
 */

export const ROLES = {
  FLEET_MANAGER: 'FLEET_MANAGER',
  DRIVER: 'DRIVER',
  SAFETY_OFFICER: 'SAFETY_OFFICER',
  FINANCIAL_ANALYST: 'FINANCIAL_ANALYST',
}

const ALL_ROLES = Object.values(ROLES)

// Which roles may open each page (route path). The dashboard is a shared,
// read-only overview available to everyone.
const PAGE_ACCESS = {
  '/dashboard': ALL_ROLES,
  '/vehicles': [ROLES.FLEET_MANAGER],
  '/drivers': [ROLES.SAFETY_OFFICER],
  '/trips': [ROLES.DRIVER],
  '/maintenance': [ROLES.FLEET_MANAGER, ROLES.FINANCIAL_ANALYST],
  '/expenses': [ROLES.FINANCIAL_ANALYST],
  '/reports': [ROLES.FINANCIAL_ANALYST],
}

// Fine-grained mutation capabilities, used to enable/disable actions on pages
// that more than one role can open (e.g. the Financial Analyst can *view*
// maintenance to review costs, but only the Fleet Manager can manage it).
const CAPABILITIES = {
  'vehicles.manage': [ROLES.FLEET_MANAGER],
  'maintenance.manage': [ROLES.FLEET_MANAGER],
  'drivers.manage': [ROLES.SAFETY_OFFICER],
  'trips.manage': [ROLES.DRIVER],
  'expenses.manage': [ROLES.FINANCIAL_ANALYST],
  'reports.view': [ROLES.FINANCIAL_ANALYST],
}

/** Can this role open the given route path? */
export function canAccessPage(role, path) {
  return Boolean(PAGE_ACCESS[path]?.includes(role))
}

/** Does this role hold the given capability (e.g. 'vehicles.manage')? */
export function can(role, capability) {
  return Boolean(CAPABILITIES[capability]?.includes(role))
}

/** The landing route after login — everyone lands on the shared dashboard. */
export function landingFor() {
  return '/dashboard'
}
