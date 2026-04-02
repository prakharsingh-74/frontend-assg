'use client'

import { useDashboardStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Calendar } from 'lucide-react'
import { useEffect, useState } from 'react'

export function DateRangeFilter() {
  const { dateRange, setDateRange } = useDashboardStore()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const setLastDays = (days: number) => {
    const to = new Date()
    const from = new Date(to.getTime() - days * 24 * 60 * 60 * 1000)
    setDateRange(from, to)
  }

  const isLast7Days = () => {
    if (!dateRange.from || typeof dateRange.from !== 'object' || !('getTime' in dateRange.from)) {
      return false
    }
    const expectedFrom = new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000)
    return Math.abs(dateRange.from.getTime() - expectedFrom.getTime()) < 1000
  }

  const isLast30Days = () => {
    if (!dateRange.from || typeof dateRange.from !== 'object' || !('getTime' in dateRange.from)) {
      return false
    }
    const expectedFrom = new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000)
    return Math.abs(dateRange.from.getTime() - expectedFrom.getTime()) < 1000
  }

  const isLast90Days = () => {
    if (!dateRange.from || typeof dateRange.from !== 'object' || !('getTime' in dateRange.from)) {
      return false
    }
    const expectedFrom = new Date(new Date().getTime() - 90 * 24 * 60 * 60 * 1000)
    return Math.abs(dateRange.from.getTime() - expectedFrom.getTime()) < 1000
  }

  if (!isMounted) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <h3 className="font-semibold text-foreground">Quick Filters</h3>
        </div>
        <div className="h-10 bg-muted rounded-lg animate-pulse" />
      </Card>
    )
  }

  return (
    <Card className="p-4">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-4 h-4 text-muted-foreground" />
        <h3 className="font-semibold text-foreground">Quick Filters</h3>
      </div>

      <div className="flex flex-wrap gap-2">
        <Button
          variant={isLast7Days() ? 'default' : 'outline'}
          size="sm"
          onClick={() => setLastDays(7)}
          className="text-xs"
        >
          Last 7 Days
        </Button>
        <Button
          variant={isLast30Days() ? 'default' : 'outline'}
          size="sm"
          onClick={() => setLastDays(30)}
          className="text-xs"
        >
          Last 30 Days
        </Button>
        <Button
          variant={isLast90Days() ? 'default' : 'outline'}
          size="sm"
          onClick={() => setLastDays(90)}
          className="text-xs"
        >
          Last 90 Days
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const to = new Date()
            const from = new Date(to.getFullYear(), 0, 1)
            setDateRange(from, to)
          }}
          className="text-xs"
        >
          This Year
        </Button>
      </div>

      {dateRange.from && typeof dateRange.from === 'object' && 'toLocaleDateString' in dateRange.from && (
        <div className="mt-4 pt-4 border-t border-border">
          <div className="text-xs text-muted-foreground">
            <p>
              {dateRange.from.toLocaleDateString()} - {dateRange.to.toLocaleDateString()}
            </p>
          </div>
        </div>
      )}
    </Card>
  )
}
