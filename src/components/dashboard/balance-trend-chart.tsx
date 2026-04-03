'use client'

import { useDashboardStore } from '@/lib/store'
import { formatCurrency, formatDateShort } from '@/lib/data'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { Search } from 'lucide-react'
import { useTheme } from 'next-themes'

export function BalanceTrendChart() {
  const { transactions } = useDashboardStore()
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const data = useMemo(() => {
    if (!transactions.length) return []

    const balanceByDate: Record<string, number> = {}
    let runningBalance = 0

    const sortedTxs = [...transactions].sort((a, b) => a.date.getTime() - b.date.getTime())

    sortedTxs.forEach((tx) => {
      const dateKey = tx.date.toISOString().split('T')[0]
      const amount = tx.type === 'income' ? tx.amount : -tx.amount
      runningBalance += amount
      balanceByDate[dateKey] = runningBalance
    })

    return Object.keys(balanceByDate)
      .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())
      .map((date) => ({
        date: new Date(date),
        dateStr: formatDateShort(new Date(date)),
        balance: parseFloat(balanceByDate[date].toFixed(2)),
      }))
      .slice(-30)
  }, [transactions])

  // Editorial colour tokens
  const primary = '#60fcc7'
  const primaryDim = 'rgba(96, 252, 199, 0.12)'
  const axisColor = isDark ? '#a6abb4' : '#94a3b8'
  const gridColor = isDark ? 'rgba(66, 72, 80, 0.25)' : '#f1f5f9'
  const strokeColor = isDark ? primary : '#059669'

  return (
    <motion.div
      whileHover={{ y: -3 }}
      className={[
        'rounded-2xl p-8 transition-all',
        // Light
        'bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-200/50',
        // Dark: surface-container-high, ghost border, no shadow
        'dark:bg-[#182028] dark:shadow-none dark:ring-0',
        'dark:[outline:1px_solid_rgba(66,72,80,0.15)]',
      ].join(' ')}
    >
      {/* Header */}
      <div className="mb-8">
        <h2 className="font-display text-2xl font-bold tracking-tight text-slate-900 dark:text-[#e6ebf4]">
          Balance Trend
        </h2>
        <p className="mt-1 text-sm font-medium text-slate-500 dark:text-[#a6abb4]">
          Asset growth over the last 30 days
        </p>
      </div>

      <div className="h-72 w-full flex items-center justify-center">
        {data.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorBalanceDark" x1="0" y1="0" x2="0" y2="1">
                  {/* Primary laser-pointer colour fades to transparent */}
                  <stop offset="5%"  stopColor={isDark ? primary : '#10b981'} stopOpacity={isDark ? 0.20 : 0.15} />
                  <stop offset="95%" stopColor={isDark ? primary : '#10b981'} stopOpacity={0.01} />
                </linearGradient>
              </defs>

              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke={gridColor}
              />

              <XAxis
                dataKey="dateStr"
                axisLine={false}
                tickLine={false}
                style={{ fontSize: '10px', fontWeight: '600', fill: axisColor, fontFamily: 'Inter, sans-serif' }}
                dy={10}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                style={{ fontSize: '10px', fontWeight: '600', fill: axisColor, fontFamily: 'Inter, sans-serif' }}
                tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              />

              {/* Glassmorphism tooltip: surface-container-high @ 70% opacity + 24px blur */}
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? 'rgba(24, 32, 40, 0.70)' : 'rgba(255, 255, 255, 0.80)',
                  backdropFilter: 'blur(24px)',
                  WebkitBackdropFilter: 'blur(24px)',
                  border: isDark ? '1px solid rgba(66, 72, 80, 0.25)' : '1px solid #f1f5f9',
                  borderRadius: '12px',
                  boxShadow: isDark ? '0px 24px 48px rgba(0, 0, 0, 0.50)' : '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  padding: '12px 16px',
                }}
                itemStyle={{
                  fontSize: '13px',
                  fontWeight: '700',
                  color: isDark ? '#60fcc7' : '#064e3b',
                  fontFamily: 'Manrope, sans-serif',
                }}
                labelStyle={{
                  fontSize: '10px',
                  fontWeight: '600',
                  color: isDark ? '#a6abb4' : '#64748b',
                  marginBottom: '4px',
                  fontFamily: 'Inter, sans-serif',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
                formatter={(v) => [formatCurrency(v as number), 'Total Balance']}
              />

              <Area
                type="monotone"
                dataKey="balance"
                stroke={strokeColor}
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorBalanceDark)"
                animationDuration={1200}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-3 rounded-full bg-slate-50 dark:bg-[#242d37] p-4">
              <Search className="h-6 w-6 text-slate-300 dark:text-[#a6abb4]" />
            </div>
            <p className="text-sm font-bold text-slate-900 dark:text-[#e6ebf4]">Insufficient data</p>
            <p className="mt-1 text-xs text-slate-500 dark:text-[#a6abb4]">Record more transactions to see trends</p>
          </div>
        )}
      </div>
    </motion.div>
  )
}
