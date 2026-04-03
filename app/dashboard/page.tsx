'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { DashboardOverview } from '@/components/dashboard/dashboard-overview'
import { BalanceTrendChart } from '@/components/dashboard/balance-trend-chart'
import { SpendingBreakdown } from '@/components/dashboard/spending-breakdown'
import { TransactionsList } from '@/components/dashboard/transactions-list'
import { InsightsSection } from '@/components/dashboard/insights-section'
import { AdminPanel } from '@/components/dashboard/admin-panel'
import { DateRangeFilter } from '@/components/dashboard/date-range-filter'
import { ProfileSettings } from '@/components/dashboard/profile-settings'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'insights' | 'settings' | 'profile'>('overview')

  return (
    <DashboardLayout activeTab={activeTab} setActiveTab={setActiveTab}>
      <AnimatePresence mode="wait">
        {activeTab === 'overview' && (
          <motion.div
            key="overview"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <DashboardOverview />
            <div className="grid grid-cols-1 gap-8">
              <DateRangeFilter />
              <BalanceTrendChart />
            </div>
          </motion.div>
        )}

        {activeTab === 'transactions' && (
          <motion.div
            key="transactions"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <TransactionsList />
          </motion.div>
        )}

        {activeTab === 'insights' && (
          <motion.div
            key="insights"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-8"
          >
            <DateRangeFilter />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <SpendingBreakdown />
              <InsightsSection />
            </div>
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <AdminPanel />
            <div className="mt-8 rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-200/50">
              <h3 className="text-xl font-bold text-emerald-950 mb-4">Account Preferences</h3>
              <p className="text-slate-500 mb-6 font-medium">Manage your security settings and dashboard customization options.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 italic text-slate-400 text-sm">
                  Notification settings coming soon...
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 italic text-slate-400 text-sm">
                  Security logs coming soon...
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'profile' && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <ProfileSettings />
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  )
}
