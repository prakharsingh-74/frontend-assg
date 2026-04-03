'use client'

import { motion } from 'framer-motion'
import { DashboardHeader } from '@/components/dashboard/header'
import { DashboardOverview } from '@/components/dashboard/dashboard-overview'
import { BalanceTrendChart } from '@/components/dashboard/balance-trend-chart'
import { SpendingBreakdown } from '@/components/dashboard/spending-breakdown'
import { TransactionsList } from '@/components/dashboard/transactions-list'
import { InsightsSection } from '@/components/dashboard/insights-section'
import { AdminPanel } from '@/components/dashboard/admin-panel'
import { DateRangeFilter } from '@/components/dashboard/date-range-filter'

export default function DashboardPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
  }

  return (
    <div className="min-h-screen bg-[#F3F5F7] text-slate-900 font-sans">
      <DashboardHeader />

      <motion.main 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto px-4 py-8 max-w-7xl"
      >
        {/* Overview Cards */}
        <motion.section variants={itemVariants} className="mb-8">
          <DashboardOverview />
        </motion.section>

        {/* Admin Panel - Only visible in Admin Mode */}
        <motion.section variants={itemVariants}>
            <AdminPanel />
        </motion.section>

        {/* Quick Filters */}
        <motion.section variants={itemVariants} className="mb-8">
          <DateRangeFilter />
        </motion.section>

        {/* Charts Section */}
        <motion.section variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <BalanceTrendChart />
          <SpendingBreakdown />
        </motion.section>

        {/* Insights Section */}
        <motion.section variants={itemVariants} className="mb-8">
          <InsightsSection />
        </motion.section>

        {/* Transactions Section */}
        <motion.section variants={itemVariants} className="mb-8">
          <TransactionsList />
        </motion.section>
      </motion.main>
    </div>
  )
}
