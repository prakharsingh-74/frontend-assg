'use client'

import React, { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useDashboardStore } from '@/lib/store'
import { Loader2, ShieldCheck, ShieldAlert } from 'lucide-react'

interface AuthGuardProps {
  children: React.ReactNode
}

/**
 * ── AuthGuard ───────────────────────────────────────────────────────────
 *  Protects internal routes from unauthorized access.
 *  Checks 'isAuthenticated' from the persistent Zustand store.
 * ─────────────────────────────────────────────────────────────────────────
 */
export function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, _hasHydrated } = useDashboardStore()
  const [isVerifying, setIsVerifying] = useState(true)

  useEffect(() => {
    // Wait for the store to rehydrate from localStorage
    if (!_hasHydrated) return

    const verifyAuth = async () => {
      if (!isAuthenticated) {
        console.warn(`[AuthGuard] Access denied to ${pathname}. Redirecting to /login.`)
        // Final fallback delay before redirecting
        const timeoutId = setTimeout(() => {
          router.push('/login')
        }, 500)
        return () => clearTimeout(timeoutId)
      } else {
        // We have a session!
        setIsVerifying(false)
      }
    }

    verifyAuth()
  }, [isAuthenticated, _hasHydrated, router, pathname])

  // While checking auth, show a premium Sovereign Analyst loading state
  if (isVerifying) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#090f15] dark">
        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           className="relative flex flex-col items-center gap-6 text-center"
        >
          {/* Animated hex pulse effect */}
          <div className="relative">
            <motion.div 
               animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
               transition={{ duration: 2, repeat: Infinity }}
               className="absolute -inset-4 rounded-full bg-emerald-500/20 blur-xl"
            />
            <div className="relative h-16 w-16 flex items-center justify-center rounded-2xl bg-[#182028] ring-1 ring-[#60fcc7]/30 shadow-2xl">
              <ShieldCheck className="h-8 w-8 text-[#60fcc7] animate-pulse" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="font-display text-xl font-bold tracking-tight text-[#e6ebf4]">
               Verifying Identity
            </h2>
            <p className="flex items-center gap-2 text-sm font-medium text-slate-500">
              <Loader2 className="h-3 w-3 animate-spin text-[#60fcc7]" />
              Establishing secure session...
            </p>
          </div>
        </motion.div>
      </div>
    )
  }

  return <>{children}</>
}
