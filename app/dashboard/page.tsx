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

      {/* Footer */}
      <footer className="border-t border-border bg-card py-6 mt-12">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
            <div>
              <h4 className="font-semibold text-foreground mb-2">Features</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Dashboard Analytics</li>
                <li>Transaction Tracking</li>
                <li>Spending Insights</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Technology</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Next.js 16</li>
                <li>React 19</li>
                <li>TypeScript</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Design</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>Modern Fintech Style</li>
                <li>Dark Mode Support</li>
                <li>Responsive Design</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-6">
            <p className="text-sm text-muted-foreground">
              © 2024 Finance Dashboard. Professional financial management interface with role-based access,
              comprehensive analytics, and advanced data visualization. Built for modern fintech applications.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
