'use client'

/**
 * ─────────────────────────────────────────────────────────────────────────
 *  usePermissions — React hook for consuming RBAC in components
 *
 *  Usage:
 *    const { can, canAny, canAll, role, permissions } = usePermissions()
 *
 *    // Imperative guard (in event handlers / conditional rendering)
 *    if (!can(Permission.TRANSACTIONS_CREATE)) return null
 *
 *    // Declarative guard (preferred — see PermissionGuard component)
 *    <PermissionGuard permission={Permission.ADMIN_PANEL_VIEW}>
 *      <AdminPanel />
 *    </PermissionGuard>
 * ─────────────────────────────────────────────────────────────────────────
 */

import { useMemo } from 'react'
import { useDashboardStore } from '@/lib/store'
import {
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
  getRolePermissions,
  ROLE_META,
  type Permission,
} from '@/lib/rbac'
import type { UserRole } from '@/lib/types'

export interface UsePermissionsReturn {
  /** The current user role */
  role: UserRole

  /** Role metadata (label, description, colour tokens) */
  meta: (typeof ROLE_META)[UserRole]

  /**
   * Check if the current user has a SINGLE permission.
   * @example can(Permission.TRANSACTIONS_CREATE)
   */
  can: (permission: Permission) => boolean

  /**
   * Check if the current user has ALL listed permissions (AND).
   * @example canAll([Permission.ADMIN_PANEL_VIEW, Permission.ADMIN_REVENUE_VIEW])
   */
  canAll: (permissions: Permission[]) => boolean

  /**
   * Check if the current user has ANY of the listed permissions (OR).
   * @example canAny([Permission.TRANSACTIONS_CREATE, Permission.TRANSACTIONS_DELETE])
   */
  canAny: (permissions: Permission[]) => boolean

  /** Full list of permissions granted to this role */
  permissions: Permission[]

  /** Convenience: true if role is 'admin' */
  isAdmin: boolean

  /** Convenience: true if role is 'user' or 'admin' (has write access) */
  canWrite: boolean

  /** Convenience: true if role is 'viewer' (read-only) */
  isReadOnly: boolean
}

export function usePermissions(): UsePermissionsReturn {
  const { role } = useDashboardStore()

  return useMemo((): UsePermissionsReturn => {
    const can    = (p: Permission)    => hasPermission(role, p)
    const canAll = (ps: Permission[]) => hasAllPermissions(role, ps)
    const canAny = (ps: Permission[]) => hasAnyPermission(role, ps)

    return {
      role,
      meta:        ROLE_META[role],
      can,
      canAll,
      canAny,
      permissions: getRolePermissions(role),
      isAdmin:     role === 'admin',
      canWrite:    role === 'user' || role === 'admin',
      isReadOnly:  role === 'viewer',
    }
  }, [role])
}
