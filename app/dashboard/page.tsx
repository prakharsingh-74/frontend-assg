'use client'

import { DashboardHeader } from '@/components/dashboard/header'
import { DashboardOverview } from '@/components/dashboard/dashboard-overview'
import { BalanceTrendChart } from '@/components/dashboard/balance-trend-chart'
import { SpendingBreakdown } from '@/components/dashboard/spending-breakdown'
import { TransactionsList } from '@/components/dashboard/transactions-list'
import { InsightsSection } from '@/components/dashboard/insights-section'
import { AdminPanel } from '@/components/dashboard/admin-panel'
import { DateRangeFilter } from '@/components/dashboard/date-range-filter'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <DashboardHeader />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Overview Cards */}
        <section className="mb-8">
          <DashboardOverview />
        </section>

        {/* Admin Panel - Only visible in Admin Mode */}
        <AdminPanel />

        {/* Quick Filters */}
        <section className="mb-8">
          <DateRangeFilter />
        </section>

        {/* Charts Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <BalanceTrendChart />
          <SpendingBreakdown />
        </section>

        {/* Insights Section */}
        <section className="mb-8">
          <InsightsSection />
        </section>

        {/* Transactions Section */}
        <section className="mb-8">
          <TransactionsList />
        </section>
      </main>

    </div>
  )
}
