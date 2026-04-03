'use client'

import { useDashboardStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Calendar } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

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
      <div className="rounded-2xl bg-white dark:bg-[#0d141b] p-6 dark:shadow-none shadow-xl shadow-slate-200/50 ring-1 ring-slate-200/50 dark:ring-0 dark:[outline:1px_solid_rgba(66,72,80,0.15)]">
        <div className="h-10 bg-slate-50 dark:bg-[#182028] rounded-xl animate-pulse" />
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-white dark:bg-[#0d141b] p-8 shadow-xl shadow-slate-200/50 dark:shadow-none ring-1 ring-slate-200/50 dark:ring-0 dark:[outline:1px_solid_rgba(66,72,80,0.15)]">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 rounded-xl bg-emerald-50 dark:bg-[#60fcc7]/10 text-emerald-600 dark:text-[#60fcc7] ring-1 ring-emerald-100 dark:ring-0">
            <Calendar className="w-4 h-4" />
        </div>
        <div>
            <h3 className="font-display text-xl font-bold text-slate-900 dark:text-[#e6ebf4]">Time Machine</h3>
            <p className="text-xs font-medium text-slate-400 dark:text-[#a6abb4]">Jump to a specific data point</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        {[
          { label: 'Last 7 Days', days: 7, active: isLast7Days() },
          { label: 'Last 30 Days', days: 30, active: isLast30Days() },
          { label: 'Last 90 Days', days: 90, active: isLast90Days() },
          { label: 'This Year', days: null, active: false }
        ].map((btn) => (
          <button
            key={btn.label}
            onClick={() => btn.days ? setLastDays(btn.days) : (() => {
              const to = new Date()
              const from = new Date(to.getFullYear(), 0, 1)
              setDateRange(from, to)
            })()}
            className={cn(
              "rounded-xl px-5 py-2.5 text-xs font-bold transition-all tabular-nums ring-1",
              btn.active 
                ? "bg-emerald-900 dark:bg-[#60fcc7]/15 text-white dark:text-[#60fcc7] shadow-lg shadow-emerald-900/20 dark:shadow-none ring-emerald-900 dark:ring-[#60fcc7]/20 ring-1" 
                : "bg-slate-50 dark:bg-[#182028] text-slate-600 dark:text-[#a6abb4] ring-1 ring-slate-200 dark:ring-[rgba(66,72,80,0.20)] hover:bg-white dark:hover:bg-[#242d37] hover:ring-emerald-300 dark:hover:text-[#e6ebf4]"
            )}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {dateRange.from && typeof dateRange.from === 'object' && 'toLocaleDateString' in dateRange.from && (
        <div className="mt-6 pt-6 border-t border-slate-100 dark:border-[rgba(66,72,80,0.15)]">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-[#60fcc7] uppercase tracking-wider">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-[#60fcc7] animate-pulse" />
            Active Range: {dateRange.from.toLocaleDateString()} — {dateRange.to.toLocaleDateString()}
          </div>
        </div>
      )}
    </div>
  )
}
