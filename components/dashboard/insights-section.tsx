'use client'

import { Card } from '@/components/ui/card'
import { mockTransactions, formatCurrency } from '@/lib/data'
import { TrendingDown, AlertCircle, Target, Calendar } from 'lucide-react'
import { useMemo } from 'react'
import { cn } from '@/lib/utils'

export function InsightsSection() {
  const insights = useMemo(() => {
    const now = new Date()
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1)

    // This month transactions
    const thisMonthTransactions = mockTransactions.filter(
      (tx) => tx.date >= thisMonth && tx.date < nextMonthStart
    )

    // Last month transactions
    const lastMonthEnd = new Date(lastMonth.getFullYear(), lastMonth.getMonth() + 1, 0)
    const lastMonthTransactions = mockTransactions.filter(
      (tx) => tx.date >= lastMonth && tx.date < thisMonth
    )

    // Calculate metrics
    const thisMonthExpenses = thisMonthTransactions
      .filter((tx) => tx.type === 'expense')
      .reduce((sum, tx) => sum + tx.amount, 0)

    const lastMonthExpenses = lastMonthTransactions
      .filter((tx) => tx.type === 'expense')
      .reduce((sum, tx) => sum + tx.amount, 0)

    const expenseDifference = thisMonthExpenses - lastMonthExpenses
    const expenseChangePercent =
      lastMonthExpenses > 0 ? ((expenseDifference / lastMonthExpenses) * 100).toFixed(1) : 0

    // Highest category
    const categoryTotals: Record<string, number> = {}
    thisMonthTransactions.forEach((tx) => {
      if (tx.type === 'expense') {
        categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + tx.amount
      }
    })

    const highestCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]
    const highestCategoryAmount = highestCategory ? highestCategory[1] : 0
    const highestCategoryPercent =
      thisMonthExpenses > 0 ? ((highestCategoryAmount / thisMonthExpenses) * 100).toFixed(1) : 0

    // Average transaction
    const avgTransaction =
      thisMonthTransactions.length > 0
        ? thisMonthTransactions.reduce((sum, tx) => sum + tx.amount, 0) / thisMonthTransactions.length
        : 0

    // Transaction count
    const transactionCount = thisMonthTransactions.length
    const lastMonthCount = lastMonthTransactions.length
    const countDifference = transactionCount - lastMonthCount

    return {
      highestCategory: highestCategory ? highestCategory[0] : 'N/A',
      highestCategoryAmount,
      highestCategoryPercent,
      thisMonthExpenses,
      lastMonthExpenses,
      expenseDifference,
      expenseChangePercent,
      avgTransaction,
      transactionCount,
      countDifference,
      lastMonthCount,
    }
  }, [])

  return (
    <div className="rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-200/50">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Financial Insights</h2>
        <p className="text-sm font-medium text-slate-500">Intelligent analysis of your monthly activity</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Spending Category */}
        <div className="p-6 rounded-2xl bg-slate-50 ring-1 ring-slate-100 transition-all hover:bg-white hover:ring-emerald-100 group">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 ring-1 ring-emerald-100 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <TrendingDown className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 group-hover:text-emerald-700">Top Spending Category</p>
              <h3 className="text-lg font-bold text-slate-900">{insights.highestCategory}</h3>
              <p className="text-xs font-medium text-slate-500 mt-1">
                {formatCurrency(insights.highestCategoryAmount)} <span className="text-emerald-600 font-bold">({insights.highestCategoryPercent}%)</span> of expenses
              </p>
            </div>
          </div>
        </div>

        {/* Monthly Spending Trend */}
        <div className="p-6 rounded-2xl bg-slate-50 ring-1 ring-slate-100 transition-all hover:bg-white hover:ring-emerald-100 group">
          <div className="flex items-start gap-4">
            <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center ring-1 transition-colors group-hover:text-white",
                insights.expenseDifference > 0 
                  ? "bg-rose-50 text-rose-600 ring-rose-100 group-hover:bg-rose-600" 
                  : "bg-emerald-50 text-emerald-600 ring-emerald-100 group-hover:bg-emerald-600"
            )}>
              <TrendingDown className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Monthly Spending Change</p>
              <h3 className="text-lg font-bold text-slate-900">
                {insights.expenseDifference > 0 ? '+' : ''}{insights.expenseChangePercent}%
              </h3>
              <p className="text-xs font-medium text-slate-500 mt-1">
                vs last month: <span className="font-bold">{formatCurrency(Math.abs(insights.expenseDifference))}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Average Transaction */}
        <div className="p-6 rounded-2xl bg-slate-50 ring-1 ring-slate-100 transition-all hover:bg-white hover:ring-emerald-100 group">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600 ring-1 ring-slate-200 group-hover:bg-emerald-950 group-hover:text-white transition-colors">
              <Target className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Average Transaction</p>
              <h3 className="text-lg font-bold text-slate-900">
                {formatCurrency(insights.avgTransaction)}
              </h3>
              <p className="text-xs font-medium text-slate-500 mt-1">
                <span className="text-emerald-600 font-bold">{insights.transactionCount}</span> verified transactions
              </p>
            </div>
          </div>
        </div>

        {/* Activity Trend */}
        <div className="p-6 rounded-2xl bg-slate-50 ring-1 ring-slate-100 transition-all hover:bg-white hover:ring-emerald-100 group">
          <div className="flex items-start gap-4">
            <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center ring-1 transition-colors group-hover:text-white",
                insights.countDifference > 0 
                  ? "bg-sky-50 text-sky-600 ring-sky-100 group-hover:bg-sky-600" 
                  : "bg-amber-50 text-amber-600 ring-amber-100 group-hover:bg-amber-600"
            )}>
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Activity Velocity</p>
              <h3 className="text-lg font-bold text-slate-900">
                {insights.countDifference > 0 ? '+' : ''}{insights.countDifference}
              </h3>
              <p className="text-xs font-medium text-slate-500 mt-1">
                transactions vs {insights.lastMonthCount} average
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 p-6 rounded-2xl bg-emerald-950 text-white shadow-lg shadow-emerald-900/20">
        <p className="text-sm italic">
          <span className="font-bold uppercase text-emerald-400 mr-2">Zorvyn Insight:</span>
          Your top spending category is <span className="font-bold text-emerald-400 underline decoration-emerald-400/30 underline-offset-4">{insights.highestCategory}</span>. 
          Optimization recommended to maintain your wealth projection.
        </p>
      </div>
    </div>
  )
}
