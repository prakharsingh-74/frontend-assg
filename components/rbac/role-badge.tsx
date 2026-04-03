'use client'

import { cn } from '@/lib/utils'
import { ROLE_META } from '@/lib/rbac'
import { usePermissions } from '@/hooks/use-permissions'
import { Shield, Eye, CircleUser } from 'lucide-react'
import type { UserRole } from '@/lib/types'

const ROLE_ICONS: Record<UserRole, React.ElementType> = {
  viewer: Eye,
  user:   CircleUser,
  admin:  Shield,
}

interface RoleBadgeProps {
  /** If not provided, reads from the Zustand store */
  role?: UserRole
  showIcon?: boolean
  showDescription?: boolean
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function RoleBadge({
  role: roleProp,
  showIcon = true,
  showDescription = false,
  size = 'md',
  className,
}: RoleBadgeProps) {
  const { role: storeRole } = usePermissions()
  const role = roleProp ?? storeRole
  const meta = ROLE_META[role]
  const Icon = ROLE_ICONS[role]

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3 py-1.5 text-sm gap-2',
  }

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <span
        className={cn(
          'inline-flex items-center font-bold rounded-full',
          meta.color,
          meta.darkColor,
          meta.textColor,
          meta.darkTextColor,
          sizeClasses[size]
        )}
      >
        {showIcon && <Icon className={size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-4 w-4' : 'h-3.5 w-3.5'} />}
        {meta.label}
      </span>
      {showDescription && (
        <p className="text-[10px] text-slate-400 dark:text-[#a6abb4]">{meta.description}</p>
      )}
    </div>
  )
}

/* ─────────────────────── Permissions list (for admin UI) ──────────────── */

export function PermissionsList({ role }: { role: UserRole }) {
  const { getRolePermissions } = usePermissionsForRole(role)
  return (
    <div className="flex flex-wrap gap-1.5">
      {getRolePermissions.map((p) => (
        <span
          key={p}
          className="inline-flex items-center rounded-md bg-slate-50 dark:bg-[#242d37] px-2 py-0.5 text-[9px] font-mono font-semibold text-slate-500 dark:text-[#a6abb4] ring-1 ring-slate-200 dark:ring-[rgba(66,72,80,0.20)]"
        >
          {p}
        </span>
      ))}
    </div>
  )
}

// Helper for PermissionsList without the hook calling useDashboardStore
function usePermissionsForRole(role: UserRole) {
  const { getRolePermissions } = require('@/lib/rbac')
  return { getRolePermissions: getRolePermissions(role) as string[] }
}
