'use client'

import { Card } from '@/components/ui/card'
import { mockTransactions, formatCurrency, formatDateShort } from '@/lib/data'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useMemo } from 'react'

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
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground">Balance Trend</h2>
        <p className="text-sm text-muted-foreground mt-1">Last 30 days</p>
      </div>

      <div className="w-full h-64 -mx-6 px-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis
              dataKey="dateStr"
              stroke="var(--muted-foreground)"
              style={{ fontSize: '12px' }}
              tick={{ fill: 'var(--muted-foreground)' }}
            />
            <YAxis
              stroke="var(--muted-foreground)"
              style={{ fontSize: '12px' }}
              tick={{ fill: 'var(--muted-foreground)' }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
              }}
              labelStyle={{ color: 'var(--foreground)' }}
              formatter={(value) => [formatCurrency(value as number), 'Balance']}
              cursor={{ stroke: 'var(--accent)', strokeWidth: 1 }}
            />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="var(--accent)"
              strokeWidth={2}
              dot={false}
              isAnimationActive={true}
              animationDuration={500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
