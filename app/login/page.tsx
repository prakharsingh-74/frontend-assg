'use client'

import React from 'react'
import Link from 'next/link'
import { ArrowLeft, ShieldCheck, Mail, Lock, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate login
    setTimeout(() => {
      router.push('/dashboard')
    }, 1500)
  }

  return (
    <div className="flex min-h-screen flex-col bg-white md:flex-row font-sans">
      {/* Left side: Branding (Desktop only) */}
      <div className="relative hidden w-full flex-col justify-between bg-emerald-950 p-12 text-white md:flex md:w-1/2 lg:w-2/5 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,#10b981_0%,transparent_70%)] opacity-20" />
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-teal-500/10 blur-3xl" />
        
        <Link href="/" className="relative z-10 flex items-center transition-transform hover:scale-105">
            <img src="/zorvyn.jpg" alt="zorvyn" className="h-10 w-auto" />
        </Link>

        <div className="relative z-10 space-y-6">
          <h1 className="text-5xl font-semibold leading-tight tracking-tight">
            Managing your money
            <br />
            should be this easy.
          </h1>
          <p className="max-w-md text-lg text-emerald-100/80">
            Log in to access your dashboard, track transactions, and take control of your financial future with zorvyn.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-sm text-emerald-200/60">
          <div className="rounded-full bg-emerald-800/50 p-1.5 ring-1 ring-white/10">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <span>AES-256 Grade Security Architecture</span>
        </div>
      </div>

      {/* Right side: Login form */}
      <div className="flex flex-1 flex-col justify-center px-6 py-12 md:px-12 lg:px-20 bg-[#F3F5F7]">
        <div className="mx-auto w-full max-w-md space-y-8 bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-slate-200/50 ring-1 ring-slate-200/50">
          <div className="space-y-2">
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
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-slate-500 ml-1" htmlFor="email">
                  Email address
                </label>
                <div className="relative">
                    <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    <input
                      id="email"
                      placeholder="e.g. name@company.com"
                      className="flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-11 py-2 text-sm ring-offset-white transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                      type="email"
                      required
                    />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-500" htmlFor="password">
                    Password
                  </label>
                  <a href="#" className="text-xs font-medium text-emerald-600 hover:text-emerald-700">
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                    <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                    <input
                      id="password"
                      placeholder="••••••••"
                      className="flex h-11 w-full rounded-xl border border-slate-200 bg-slate-50/50 px-11 py-2 text-sm ring-offset-white transition-all placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-4 focus:ring-emerald-500/10"
                      type="password"
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
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-100" />
            </div>
            <div className="relative flex justify-center text-xs uppercase letter-spacing-widest">
              <span className="bg-white px-4 text-slate-400 font-medium">Or continue with</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
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
          </div>

          <p className="px-4 text-center text-xs text-slate-400">
            By signing in, you agree to our{' '}
            <a href="#" className="underline hover:text-emerald-600 transition-colors">Terms of Service</a>{' '}
            and{' '}
            <a href="#" className="underline hover:text-emerald-600 transition-colors">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  )
}
