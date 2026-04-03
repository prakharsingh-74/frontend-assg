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
  ChevronRight,
  CircleUser,
  Sun,
  Moon,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import Link from 'next/link'
import { useTheme } from 'next-themes'

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: any) => void
}

export function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { role, setRole } = useDashboardStore()
  const [isExpanded, setIsExpanded] = useState(false)
  const { resolvedTheme, setTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'transactions', label: 'Transactions', icon: ArrowLeftRight },
    { id: 'insights', label: 'Insights', icon: PieChart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  return (
    <motion.aside 
      initial={false}
      animate={{ width: isExpanded ? 260 : 80 }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="fixed left-0 top-0 z-50 h-screen bg-emerald-950 dark:bg-black text-white shadow-2xl overflow-hidden"
    >
      <div className={cn("flex h-full w-full flex-col transition-all duration-300", isExpanded ? "p-4 md:p-6 items-start" : "p-0 py-8 items-center")}>
        {/* Logo */}
        <div className={cn("mb-10 flex items-center transition-all h-10", isExpanded ? "gap-3 px-1 w-full" : "justify-center w-12")}>
          <Link href="/" className="flex items-center transition-transform hover:scale-105 shrink-0">
            <img src="/zorvyn.jpg" alt="zorvyn" className="h-8 w-auto rounded-lg" />
          </Link>
          <AnimatePresence>
            {isExpanded && (
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="text-xl font-bold tracking-tight whitespace-nowrap"
              >
                Zorvyn
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className={cn("flex-1 space-y-2", isExpanded ? "w-full" : "w-12")}>
          {navItems.map((item) => {
            const isActive = activeTab === item.id
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={cn(
                  "group relative flex h-12 items-center font-bold transition-all rounded-xl",
                  isExpanded ? "w-full gap-4 px-4 justify-start" : "w-12 justify-center px-0",
                  isActive 
                    ? "bg-emerald-600 dark:bg-[#60fcc7]/10 text-white dark:text-[#60fcc7] shadow-lg shadow-emerald-900/40" 
                    : "text-emerald-300/60 hover:bg-emerald-900/50 dark:hover:bg-[#182028] hover:text-emerald-100"
                )}
              >
                <div className={cn("flex h-6 w-6 items-center justify-center shrink-0 transition-all")}>
                  <item.icon className={cn("h-5 w-5 transition-transform group-hover:scale-110", isActive ? "text-white dark:text-[#60fcc7]" : "text-emerald-300/40 group-hover:text-emerald-100")} />
                </div>
                
                <AnimatePresence>
                  {isExpanded && (
                    <motion.span 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="text-sm whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>

                {isActive && isExpanded && (
                  <motion.div 
                    layoutId="active-pill"
                    className="absolute right-2 h-1.5 w-1.5 rounded-full bg-white"
                  />
                )}
              </button>
            )
          })}
        </nav>

        {/* Bottom Section: Theme Toggle + Role Switcher */}
          <div className={cn("mt-auto space-y-3 pt-6 border-t border-emerald-900/50 dark:border-[#182028] overflow-hidden", isExpanded ? "w-full" : "w-12")}>
          {/* Dark mode toggle */}
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className={cn(
              "flex items-center rounded-xl py-2 text-[11px] font-bold transition-all text-emerald-300/60 hover:text-emerald-100 hover:bg-emerald-900/40",
              isExpanded ? "w-full justify-between px-2.5" : "w-12 justify-center px-0"
            )}
          >
            <div className="flex items-center gap-3">
              {isDark ? <Sun className="h-3.5 w-3.5 shrink-0" /> : <Moon className="h-3.5 w-3.5 shrink-0" />}
              {isExpanded && <span className="whitespace-nowrap">{isDark ? 'Light Mode' : 'Dark Mode'}</span>}
            </div>
          </button>
          <div className={cn(
            "rounded-2xl transition-all ring-1",
            isExpanded ? "bg-emerald-900/30 ring-emerald-800/50 p-3" : "bg-transparent ring-transparent p-0"
          )}>
            {isExpanded && (
                <motion.p 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-3 px-1"
                >
                    System Access
                </motion.p>
            )}
            <div className="flex flex-col gap-1.5">
              <button
                onClick={() => setRole('viewer')}
                title="Viewer Mode"
                className={cn(
                  "flex items-center rounded-xl py-2 text-[11px] font-bold transition-all",
                  isExpanded ? "justify-between px-2.5" : "justify-center px-0 w-12",
                  role === 'viewer' ? "bg-white dark:bg-[#60fcc7]/10 dark:text-[#60fcc7] text-emerald-950 shadow-sm" : "text-emerald-300/50 hover:text-emerald-100 hover:bg-emerald-900/40 dark:hover:bg-[#182028]"
                )}
              >
                <div className="flex items-center gap-3">
                  <Eye className="h-3.5 w-3.5 shrink-0" />
                  {isExpanded && <span className="whitespace-nowrap">Viewer</span>}
                </div>
                {role === 'viewer' && isExpanded && <div className="h-1.5 w-1.5 rounded-full bg-emerald-600" />}
              </button>
              
              <button
                onClick={() => setRole('user')}
                title="User Mode"
                className={cn(
                  "flex items-center rounded-xl py-2 text-[11px] font-bold transition-all",
                  isExpanded ? "justify-between px-2.5" : "justify-center px-0 w-12",
                  role === 'user' ? "bg-white dark:bg-[#60fcc7]/10 dark:text-[#60fcc7] text-emerald-950 shadow-sm" : "text-emerald-300/50 hover:text-emerald-100 hover:bg-emerald-900/40 dark:hover:bg-[#182028]"
                )}
              >
                <div className="flex items-center gap-3">
                  <CircleUser className="h-3.5 w-3.5 shrink-0" />
                  {isExpanded && <span className="whitespace-nowrap">User</span>}
                </div>
                {role === 'user' && isExpanded && <div className="h-1.5 w-1.5 rounded-full bg-emerald-600" />}
              </button>

              <button
                onClick={() => setRole('admin')}
                title="Admin Mode"
                className={cn(
                  "flex items-center rounded-xl py-2 text-[11px] font-bold transition-all",
                  isExpanded ? "justify-between px-2.5" : "justify-center px-0 w-12",
                  role === 'admin' ? "bg-white dark:bg-[#60fcc7]/10 dark:text-[#60fcc7] text-emerald-950 shadow-sm" : "text-emerald-300/50 hover:text-emerald-100 hover:bg-emerald-900/40 dark:hover:bg-[#182028]"
                )}
              >
                <div className="flex items-center gap-3">
                  <Shield className="h-3.5 w-3.5 shrink-0" />
                  {isExpanded && <span className="whitespace-nowrap">Admin</span>}
                </div>
                {role === 'admin' && isExpanded && <div className="h-1.5 w-1.5 rounded-full bg-emerald-600" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.aside>
  )
}
