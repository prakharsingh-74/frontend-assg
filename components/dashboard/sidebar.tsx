'use client'

import { useDashboardStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { 
  LayoutDashboard, 
  ArrowLeftRight, 
  PieChart, 
  Settings, 
  Shield, 
  Eye,
  LogOut,
  ChevronRight
} from 'lucide-react'
import { motion } from 'framer-motion'
import Link from 'next/link'

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: any) => void
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { role, setRole } = useDashboardStore()

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
    { id: 'insights', label: 'Insights', icon: PieChart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <aside className="fixed left-0 top-0 z-50 h-screen w-64 bg-emerald-950 text-white shadow-2xl">
      <div className="flex h-full flex-col p-6">
        {/* Logo */}
        <div className="mb-10 flex items-center gap-3">
          <Link href="/" className="flex items-center transition-transform hover:scale-105">
            <img src="/zorvyn.jpg" alt="zorvyn" className="h-8 w-auto rounded-lg" />
          </Link>
          <span className="text-xl font-bold tracking-tight">Zorvyn</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "group relative flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all",
                  isActive 
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-900/40" 
                    : "text-emerald-300/60 hover:bg-emerald-900/50 hover:text-emerald-100"
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive ? "text-white" : "text-emerald-300/40 group-hover:text-emerald-100")} />
                {item.label}
                {isActive && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute right-2 h-1.5 w-1.5 rounded-full bg-white"
                  />
                )}
              </button>
            )
          })}
        </nav>

        {/* Bottom Section: Role Switcher & User */}
        <div className="mt-auto space-y-6 pt-6 border-t border-emerald-900/50">
          <div className="rounded-2xl bg-emerald-900/30 p-4 ring-1 ring-emerald-800/50">
            <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-3">System Access</p>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setRole('viewer')}
                className={cn(
                  "flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-all",
                  role === 'viewer' ? "bg-white text-emerald-950" : "text-emerald-300/60 hover:text-emerald-100"
                )}
              >
                <div className="flex items-center gap-2">
                  <Eye className="h-3.5 w-3.5" />
                  Viewer
                </div>
                {role === 'viewer' && <div className="h-1.5 w-1.5 rounded-full bg-emerald-600" />}
              </button>
              <button
                onClick={() => setRole('admin')}
                className={cn(
                  "flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold transition-all",
                  role === 'admin' ? "bg-white text-emerald-950" : "text-emerald-300/60 hover:text-emerald-100"
                )}
              >
                <div className="flex items-center gap-2">
                  <Shield className="h-3.5 w-3.5" />
                  Admin
                </div>
                {role === 'admin' && <div className="h-1.5 w-1.5 rounded-full bg-emerald-600" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
