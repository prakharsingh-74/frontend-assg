'use client'

/**
 * ─────────────────────────────────────────────────────────────────────────
 *  PermissionGuard — Declarative access control component
 *
 *  Renders children ONLY if the current user has the required permission(s).
 *  Otherwise renders `fallback` (default: null).
 *
 *  Usage:
 *    // Single permission
 *    <PermissionGuard permission={Permission.TRANSACTIONS_CREATE}>
 *      <AddTransactionButton />
 *    </PermissionGuard>
 *
 *    // Any of multiple permissions (OR)
 *    <PermissionGuard anyOf={[Permission.ADMIN_PANEL_VIEW, Permission.ADMIN_REVENUE_VIEW]}>
 *      <AdminSection />
 *    </PermissionGuard>
 *
 *    // All permissions required (AND)
 *    <PermissionGuard allOf={[Permission.DATA_EXPORT_CSV, Permission.DATA_EXPORT_JSON]}>
 *      <ExportButton />
 *    </PermissionGuard>
 *
 *    // With a fallback UI for denied state
 *    <PermissionGuard
 *      permission={Permission.TRANSACTIONS_CREATE}
 *      fallback={<ReadOnlyBadge />}
 *    >
 *      <AddTransactionButton />
 *    </PermissionGuard>
 * ─────────────────────────────────────────────────────────────────────────
 */

import { usePermissions } from '@/hooks/use-permissions'
import type { Permission } from '@/lib/rbac'

type PermissionGuardProps = {
  children: React.ReactNode
  /** Fallback rendered when access is denied. Default: null */
  fallback?: React.ReactNode
} & (
  | { permission: Permission; anyOf?: never; allOf?: never }
  | { anyOf: Permission[];   permission?: never; allOf?: never }
  | { allOf: Permission[];   permission?: never; anyOf?: never }
)

export function PermissionGuard({
  children,
  fallback = null,
  permission,
  anyOf,
  allOf,
}: PermissionGuardProps) {
  const { can, canAny, canAll } = usePermissions()

  const isAllowed = permission
    ? can(permission)
    : anyOf
    ? canAny(anyOf)
    : allOf
    ? canAll(allOf)
    : false

  return isAllowed ? <>{children}</> : <>{fallback}</>
}

/* ─────────────────────── Convenience derivatives ───────────────────────── */

/** Renders children only for Admin role (has ADMIN_PANEL_VIEW) */
export function AdminOnly({
  children,
  fallback = null,
}: {
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  return (
    <PermissionGuard permission="admin:panel:view" fallback={fallback}>
      {children}
    </PermissionGuard>
  )
}

/** Renders children only for roles that can mutate (User or Admin) */
export function WriteOnly({
  children,
  fallback = null,
}: {
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  return (
    <PermissionGuard permission="transactions:create" fallback={fallback}>
      {children}
    </PermissionGuard>
  )
}

/** Renders children only for Viewer role */
export function ViewerOnly({
  children,
  fallback = null,
}: {
  children: React.ReactNode
  fallback?: React.ReactNode
}) {
  const { isReadOnly } = usePermissions()
  return isReadOnly ? <>{children}</> : <>{fallback}</>
}
