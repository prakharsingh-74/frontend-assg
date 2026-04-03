'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { DashboardStore, UserRole } from './types'
import { hasPermission, Permission } from './rbac'

const getDefaultDateRange = () => ({
  from: new Date(new Date().setDate(new Date().getDate() - 90)),
  to: new Date(),
})

const convertDatesToDateObjects = (state: any) => {
  if (!state) return state
  
  const newState = { ...state }
  
  if (newState.dateRange) {
    newState.dateRange = {
      from: new Date(newState.dateRange.from),
      to: new Date(newState.dateRange.to),
    }
  }

  if (newState.transactions) {
    newState.transactions = newState.transactions.map((tx: any) => ({
      ...tx,
      date: new Date(tx.date)
    }))
  }

  return newState
}

import { mockTransactions } from './data'

export const useDashboardStore = create<DashboardStore>()(
  persist(
    (set, get) => ({
      role: 'viewer' as UserRole,
      setRole: (role: UserRole) => set({ role }),

      searchQuery: '',
      setSearchQuery: (query: string) => set({ searchQuery: query }),

      selectedCategory: null,
      setSelectedCategory: (category: string | null) => set({ selectedCategory: category }),

      dateRange: getDefaultDateRange(),
      setDateRange: (from: Date, to: Date) => set({ dateRange: { from, to } }),

      transactions: mockTransactions,
      addTransaction: (transaction) => set((state) => {
        // ── Store-level permission enforcement (defense in depth) ──────────
        if (!hasPermission(state.role, Permission.TRANSACTIONS_CREATE)) {
          console.warn(
            `[RBAC] Unauthorized: role "${state.role}" lacks permission "${Permission.TRANSACTIONS_CREATE}"`
          )
          return {}  // reject mutation silently
        }
        const newTransaction = {
          ...transaction,
          id: `TXN${Math.random().toString(36).substr(2, 6).toUpperCase()}`
        }
        return { transactions: [newTransaction, ...state.transactions] }
      }),

      // Mock API
      isLoading: false,
      refreshData: async () => {
        const { role } = get()
        if (!hasPermission(role, Permission.DATA_REFRESH)) {
          console.warn(
            `[RBAC] Unauthorized: role "${role}" lacks permission "${Permission.DATA_REFRESH}"`
          )
          return
        }
        set({ isLoading: true })
        await new Promise((res) => setTimeout(res, 1200))
        const { mockTransactions: fresh } = await import('./data')
        set({ transactions: fresh, isLoading: false })
      },

      // Advanced filtering
      groupBy: 'none' as 'none' | 'category' | 'month',
      setGroupBy: (groupBy: 'none' | 'category' | 'month') => set({ groupBy }),
      amountRange: [0, 10000] as [number, number],
      setAmountRange: (range: [number, number]) => set({ amountRange: range }),

      // ── Authentication ──────────────────────────────────────────────────
      isAuthenticated: false,
      user: null,
      login: async (email, password) => {
        set({ isLoading: true })
        // Simulate network delay
        await new Promise((res) => setTimeout(res, 1000))

        // Hardcoded credentials for the assignment
        if (email === 'admin@zorvyn.com' && password === 'admin123') {
          set({
            isAuthenticated: true,
            user: {
              name: 'Sovereign Admin',
              email: 'admin@zorvyn.com',
              avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
            },
            role: 'admin',
            isLoading: false
          })
          return true
        }

        set({ isLoading: false })
        return false
      },
      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          role: 'viewer' // Reset role on logout
        })
      },
    }),
    {
      name: 'dashboard-store',
      partialize: (state) => ({
        role: state.role,
        isAuthenticated: state.isAuthenticated,
        user: state.user,
        selectedCategory: state.selectedCategory,
        dateRange: {
          from: state.dateRange.from instanceof Date ? state.dateRange.from.toISOString() : state.dateRange.from,
          to: state.dateRange.to instanceof Date ? state.dateRange.to.toISOString() : state.dateRange.to,
        },
        transactions: state.transactions.map(tx => ({
          ...tx,
          date: tx.date instanceof Date ? tx.date.toISOString() : tx.date
        })),
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const converted = convertDatesToDateObjects(state);
          state.dateRange = converted.dateRange;
          state.transactions = converted.transactions;
        }
      },
    }
  )
)
