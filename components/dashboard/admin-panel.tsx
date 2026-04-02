'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useDashboardStore } from '@/lib/store'
import { Shield, Database, Settings, BarChart3 } from 'lucide-react'

export function AdminPanel() {
  const { role } = useDashboardStore()

  if (role !== 'admin') {
    return null
  }

  return (
    <Card className="p-6 mb-8 border-accent/30 bg-accent/5">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
            <Shield className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Admin Controls</h3>
            <p className="text-sm text-muted-foreground">Advanced management tools</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
        <Button
          variant="outline"
          size="sm"
          className="justify-start gap-2"
          disabled
        >
          <Database className="w-4 h-4" />
          <span className="hidden sm:inline">Add Transaction</span>
          <span className="sm:hidden text-xs">Add</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="justify-start gap-2"
          disabled
        >
          <BarChart3 className="w-4 h-4" />
          <span className="hidden sm:inline">Generate Report</span>
          <span className="sm:hidden text-xs">Report</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="justify-start gap-2"
          disabled
        >
          <Settings className="w-4 h-4" />
          <span className="hidden sm:inline">Settings</span>
          <span className="sm:hidden text-xs">Config</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="justify-start gap-2"
          disabled
        >
          <Shield className="w-4 h-4" />
          <span className="hidden sm:inline">Permissions</span>
          <span className="sm:hidden text-xs">Perms</span>
        </Button>
      </div>

      <p className="mt-4 text-xs text-muted-foreground">
        Advanced features: These are placeholder buttons for future admin functionality like transaction management, report generation, and system settings.
      </p>
    </Card>
  )
}
