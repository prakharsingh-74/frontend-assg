'use client'

import { Card } from '@/components/ui/card'
import { useDashboardStore } from '@/lib/store'
import { formatCurrency } from '@/lib/data'
import { TrendingDown, AlertCircle, Target, Calendar, Search } from 'lucide-react'
import { useMemo } from 'react'
import { cn } from '@/lib/utils'

export function InsightsSection() {
  const { transactions } = useDashboardStore()
  
  const insights = useMemo(() => {
    if (!transactions.length) return null

    const now = new Date()
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1)

    // This month transactions
    const thisMonthTransactions = transactions.filter(
      (tx) => tx.date >= thisMonth && tx.date < nextMonthStart
    )

    // Last month transactions
    const lastMonthTransactions = transactions.filter(
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
      lastMonthExpenses > 0 ? ((expenseDifference / lastMonthExpenses) * 100).toFixed(1) : (thisMonthExpenses > 0 ? "100" : "0")

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
  }, [transactions])

  if (!insights) {
    return (
      <div className="rounded-3xl bg-white dark:bg-slate-800 p-8 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 ring-1 ring-slate-200/50 dark:ring-slate-700/50 min-h-[400px] flex flex-col items-center justify-center text-center">
        <div className="mb-4 rounded-full bg-slate-50 dark:bg-slate-700/50 p-6 ring-1 ring-slate-100 dark:ring-slate-600">
          <Search className="h-8 w-8 text-slate-300 dark:text-slate-500" />
        </div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">No signals detected</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 max-w-[280px]">
          We couldn't generate any financial insights based on your current transaction history. 
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-3xl bg-white dark:bg-slate-800 p-8 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 ring-1 ring-slate-200/50 dark:ring-slate-700/50">
      <div className="mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Financial Insights</h2>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Intelligent analysis of your monthly activity</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top Spending Category */}
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-700/40 ring-1 ring-slate-100 dark:ring-slate-600 transition-all hover:bg-white dark:hover:bg-slate-700 hover:ring-emerald-100 dark:hover:ring-emerald-500/30 group">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-100 dark:ring-emerald-500/20 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <TrendingDown className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 group-hover:text-emerald-700 dark:group-hover:text-emerald-300">Top Spending Category</p>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{insights.highestCategory}</h3>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                {formatCurrency(insights.highestCategoryAmount)} <span className="text-emerald-600 dark:text-emerald-400 font-bold">({insights.highestCategoryPercent}%)</span> of expenses
              </p>
            </div>
          </div>
        </div>

        {/* Monthly Spending Trend */}
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-700/40 ring-1 ring-slate-100 dark:ring-slate-600 transition-all hover:bg-white dark:hover:bg-slate-700 hover:ring-emerald-100 dark:hover:ring-emerald-500/30 group">
          <div className="flex items-start gap-4">
            <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center ring-1 transition-colors group-hover:text-white",
                insights.expenseDifference > 0 
                  ? "bg-rose-50 text-rose-600 ring-rose-100 dark:bg-rose-900/40 dark:text-rose-400 dark:ring-rose-500/20 group-hover:bg-rose-600" 
                  : "bg-emerald-50 text-emerald-600 ring-emerald-100 dark:bg-emerald-900/40 dark:text-emerald-400 dark:ring-emerald-500/20 group-hover:bg-emerald-600"
            )}>
              <TrendingDown className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Monthly Spending Change</p>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {insights.expenseDifference > 0 ? '+' : ''}{insights.expenseChangePercent}%
              </h3>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                vs last month: <span className="font-bold">{formatCurrency(Math.abs(insights.expenseDifference))}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Average Transaction */}
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-700/40 ring-1 ring-slate-100 dark:ring-slate-600 transition-all hover:bg-white dark:hover:bg-slate-700 hover:ring-emerald-100 dark:hover:ring-emerald-500/30 group">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-600 dark:text-slate-300 ring-1 ring-slate-200 dark:ring-slate-600 group-hover:bg-emerald-950 group-hover:text-white transition-colors">
              <Target className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Average Transaction</p>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {formatCurrency(insights.avgTransaction)}
              </h3>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{insights.transactionCount}</span> verified transactions
              </p>
            </div>
          </div>
        </div>

        {/* Activity Trend */}
        <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-700/40 ring-1 ring-slate-100 dark:ring-slate-600 transition-all hover:bg-white dark:hover:bg-slate-700 hover:ring-emerald-100 dark:hover:ring-emerald-500/30 group">
          <div className="flex items-start gap-4">
            <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center ring-1 transition-colors group-hover:text-white",
                insights.countDifference > 0 
                  ? "bg-sky-50 text-sky-600 ring-sky-100 dark:bg-sky-900/40 dark:text-sky-400 dark:ring-sky-500/20 group-hover:bg-sky-600" 
                  : "bg-amber-50 text-amber-600 ring-amber-100 dark:bg-amber-900/40 dark:text-amber-400 dark:ring-amber-500/20 group-hover:bg-amber-600"
            )}>
              <AlertCircle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">Activity Velocity</p>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                {insights.countDifference > 0 ? '+' : ''}{insights.countDifference}
              </h3>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
                transactions vs {insights.lastMonthCount} average
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 p-6 rounded-2xl bg-emerald-950 dark:bg-emerald-900/40 text-white shadow-lg shadow-emerald-900/20 ring-1 ring-emerald-500/20">
        <p className="text-sm italic">
          <span className="font-bold uppercase text-emerald-400 mr-2">Zorvyn Insight:</span>
          Your top spending category is <span className="font-bold text-emerald-400 underline decoration-emerald-400/30 underline-offset-4">{insights.highestCategory}</span>. 
          Optimization recommended to maintain your wealth projection.
        </p>
      </div>
    </div>
  )
}
