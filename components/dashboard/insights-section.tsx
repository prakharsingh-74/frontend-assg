'use client'

import { Card } from '@/components/ui/card'
import { mockTransactions, formatCurrency } from '@/lib/data'
import { TrendingDown, AlertCircle, Target } from 'lucide-react'
import { useMemo } from 'react'

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
    }
  }, [])

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground">Financial Insights</h2>
        <p className="text-sm text-muted-foreground mt-1">This month&apos;s analysis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Top Spending Category */}
        <div className="p-4 rounded-lg bg-muted border border-border">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-accent" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">Top Spending Category</p>
              <h3 className="text-lg font-semibold text-foreground">{insights.highestCategory}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {formatCurrency(insights.highestCategoryAmount)} ({insights.highestCategoryPercent}% of
                expenses)
              </p>
            </div>
          </div>
        </div>

        {/* Monthly Spending Trend */}
        <div className="p-4 rounded-lg bg-muted border border-border">
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${insights.expenseDifference > 0 ? 'bg-red-100 dark:bg-red-900' : 'bg-green-100 dark:bg-green-900'}`}>
              <TrendingDown
                className={`w-5 h-5 ${insights.expenseDifference > 0 ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'}`}
              />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">Monthly Spending Change</p>
              <h3 className="text-lg font-semibold text-foreground">
                {insights.expenseDifference > 0 ? '+' : ''}{insights.expenseChangePercent}%
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                vs last month: {formatCurrency(Math.abs(insights.expenseDifference))}
              </p>
            </div>
          </div>
        </div>

        {/* Average Transaction */}
        <div className="p-4 rounded-lg bg-muted border border-border">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">Average Transaction</p>
              <h3 className="text-lg font-semibold text-foreground">
                {formatCurrency(insights.avgTransaction)}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {insights.transactionCount} transactions this month
              </p>
            </div>
          </div>
        </div>

        {/* Activity Trend */}
        <div className="p-4 rounded-lg bg-muted border border-border">
          <div className="flex items-start gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${insights.countDifference > 0 ? 'bg-blue-100 dark:bg-blue-900' : 'bg-orange-100 dark:bg-orange-900'}`}>
              <AlertCircle
                className={`w-5 h-5 ${insights.countDifference > 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'}`}
              />
            </div>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-1">Activity Comparison</p>
              <h3 className="text-lg font-semibold text-foreground">
                {insights.countDifference > 0 ? '+' : ''}{insights.countDifference}
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                vs {insights.lastMonthCount} last month
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 rounded-lg bg-accent/5 border border-accent/20">
        <p className="text-sm text-foreground">
          <span className="font-semibold">Pro tip:</span> Your top spending category is{' '}
          <span className="font-semibold text-accent">{insights.highestCategory}</span>. Consider setting
          a budget limit to optimize your spending.
        </p>
      </div>
    </Card>
  )
}
