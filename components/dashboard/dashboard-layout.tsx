'use client'

import { Sidebar } from './sidebar'
import { motion, AnimatePresence } from 'framer-motion'
import { useDashboardStore } from '@/lib/store'
import { useState } from 'react'

interface DashboardLayoutProps {
  children: React.ReactNode
  activeTab: string
  setActiveTab: (tab: any) => void
}

export function DashboardLayout({ children, activeTab, setActiveTab }: DashboardLayoutProps) {
  const { role } = useDashboardStore()

  return (
    <div className="flex min-h-screen bg-[#F3F5F7]">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="ml-64 flex-1 transition-all">
        <div className="mx-auto max-w-7xl p-8">
          <header className="mb-10 flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              key={activeTab}
            >
              <h1 className="text-4xl font-black tracking-tight text-emerald-950 capitalize">{activeTab}</h1>
              <p className="mt-1 text-sm font-bold text-slate-400">
                {activeTab === 'overview' && 'Your financial health at a glance'}
                {activeTab === 'transactions' && 'Manage your spending history'}
                {activeTab === 'insights' && 'Deep dive into your financial patterns'}
                {activeTab === 'settings' && 'System configuration and access control'}
              </p>
            </motion.div>

            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 uppercase font-black text-emerald-600">
                {role === 'admin' ? 'AD' : 'VW'}
              </div>
            </div>
          </header>

          <div className="relative h-full">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
