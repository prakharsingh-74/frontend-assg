'use client'

import Link from 'next/link'
import { useDashboardStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Eye, Shield } from 'lucide-react'

export function DashboardHeader() {
  const { role, setRole } = useDashboardStore()

  return (
    <header className="border-b border-border bg-card sticky top-0 z-40">
      <div className="px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center transition-transform hover:scale-105">
          <img src="/zorvyn.jpg" alt="zorvyn" className="h-9 w-auto" />
        </Link>

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
