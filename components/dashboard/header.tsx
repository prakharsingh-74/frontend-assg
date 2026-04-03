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
          <div className="flex items-center gap-1 bg-slate-100/50 p-1 rounded-full border border-slate-200/50">
            <Button
              variant={role === 'viewer' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setRole('viewer')}
              className={`rounded-full gap-2 ${role === 'viewer' ? 'bg-white shadow-sm' : 'text-slate-500'}`}
            >
              <Eye className="w-4 h-4" />
              <span className="hidden sm:inline">Viewer</span>
            </Button>
            <Button
              variant={role === 'admin' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setRole('admin')}
              className={`rounded-full gap-2 ${role === 'admin' ? 'bg-white shadow-sm' : 'text-slate-500'}`}
            >
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Admin</span>
            </Button>
          </div>

          <Badge variant="outline" className="rounded-full bg-white/50 backdrop-blur-sm">
            {role === 'admin' ? '👤 Admin Mode' : '👁️ Viewer Mode'}
          </Badge>
        </div>
      </div>
    </header>
  )
}
