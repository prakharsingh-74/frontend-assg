'use client'

import React from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck } from 'lucide-react'

interface AuthContainerProps {
  children: React.ReactNode
  isSignup?: boolean
}

export function AuthContainer({ children, isSignup = false }: AuthContainerProps) {
  return (
    <div className="h-screen w-full overflow-hidden bg-white font-sans">
      <div 
        className={`flex h-full w-full transition-all duration-700 ease-in-out ${isSignup ? 'flex-col md:flex-row-reverse' : 'flex-col md:flex-row'}`}
      >
        {/* Branding Side */}
        <motion.div 
          layoutId="branding-sidebar"
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          className="relative hidden w-full flex-col justify-between bg-emerald-950 p-12 text-white md:flex md:w-1/2 lg:w-2/5 overflow-hidden"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#10b981_0%,transparent_70%)] opacity-20" />
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl" />
          
          <Link href="/" className="relative z-10 flex items-center transition-transform hover:scale-105">
              <img src="/zorvyn.jpg" alt="zorvyn" className="h-10 w-auto" />
          </Link>

          <AnimatePresence mode="wait">
            <motion.div 
              key={isSignup ? 'signup-text' : 'login-text'}
              initial={{ opacity: 0, x: isSignup ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isSignup ? -20 : 20 }}
              transition={{ duration: 0.4 }}
              className="relative z-10 space-y-6"
            >
              <h1 className="text-5xl font-semibold leading-tight tracking-tight">
                {isSignup ? (
                  <>Start your journey<br />to financial freedom.</>
                ) : (
                  <>Managing your money<br />should be this easy.</>
                )}
              </h1>
              <p className="max-w-md text-lg text-emerald-100/80">
                {isSignup 
                  ? "Join over a million users who trust zorvyn for their daily banking and long-term financial growth."
                  : "Log in to access your dashboard, track transactions, and take control of your financial future with zorvyn."}
              </p>
            </motion.div>
          </AnimatePresence>

          <div className="relative z-10 flex items-center gap-4 text-sm text-emerald-200/60">
            <div className="rounded-full bg-emerald-800/50 p-1.5 ring-1 ring-white/10">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <span>
                {isSignup 
                    ? "Instant account setup with zero hidden fees"
                    : "AES-256 Grade Security Architecture"}
            </span>
          </div>
        </motion.div>

        {/* Form Side */}
        <motion.div 
          layoutId="form-area"
          transition={{ type: 'spring', stiffness: 200, damping: 25 }}
          className="flex flex-1 flex-col justify-center px-6 py-8 md:px-12 lg:px-20 bg-[#F3F5F7]"
        >
           <AnimatePresence mode="wait">
             <motion.div
               key={isSignup ? 'signup-form-container' : 'login-form-container'}
               initial={{ opacity: 0, x: isSignup ? -20 : 20 }}
               animate={{ opacity: 1, x: 0 }}
               exit={{ opacity: 0, x: isSignup ? 20 : -20 }}
               transition={{ duration: 0.4 }}
               className="mx-auto w-full max-w-md bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-slate-200/50 ring-1 ring-slate-200/50"
             >
               {children}
             </motion.div>
           </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
