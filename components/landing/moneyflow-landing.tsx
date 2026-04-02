'use client'

import { ShieldCheck, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="space-y-1">
    <div className="text-3xl font-semibold tracking-tight text-slate-900">{value}</div>
    <div className="text-sm text-slate-500">{label}</div>
  </div>
)

const SoftButton = ({ children, className = '', href, ...props }: any) => {
  const buttonClass =
    'rounded-full px-5 py-2.5 text-sm font-medium shadow-sm transition focus:outline-none focus:ring-2 focus:ring-offset-2 ' +
    'bg-emerald-900 text-white hover:bg-emerald-800 focus:ring-emerald-700 ' +
    className

  if (href) {
    return (
      <Link href={href} className={buttonClass}>
        {children}
      </Link>
    )
  }

  return (
    <button className={buttonClass} {...props}>
      {children}
    </button>
  )
}

function MiniBars() {
  return (
    <div className="mt-6 flex h-36 items-end gap-4 rounded-xl bg-gradient-to-b from-emerald-50 to-white p-4">
      {[18, 48, 72, 96].map((h, i) => (
        <div
          key={i}
          style={{
            height: `${h}px`,
            animation: `slideUp 0.6s ease-out ${0.5 + i * 0.15}s forwards`,
            opacity: 0,
          }}
          className="w-10 rounded-xl bg-gradient-to-t from-emerald-200 to-emerald-400 shadow-inner"
        />
      ))}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0.6; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

function Planet() {
  return (
    <>
      <style>{`
        @keyframes rotatePlanet {
          from { transform: rotate(-8deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes pulseSatellite {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
        @keyframes drawOrbit {
          from { stroke-dashoffset: 200; }
          to { stroke-dashoffset: 0; }
        }
        .planet-svg {
          animation: rotatePlanet 2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .planet-orbit {
          animation: drawOrbit 3s linear infinite;
        }
        .planet-satellite {
          animation: pulseSatellite 2.2s ease-in-out infinite;
        }
      `}</style>
      <svg
        className="planet-svg"
        width="220"
        height="220"
        viewBox="0 0 220 220"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
        <circle cx="110" cy="110" r="56" fill="url(#grad)" opacity="0.95" />
        <circle cx="94" cy="98" r="10" fill="white" opacity="0.45" />
        <circle cx="132" cy="126" r="8" fill="white" opacity="0.35" />
        <ellipse
          className="planet-orbit"
          cx="110"
          cy="110"
          rx="100"
          ry="34"
          stroke="white"
          strokeOpacity="0.6"
          fill="none"
          strokeDasharray="200 200"
        />
        <circle
          className="planet-satellite"
          cx="210"
          cy="110"
          r="4"
          fill="white"
        />
      </svg>
    </>
  )
}

export function ZorvynLandingPage() {
  return (
    <>
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-ring {
          0%, 100% {
            box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.35);
          }
          50% {
            box-shadow: 0 0 0 16px rgba(16, 185, 129, 0);
          }
        }
      `}</style>
      <div className="min-h-screen w-full bg-[#F3F5F7]">
      {/* Top nav */}
      <nav className="mx-auto flex w-full max-w-[1180px] items-center justify-between px-4 py-6 md:px-0">
        <div className="flex items-center">
          <img src="/zorvyn.jpg" alt="zorvyn" className="h-8 w-auto" />
        </div>
        <div className="hidden items-center gap-8 md:flex">
          {['Solutions', 'Product', 'Company', 'Insight'].map((item) => (
            <a
              key={item}
              href="#"
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              {item}
            </a>
          ))}
        </div>
        <div className="hidden gap-2 md:flex">
          <Link href="/login" className="rounded-full px-4 py-2 text-sm text-slate-700 hover:bg-white">
            Login
          </Link>
          <SoftButton href="/signup">Sign Up</SoftButton>
        </div>
      </nav>

      {/* Hero area */}
      <div className="mx-auto grid w-full max-w-[1180px] grid-cols-1 gap-6 px-4 pb-14 md:grid-cols-2 md:px-0">
        {/* Left: headline */}
        <div className="flex flex-col justify-center space-y-8 pr-2">
          <div>
            <h1 className="text-5xl font-semibold leading-[1.05] tracking-tight text-slate-900 md:text-6xl">
              Secure your money
              <br />
              with precision.
            </h1>
            <p className="mt-4 max-w-md text-slate-600">
              Join over a million people who choose{' '}
              <span className="font-medium text-slate-900">zorvyn</span> for managing their finances.
            </p>
          </div>

          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <SoftButton href="/login">
              Open Account <ArrowUpRight className="ml-1 inline h-4 w-4" />
            </SoftButton>
          </div>

          <div className="grid grid-cols-2 gap-8 pt-2 md:max-w-sm">
            <Stat label="Total Currencies" value="140+" />
            <Stat label="Revenue Generated" value="$1.2B" />
          </div>

          <div className="mt-6 flex items-center gap-8 opacity-70">
            <span className="text-xs text-slate-500">TRUSTED BY THE BEST</span>
            <div className="flex items-center gap-6 text-slate-400">
              <span className="font-semibold">loom</span>
              <span className="font-semibold">HubSpot</span>
              <span className="font-semibold">ramp</span>
            </div>
          </div>
        </div>

        {/* Right: animated card grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Secure card */}
          <div
            style={{
              animation: 'fadeInUp 0.6s ease-out 0.1s forwards',
              opacity: 0,
            }}
            className="relative col-span-1 overflow-hidden rounded-xl bg-gradient-to-b from-emerald-900 to-emerald-800 p-6 text-emerald-50 shadow-lg"
          >
            <div className="absolute inset-0">
              <svg
                className="absolute inset-0 h-full w-full opacity-30"
                viewBox="0 0 400 400"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <radialGradient id="rg" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#22d3aa" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="transparent" />
                  </radialGradient>
                </defs>
                <rect width="400" height="400" fill="url(#rg)" />
                {[...Array(12)].map((_, i) => (
                  <circle
                    key={i}
                    cx="200"
                    cy="200"
                    r={20 + i * 14}
                    fill="none"
                    stroke="currentColor"
                    strokeOpacity="0.12"
                  />
                ))}
              </svg>
            </div>

            <div className="relative flex h-full flex-col justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-emerald-700/60 p-2 ring-1 ring-white/10">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <span className="text-xs uppercase tracking-wider text-emerald-200">
                  Extra Secure
                </span>
              </div>
              <div className="mt-6 text-xl leading-snug text-emerald-50/95">
                Fraud and security
                <br /> keep your money safe
              </div>
              <div
                style={{
                  animation: 'pulse-ring 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                }}
                className="absolute right-6 top-6 h-12 w-12 rounded-full bg-emerald-600/40"
              />
            </div>
          </div>

          {/* Currencies card */}
          <div
            style={{
              animation: 'fadeInUp 0.6s ease-out 0.2s forwards',
              opacity: 0,
            }}
            className="relative col-span-1 overflow-hidden rounded-xl bg-gradient-to-b from-teal-400 to-emerald-500 p-6 text-white shadow-lg"
          >
            <div className="pointer-events-none absolute -right-8 -top-10 opacity-70">
              <Planet />
            </div>
            <div className="relative mt-24 text-sm text-white/90">Currencies</div>
            <div className="text-xl font-medium leading-snug">
              Hundreds of
              <br /> countries in one card
            </div>
          </div>

          {/* Growth card */}
          <div
            style={{
              animation: 'fadeInUp 0.6s ease-out 0.3s forwards',
              opacity: 0,
            }}
            className="col-span-1 rounded-xl bg-white p-6 text-slate-800 shadow-lg ring-1 ring-slate-200"
          >
            <div className="text-sm text-slate-500">Growth Revenue</div>
            <div className="mt-2 text-3xl font-semibold tracking-tight">
              $50,240{' '}
              <span className="text-sm font-medium text-slate-400 align-middle">USD</span>
            </div>
            <div className="mt-1 text-xs text-emerald-600">↑ 0.024%</div>
            <MiniBars />
          </div>

          <div className="hidden md:block" />
        </div>
      </div>

      <footer className="mx-auto w-full max-w-[1180px] px-4 pb-10 text-center text-xs text-slate-400 md:px-0">
        © {new Date().getFullYear()} zorvyn, Inc. All rights reserved.
      </footer>
      </div>
    </>
  )
}
