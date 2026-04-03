'use client'

import { Sidebar } from './sidebar'
import { motion, AnimatePresence } from 'framer-motion'
import { useDashboardStore } from '@/lib/store'
import { useState } from 'react'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { LogOut, User, Settings as SettingsIcon } from 'lucide-react'

interface DashboardLayoutProps {
  children: React.ReactNode
  activeTab: string
  setActiveTab: (tab: any) => void
}

export function DashboardLayout({ children, activeTab, setActiveTab }: DashboardLayoutProps) {
  const { role } = useDashboardStore()

  return (
    <div className="flex min-h-screen bg-[#F3F5F7] dark:bg-[#090f15] transition-colors duration-300">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="ml-20 flex-1 transition-all">
        <div className="mx-auto max-w-7xl p-8">
          <header className="mb-10 flex items-center justify-between">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              key={activeTab}
            >
              <h1 className="font-display text-4xl font-extrabold tracking-tight text-emerald-950 dark:text-[#e6ebf4] capitalize">{activeTab}</h1>
              <p className="mt-1 text-sm font-medium text-slate-400 dark:text-[#a6abb4]">
                {activeTab === 'overview' && 'Your financial health at a glance'}
                {activeTab === 'transactions' && 'Manage your spending history'}
                {activeTab === 'insights' && 'Deep dive into your financial patterns'}
                {activeTab === 'settings' && 'System configuration and access control'}
              </p>
            </motion.div>

            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white dark:bg-[#182028] shadow-sm ring-1 ring-slate-200 dark:ring-0 dark:[outline:1px_solid_rgba(66,72,80,0.20)] transition-all hover:ring-emerald-300 dark:hover:bg-[#242d37] hover:shadow-md active:scale-95 group overflow-hidden">
                    <Avatar className="h-full w-full rounded-none">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${role}`} />
                      <AvatarFallback className="bg-white font-black text-emerald-600">
                        {role === 'admin' ? 'AD' : 'VW'}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-2xl p-2 shadow-[0px_24px_48px_rgba(0,0,0,0.50)] border-slate-200/50 dark:border-0 dark:[outline:1px_solid_rgba(66,72,80,0.20)] dark:bg-[rgba(24,32,40,0.90)] dark:backdrop-blur-[24px]">
                  <DropdownMenuLabel className="px-3 py-2">
                    <p className="text-sm font-black text-emerald-950">Zorvyn User</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{role} Account</p>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-slate-100" />
                  <DropdownMenuItem 
                    onClick={() => setActiveTab('profile')}
                    className="rounded-xl px-3 py-2.5 gap-2 cursor-pointer transition-colors focus:bg-emerald-50 focus:text-emerald-950 font-bold text-slate-600"
                  >
                    <User className="h-4 w-4 text-emerald-600/50" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-slate-100" />
                  <DropdownMenuItem 
                    onClick={() => window.location.href = '/'}
                    className="rounded-xl px-3 py-2.5 gap-2 cursor-pointer transition-colors focus:bg-rose-50 focus:text-rose-600 font-bold text-rose-500"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
