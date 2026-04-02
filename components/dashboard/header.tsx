'use client'

import { useDashboardStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Shield, Eye } from 'lucide-react'

export function DashboardHeader() {
  const { role, setRole } = useDashboardStore()

  return (
    <header className="border-b border-border bg-card sticky top-0 z-40">
      <div className="px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
            <Shield className="w-6 h-6 text-accent-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">Finance Dashboard</h1>
            <p className="text-xs text-muted-foreground">Smart financial management</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-muted rounded-lg p-1">
            <Button
              variant={role === 'viewer' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setRole('viewer')}
              className={`gap-1.5 ${role === 'viewer' ? '' : 'text-muted-foreground'}`}
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Viewer</span>
            </Button>
            <Button
              variant={role === 'admin' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setRole('admin')}
              className={`gap-1.5 ${role === 'admin' ? '' : 'text-muted-foreground'}`}
            >
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Admin</span>
            </Button>
          </div>

          <Badge variant="secondary" className="text-xs">
            {role === 'admin' ? '👤 Admin Mode' : '👁️ Viewer Mode'}
          </Badge>
        </div>
      </div>
    </header>
  )
}
