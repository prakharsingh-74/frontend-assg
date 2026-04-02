'use client'

import { Card } from '@/components/ui/card'
import { formatCurrency } from '@/lib/data'
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SummaryCardProps {
  title: string
  value: number
  change?: number
  trend?: 'up' | 'down' | 'neutral'
  icon: React.ReactNode
  className?: string
  subtext?: string
}

export function SummaryCard({
  title,
  value,
  change,
  trend,
  icon,
  className,
  subtext,
}: SummaryCardProps) {
  return (
    <Card className={cn('p-6 hover:shadow-md transition-shadow duration-200', className)}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">{title}</p>
          <h3 className="text-2xl sm:text-3xl font-bold text-foreground">{formatCurrency(value)}</h3>
          {subtext && <p className="text-xs text-muted-foreground mt-1">{subtext}</p>}
        </div>
        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center text-muted-foreground">
          {icon}
        </div>
      </div>

      {change !== undefined && (
        <div className="flex items-center gap-2 text-sm">
          {trend === 'up' ? (
            <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
              <ArrowUpRight className="w-4 h-4" />
              <span className="font-medium">{formatCurrency(Math.abs(change))}</span>
            </div>
          ) : trend === 'down' ? (
            <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
              <ArrowDownRight className="w-4 h-4" />
              <span className="font-medium">{formatCurrency(Math.abs(change))}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 text-muted-foreground">
              <TrendingUp className="w-4 h-4" />
              <span className="font-medium">{formatCurrency(Math.abs(change))}</span>
            </div>
          )}
          <span className="text-muted-foreground">this month</span>
        </div>
      )}
    </Card>
  )
}
