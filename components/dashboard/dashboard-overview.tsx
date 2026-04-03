'use client'

import { SummaryCard } from './summary-card'
import { useDashboardStore } from '@/lib/store'
import { useMemo, useEffect, useState } from 'react'
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react'

export function DashboardOverview() {
  const { transactions } = useDashboardStore()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const { totalBalance, totalIncome, totalExpenses, incomeThisMonth, expensesThisMonth } = useMemo(() => {
    const now = new Date()
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)

    let balance = 0
    let income = 0
    let expenses = 0
    let incomeThisMonth = 0
    let expensesThisMonth = 0

    transactions.forEach((tx) => {
      const amount = tx.amount
      if (tx.type === 'income') {
        income += amount
        balance += amount

        if (tx.date >= thisMonth && tx.date < nextMonth) {
          incomeThisMonth += amount
        }
      } else {
        expenses += amount
        balance -= amount

        if (tx.date >= thisMonth && tx.date < nextMonth) {
          expensesThisMonth += amount
        }
      }
    })

    return {
      totalBalance: balance,
      totalIncome: income,
      totalExpenses: expenses,
      incomeThisMonth,
      expensesThisMonth,
    }
  }, [])

  const monthlyIncomeLast = useMemo(() => {
    const now = new Date()
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    return transactions
      .filter((tx) => tx.type === 'income' && tx.date >= lastMonth && tx.date < thisMonth)
      .reduce((sum, tx) => sum + tx.amount, 0)
  }, [])

  const monthlyExpensesLast = useMemo(() => {
    const now = new Date()
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1)

    return transactions
      .filter((tx) => tx.type === 'expense' && tx.date >= lastMonth && tx.date < thisMonth)
      .reduce((sum, tx) => sum + tx.amount, 0)
  }, [])

  if (!isMounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="h-32 bg-card rounded-lg animate-pulse" />
        <div className="h-32 bg-card rounded-lg animate-pulse" />
        <div className="h-32 bg-card rounded-lg animate-pulse" />
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <SummaryCard
        title="Total Balance"
        value={totalBalance}
        icon={<DollarSign className="w-6 h-6" />}
        trend={totalBalance > 0 ? 'up' : 'down'}
        change={incomeThisMonth - expensesThisMonth}
        subtext={`${incomeThisMonth > 0 ? '+' : ''}${((incomeThisMonth - expensesThisMonth) / totalBalance * 100).toFixed(1)}% this month`}
        className="md:col-span-1 bg-emerald-950 text-white shadow-emerald-900/20 ring-emerald-900/50"
      />
      <SummaryCard
        title="Total Income"
        value={totalIncome}
        icon={<TrendingUp className="w-6 h-6" />}
        trend={incomeThisMonth > monthlyIncomeLast ? 'up' : 'down'}
        change={incomeThisMonth - monthlyIncomeLast}
      />
      <SummaryCard
        title="Total Expenses"
        value={totalExpenses}
        icon={<TrendingDown className="w-6 h-6" />}
        trend={expensesThisMonth > monthlyExpensesLast ? 'down' : 'up'}
        change={Math.abs(expensesThisMonth - monthlyExpensesLast)}
      />
    </div>
  )
}
