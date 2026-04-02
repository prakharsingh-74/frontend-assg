'use client'

import { Card } from '@/components/ui/card'
import { mockTransactions, formatCurrency } from '@/lib/data'
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'

const COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
  '#6366F1',
  '#EC4899',
]

export function SpendingBreakdown() {
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie')

  const data = useMemo(() => {
    const categoryTotals: Record<string, number> = {}

    mockTransactions.forEach((tx) => {
      if (tx.type === 'expense') {
        categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount
      }
    })

    return Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category,
        amount: parseFloat(amount.toFixed(2)),
      }))
      .sort((a, b) => b.amount - a.amount)
  }, [])

  const total = data.reduce((sum, item) => sum + item.amount, 0)

  return (
    <Card className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Spending by Category</h2>
          <p className="text-sm text-muted-foreground mt-1">Total: {formatCurrency(total)}</p>
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={chartType === 'pie' ? 'default' : 'outline'}
            onClick={() => setChartType('pie')}
            className="text-xs"
          >
            Pie
          </Button>
          <Button
            size="sm"
            variant={chartType === 'bar' ? 'default' : 'outline'}
            onClick={() => setChartType('bar')}
            className="text-xs"
          >
            Bar
          </Button>
        </div>
      </div>

      <div className="w-full h-80">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'pie' ? (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ category, percent }) => `${category} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="amount"
                isAnimationActive={true}
                animationDuration={500}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => formatCurrency(value as number)}
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                }}
              />
            </PieChart>
          ) : (
            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="category"
                stroke="var(--muted-foreground)"
                angle={-45}
                textAnchor="end"
                height={80}
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
                formatter={(value) => formatCurrency(value as number)}
                contentStyle={{
                  backgroundColor: 'var(--card)',
                  border: '1px solid var(--border)',
                  borderRadius: '6px',
                }}
              />
              <Bar dataKey="amount" fill="var(--accent)" isAnimationActive={true} animationDuration={500} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
        {data.map((item, index) => (
          <div key={item.category} className="p-3 rounded-lg bg-muted">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
              <p className="text-xs font-medium text-foreground">{item.category}</p>
            </div>
            <p className="text-sm font-semibold text-foreground">{formatCurrency(item.amount)}</p>
            <p className="text-xs text-muted-foreground">{((item.amount / total) * 100).toFixed(1)}%</p>
          </div>
        ))}
      </div>
    </Card>
  )
}
