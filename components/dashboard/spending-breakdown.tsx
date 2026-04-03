'use client'

import { useDashboardStore } from '@/lib/store'
import { formatCurrency } from '@/lib/data'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { Search, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

const COLORS = [
  '#064e3b', // Emerald 900
  '#065f46', // Emerald 800
  '#047857', // Emerald 700
  '#059669', // Emerald 600
  '#10b981', // Emerald 500
  '#34d399', // Emerald 400
  '#6ee7b7', // Emerald 300
]

export function SpendingBreakdown() {
  const { transactions, setSearchQuery, setSelectedCategory } = useDashboardStore()
  const [chartType, setChartType] = useState<'pie' | 'bar'>('pie')

  const data = useMemo(() => {
    const categoryTotals: Record<string, number> = {}

    transactions.forEach((tx) => {
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
  }, [transactions])

  const total = data.reduce((sum, item) => sum + item.amount, 0)

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-200/50 h-full flex flex-col"
    >
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Spending Breakdown</h2>
          <p className="text-sm font-medium text-slate-500">Total: <span className="text-emerald-600 font-bold">{formatCurrency(total)}</span></p>
        </div>
        <div className="flex gap-1 rounded-xl bg-slate-100 p-1 ring-1 ring-slate-200">
          <button
            onClick={() => setChartType('pie')}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-bold transition-all",
              chartType === 'pie' ? "bg-white text-emerald-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            Pie
          </button>
          <button
            onClick={() => setChartType('bar')}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-bold transition-all",
              chartType === 'bar' ? "bg-white text-emerald-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            Bar
          </button>
        </div>
      </div>

      <div className="h-64 w-full relative flex-1">
        {total > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'pie' ? (
              <PieChart key="pie">
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="amount"
                  isAnimationActive={true}
                  animationDuration={1000}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid #f1f5f9',
                    borderRadius: '16px',
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  }}
                  itemStyle={{ fontSize: '12px', fontWeight: '700' }}
                  formatter={(value) => formatCurrency(value as number)}
                />
              </PieChart>
            ) : (
              <BarChart key="bar" data={data} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis
                  dataKey="category"
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
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid #f1f5f9',
                    borderRadius: '16px',
                  }}
                  formatter={(value) => formatCurrency(value as number)}
                />
                <Bar 
                  dataKey="amount" 
                  fill="#10b981" 
                  radius={[6, 6, 0, 0]} 
                  isAnimationActive={true} 
                />
              </BarChart>
            )}
          </ResponsiveContainer>
        ) : (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-3 rounded-full bg-slate-50 p-4 ring-1 ring-slate-100">
              <Search className="h-6 w-6 text-slate-300" />
            </div>
            <p className="text-sm font-bold text-slate-900">No data found</p>
            <p className="mt-1 text-xs text-slate-500">Adjust filters to see breakdown</p>
            <Button
                variant="outline"
                size="sm"
                className="mt-4 rounded-xl border-slate-200 text-xs font-bold gap-2"
                onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory(null)
                }}
            >
                <RotateCcw className="h-3 w-3" />
                Reset
            </Button>
          </div>
        )}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">
        {data.slice(0, 4).map((item, index) => (
          <div key={item.category} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100 transition-all hover:bg-white hover:ring-emerald-100 group">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-emerald-700">{item.category}</span>
              </div>
              <span className="text-[10px] font-bold text-emerald-600">{((item.amount / total) * 100).toFixed(0)}%</span>
            </div>
            <p className="text-sm font-bold text-slate-900 tabular-nums">{formatCurrency(item.amount)}</p>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
