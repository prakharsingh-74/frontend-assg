'use client'

import { formatCurrency } from '@/lib/data'
import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

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
  const isPositive = trend === 'up'
  const isNegative = trend === 'down'

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={cn(
        'group relative overflow-hidden rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/50 ring-1 ring-slate-200/50 transition-all hover:shadow-2xl hover:shadow-slate-300/50',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">
            {title}
          </p>
          <h3 className="text-3xl font-bold tracking-tight tabular-nums">
            {formatCurrency(value)}
          </h3>
          {subtext && (
            <p className="text-[10px] font-medium opacity-60">{subtext}</p>
          )}
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100 transition-colors group-hover:bg-emerald-600 group-hover:text-white">
          {icon}
        </div>
      </div>

      {change !== undefined && (
        <div className="mt-4 flex items-center gap-2">
          <div
            className={cn(
              'flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-bold',
              isPositive
                ? 'bg-emerald-100 text-emerald-700'
                : isNegative
                ? 'bg-rose-100 text-rose-700'
                : 'bg-slate-100 text-slate-600'
            )}
          >
            {isPositive ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : isNegative ? (
              <ArrowDownRight className="h-3 w-3" />
            ) : (
              <TrendingUp className="h-3 w-3" />
            )}
            {formatCurrency(Math.abs(change))}
          </div>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight opacity-50">
            vs last month
          </span>
        </div>
      )}

      {/* Decorative gradient blur */}
      <div className="absolute -bottom-6 -right-6 h-24 w-24 rounded-full bg-emerald-500/5 blur-3xl transition-opacity group-hover:opacity-100" />
    </motion.div>
  )
}
