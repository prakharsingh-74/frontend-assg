'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowLeft, Mail, Lock, Loader2, Info } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { AuthContainer } from '@/components/auth/auth-container'
import { useDashboardStore } from '@/lib/store'

export default function LoginPage() {
  const router = useRouter()
  const { login, isAuthenticated } = useDashboardStore()
  const [isLoading, setIsLoading] = React.useState(false)
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard')
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    try {
      const success = await login(email, password)
      if (success) {
        // Success animation handled by state change or manual delay
        setTimeout(() => {
          router.push('/dashboard')
        }, 800)
      } else {
        setError('Invalid credentials. Please use admin@zorvyn.com / admin123')
      }
    } catch (err) {
      setError('An error occurred during authentication.')
    } finally {
      setIsLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  }

  const demoBox = (
    <div 
      className="rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-100/50 dark:border-emerald-500/10 p-4 relative overflow-hidden group shadow-sm"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500/50 group-hover:bg-emerald-500 transition-colors" />
      <div className="flex gap-3 items-start">
        <div className="h-8 w-8 rounded-xl bg-white dark:bg-emerald-900/40 flex items-center justify-center shrink-0 border border-emerald-100 dark:border-emerald-500/20 shadow-sm">
          <Info className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="space-y-1">
          <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-700 dark:text-emerald-400">Demo Access</p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-1 text-sm">
             <div className="flex items-center gap-1.5">
               <span className="text-slate-400 font-medium">User:</span>
               <code className="bg-white dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-slate-100 dark:border-emerald-500/10 text-emerald-900 dark:text-emerald-300 font-bold select-all">admin@zorvyn.com</code>
             </div>
             <div className="flex items-center gap-1.5">
               <span className="text-slate-400 font-medium">Pass:</span>
               <code className="bg-white dark:bg-emerald-950/40 px-1.5 py-0.5 rounded border border-slate-100 dark:border-emerald-500/10 text-emerald-900 dark:text-emerald-300 font-bold select-all">admin123</code>
             </div>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <AuthContainer isSignup={false} footer={demoBox}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        <motion.div variants={itemVariants} className="space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors mb-4 group">
              <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to website
          </Link>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">Welcome back</h2>
          <p className="text-sm text-slate-600">
            New to zorvyn?{' '}
            <Link href="/signup" className="font-medium text-emerald-600 hover:text-emerald-700 underline">
              Create an account
            </Link>
          </p>
        </motion.div>

        <motion.form variants={itemVariants} onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <motion.div 
               initial={{ opacity: 0, height: 0 }}
               animate={{ opacity: 1, height: 'auto' }}
               className="bg-rose-50 border border-rose-100 rounded-xl p-3 flex items-center gap-3"
            >
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-rose-100 flex items-center justify-center">
                <Lock className="h-4 w-4 text-rose-600" />
              </div>
              <p className="text-sm font-medium text-rose-700">{error}</p>
            </motion.div>
          )}

          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1" htmlFor="email">
                Email address
              </label>
              <div className="relative">
                  <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    id="email"
                    placeholder="e.g. admin@zorvyn.com"
                    className="flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-11 py-2 text-sm text-slate-950 ring-offset-white transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500" htmlFor="password">
                  Password
                </label>
                <a href="#" className="text-xs font-medium text-emerald-600 hover:text-emerald-700 font-display">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    id="password"
                    placeholder="••••••••"
                    className="flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-11 py-2 text-sm text-slate-950 ring-offset-white transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="group relative flex w-full items-center justify-center overflow-hidden rounded-full bg-emerald-900 px-4 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:bg-emerald-800 hover:shadow-emerald-900/20 active:scale-[0.98] disabled:opacity-70"
          >
            <div className="absolute inset-0 flex h-full w-full justify-center [transform:skew(-12deg)_translateX(-100%)] group-hover:duration-1000 group-hover:[transform:skew(-12deg)_translateX(100%)]">
              <div className="relative h-full w-8 bg-white/20" />
            </div>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Verifying...
              </>
            ) : (
              'Sign In to Dashboard'
            )}
          </button>
        </motion.form>

        <motion.div variants={itemVariants} className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-100" />
          </div>
          <div className="relative flex justify-center text-xs uppercase letter-spacing-widest">
            <span className="bg-white px-4 text-slate-400 font-medium">Or continue with</span>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.07-3.71 1.07-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                  <path d="M5.84 14.11c-.22-.67-.35-1.39-.35-2.11s.13-1.44.35-2.11V6.93H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 5.07l3.66-2.96z" fill="#FBBC05"/>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
          </button>
          <button className="flex w-full items-center justify-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.164 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.92.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z"/>
              </svg>
              GitHub
          </button>
        </motion.div>

        <motion.p variants={itemVariants} className="px-4 text-center text-xs text-slate-400">
          By signing in, you agree to our{' '}
          <a href="#" className="underline hover:text-emerald-600 transition-colors">Terms of Service</a>{' '}
          and{' '}
          <a href="#" className="underline hover:text-emerald-600 transition-colors">Privacy Policy</a>.
        </motion.p>
      </motion.div>
    </AuthContainer>
  )
}
