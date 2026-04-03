'use client'

import { mockTransactions, formatCurrency, formatDateShort } from '@/lib/data'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useMemo } from 'react'
import { motion } from 'framer-motion'

export function BalanceTrendChart() {
  const data = useMemo(() => {
    // Calculate daily balance
    const balanceByDate: Record<string, number> = {}
    let runningBalance = 0

    mockTransactions
      .slice()
      .reverse()
      .forEach((tx) => {
        const dateKey = tx.date.toISOString().split('T')[0]
        const amount = tx.type === 'income' ? tx.amount : -tx.amount
        runningBalance += amount

        if (!balanceByDate[dateKey]) {
          balanceByDate[dateKey] = runningBalance
        }
      })

    // Convert to array and sample last 30 days for cleaner chart
    return Object.entries(balanceByDate)
      .map(([date, balance]) => ({
        date: new Date(date),
        dateStr: formatDateShort(new Date(date)),
        balance: parseFloat(balance.toFixed(2)),
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime())
      .slice(-30)
  }, [])

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-200/50"
    >
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Balance Trend</h2>
        <p className="text-sm font-medium text-slate-500">Asset growth over the last 30 days</p>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.01} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis
              dataKey="dateStr"
              axisLine={false}
              tickLine={false}
              style={{ fontSize: '10px', fontWeight: '600', fill: '#94a3b8' }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              style={{ fontSize: '10px', fontWeight: '600', fill: '#94a3b8' }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(12px)',
                border: '1px solid #f1f5f9',
                borderRadius: '16px',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                padding: '12px',
              }}
              itemStyle={{ fontSize: '12px', fontWeight: '700', color: '#064e3b' }}
              labelStyle={{ fontSize: '10px', fontWeight: '600', color: '#64748b', marginBottom: '4px' }}
              formatter={(value) => [formatCurrency(value as number), 'Total Balance']}
            />
            <Area
              type="monotone"
              dataKey="balance"
              stroke="#059669"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorBalance)"
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}
