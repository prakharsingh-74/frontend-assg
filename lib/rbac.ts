/**
 * ─────────────────────────────────────────────────────────────────────────
 *  RBAC — Permission Definitions & Role Matrix
 *  Single source of truth for all access control in the application.
 *
 *  Architecture:
 *    Permission  → a granular capability string  (e.g. "transactions:create")
 *    Role        → a named user tier             (viewer | user | admin)
 *    ROLE_MATRIX → maps every role to its Set of permitted capabilities
 *
 *  Rules:
 *    • Permissions are NEVER checked as raw strings in components.
 *      Always import the Permission constants from this file.
 *    • Role strings are NEVER compared directly in UI logic.
 *      Use hasPermission() or the usePermissions() hook instead.
 *    • Adding a new feature = add a Permission here + assign to roles.
 * ─────────────────────────────────────────────────────────────────────────
 */

import type { UserRole } from './types'

/* ─────────────────────── Permission constants ─────────────────────────── */

export const Permission = {
  // ── Dashboard ──────────────────────────────────────────────────────────
  DASHBOARD_VIEW:           'dashboard:view',

  // ── Transactions ───────────────────────────────────────────────────────
  TRANSACTIONS_VIEW:        'transactions:view',
  TRANSACTIONS_CREATE:      'transactions:create',
  TRANSACTIONS_DELETE:      'transactions:delete',
  TRANSACTIONS_EXPORT:      'transactions:export',

  // ── Insights / Analytics ───────────────────────────────────────────────
  INSIGHTS_VIEW:            'insights:view',

  // ── Settings ───────────────────────────────────────────────────────────
  SETTINGS_VIEW:            'settings:view',
  SETTINGS_PROFILE_EDIT:    'settings:profile:edit',
  SETTINGS_PREFERENCES:     'settings:preferences',

  // ── Admin ──────────────────────────────────────────────────────────────
  ADMIN_PANEL_VIEW:         'admin:panel:view',
  ADMIN_USER_MANAGE:        'admin:users:manage',
  ADMIN_REVENUE_VIEW:       'admin:revenue:view',
  ADMIN_SECURITY_VIEW:      'admin:security:view',
  ADMIN_REPORTS_GENERATE:   'admin:reports:generate',

  // ── Data ───────────────────────────────────────────────────────────────
  DATA_REFRESH:             'data:refresh',
  DATA_EXPORT_CSV:          'data:export:csv',
  DATA_EXPORT_JSON:         'data:export:json',
} as const

/** Union type of all valid permission strings */
export type Permission = (typeof Permission)[keyof typeof Permission]

/* ─────────────────────── Role → Permission matrix ─────────────────────── */

const VIEWER_PERMISSIONS: Permission[] = [
  Permission.DASHBOARD_VIEW,
  Permission.TRANSACTIONS_VIEW,
  Permission.INSIGHTS_VIEW,
  Permission.SETTINGS_VIEW,
]

const USER_PERMISSIONS: Permission[] = [
  ...VIEWER_PERMISSIONS,
  Permission.TRANSACTIONS_CREATE,
  Permission.TRANSACTIONS_EXPORT,
  Permission.SETTINGS_PROFILE_EDIT,
  Permission.SETTINGS_PREFERENCES,
  Permission.DATA_REFRESH,
  Permission.DATA_EXPORT_CSV,
  Permission.DATA_EXPORT_JSON,
]

const ADMIN_PERMISSIONS: Permission[] = [
  ...USER_PERMISSIONS,
  Permission.TRANSACTIONS_DELETE,
  Permission.ADMIN_PANEL_VIEW,
  Permission.ADMIN_USER_MANAGE,
  Permission.ADMIN_REVENUE_VIEW,
  Permission.ADMIN_SECURITY_VIEW,
  Permission.ADMIN_REPORTS_GENERATE,
]

/**
 * The authoritative role → permission matrix.
 * Using Set<>s for O(1) lookup.
 */
export const ROLE_MATRIX: Record<UserRole, Set<Permission>> = {
  viewer: new Set(VIEWER_PERMISSIONS),
  user:   new Set(USER_PERMISSIONS),
  admin:  new Set(ADMIN_PERMISSIONS),
}

/* ─────────────────────── Pure utility functions ────────────────────────── */

/**
 * Check if a role has a single permission.
 * Pure function — safe to call anywhere (store, middleware, tests).
 */
export function hasPermission(role: UserRole, permission: Permission): boolean {
  return ROLE_MATRIX[role]?.has(permission) ?? false
}

/**
 * Check if a role has ALL of the listed permissions (logical AND).
 */
export function hasAllPermissions(role: UserRole, permissions: Permission[]): boolean {
  return permissions.every((p) => hasPermission(role, p))
}

/**
 * Check if a role has AT LEAST ONE of the listed permissions (logical OR).
 */
export function hasAnyPermission(role: UserRole, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p))
}

/**
 * Returns every permission the role holds.
 * Useful for debugging or rendering a permissions list in an admin UI.
 */
export function getRolePermissions(role: UserRole): Permission[] {
  return Array.from(ROLE_MATRIX[role] ?? [])
}

/* ─────────────────────── Role metadata ─────────────────────────────────── */

export interface RoleMeta {
  label: string
  description: string
  color: string         // Tailwind bg class (light)
  darkColor: string     // Tailwind bg class (dark)
  textColor: string     // Tailwind text class (light)
  darkTextColor: string // Tailwind text class (dark)
}

export const ROLE_META: Record<UserRole, RoleMeta> = {
  viewer: {
    label:         'Viewer',
    description:   'Read-only access to all financial data',
    color:         'bg-slate-100',
    darkColor:     'dark:bg-[#182028]',
    textColor:     'text-slate-600',
    darkTextColor: 'dark:text-[#a6abb4]',
  },
  user: {
    label:         'User',
    description:   'Can view and create transactions, export data',
    color:         'bg-blue-50',
    darkColor:     'dark:bg-blue-900/20',
    textColor:     'text-blue-700',
    darkTextColor: 'dark:text-blue-300',
  },
  admin: {
    label:         'Admin',
    description:   'Full access including admin controls and user management',
    color:         'bg-emerald-50',
    darkColor:     'dark:bg-[#60fcc7]/10',
    textColor:     'text-emerald-700',
    darkTextColor: 'dark:text-[#60fcc7]',
  },
}
