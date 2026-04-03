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
  /** When true, renders the primary hero card variant (Total Balance) */
  hero?: boolean
}

export function SummaryCard({
  title,
  value,
  change,
  trend,
  icon,
  className,
  subtext,
  hero = false,
}: SummaryCardProps) {
  const isPositive = trend === 'up'
  const isNegative = trend === 'down'

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.18 } }}
      className={cn(
        // Light mode: white card with shadow
        'group relative overflow-hidden rounded-2xl p-6 transition-all',
        // Light mode base
        'bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-200/50',
        // Dark mode: surface-container-high, ghost border only, no shadow
        'dark:bg-[#182028] dark:shadow-none dark:ring-0',
        // Ghost border via outline — only visible on dark identical-surface bg
        'dark:[outline:1px_solid_rgba(66,72,80,0.15)]',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1 flex-1">
          {/* Ledger label — Inter uppercase, 5% letter-spacing */}
          <p className={cn(
            'label-ledger',
            // Light mode: white for hero (dark bg), slate for secondary
            hero ? 'text-white/70' : 'text-slate-500',
            // Dark mode
            hero ? 'dark:text-[#60fcc7]/70' : 'dark:text-[#a6abb4]'
          )}>
            {title}
          </p>

          {/* Display number — Manrope for editorial authority */}
          <h3 className={cn(
            'font-display font-extrabold tracking-tight tabular-nums',
            hero ? 'text-4xl' : 'text-3xl',
            // Light mode: white on dark hero bg, dark slate on white secondary bg
            hero ? 'text-white' : 'text-slate-900',
            // Dark mode: always on-surface
            'dark:text-[#e6ebf4]'
          )}>
            {formatCurrency(value)}
          </h3>

          {subtext && (
            <p className={cn(
              'text-[10px] font-medium',
              hero ? 'text-white/60' : 'text-slate-400',
              'dark:text-[#a6abb4]/70'
            )}>
              {subtext}
            </p>
          )}
        </div>

        {/* Icon container */}
        <div className={cn(
          'flex h-11 w-11 items-center justify-center rounded-xl transition-all',
          // Light
          'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100',
          'group-hover:bg-emerald-600 group-hover:text-white',
          // Dark: surface-bright pill, goes primary on hover
          'dark:bg-[#242d37] dark:text-[#60fcc7] dark:ring-0',
          'dark:group-hover:bg-[#60fcc7] dark:group-hover:text-[#003d2c]',
          hero && 'dark:bg-[#60fcc7]/10 dark:text-[#60fcc7]'
        )}>
          {icon}
        </div>
      </div>

      {change !== undefined && (
        <div className="mt-4 flex items-center gap-2">
          {/* Trend chip — positive = primary-container, negative = error-container */}
          <div className={cn(
            'flex items-center gap-0.5 rounded-lg px-2 py-0.5 text-xs font-bold',
            // Light mode hero (dark bg): white chip
            hero
              ? isPositive
                ? 'bg-white/20 text-white'
                : isNegative
                ? 'bg-white/20 text-white'
                : 'bg-white/15 text-white/80'
              // Light mode secondary (white bg)
              : isPositive
              ? 'bg-emerald-100 text-emerald-700'
              : isNegative
              ? 'bg-rose-100 text-rose-700'
              : 'bg-slate-100 text-slate-600',
            // Dark mode
            isPositive
              ? 'dark:bg-[#19ce9c]/15 dark:text-[#60fcc7]'
              : isNegative
              ? 'dark:bg-[#9f0519]/30 dark:text-[#ffa8a3]'
              : 'dark:bg-[#242d37] dark:text-[#a6abb4]'
          )}>
            {isPositive ? (
              <ArrowUpRight className="h-3 w-3" />
            ) : isNegative ? (
              <ArrowDownRight className="h-3 w-3" />
            ) : (
              <TrendingUp className="h-3 w-3" />
            )}
            {formatCurrency(Math.abs(change))}
          </div>
          <span className={cn(
            'label-ledger',
            hero ? 'text-white/50' : 'text-slate-400',
            'dark:text-[#a6abb4]/50'
          )}>
            vs last month
          </span>
        </div>
      )}

      {/* Decorative ambient glow — primary-tinted, diffused */}
      <div className={cn(
        'pointer-events-none absolute -bottom-8 -right-8 h-28 w-28 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity',
        'bg-emerald-400/5',
        'dark:bg-[#60fcc7]/6'
      )} />
    </motion.div>
  )
}
