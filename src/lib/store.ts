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
  
  try {
    if (newState.dateRange) {
      newState.dateRange = {
        from: new Date(newState.dateRange.from || new Date().setDate(new Date().getDate() - 90)),
        to: new Date(newState.dateRange.to || new Date()),
      }
    }

    if (newState.transactions) {
      newState.transactions = newState.transactions.map((tx: any) => ({
        ...tx,
        date: new Date(tx.date || new Date()),
        amount: Number(tx.amount) || 0
      }))
    }
  } catch (e) {
    console.error('[Store] Failed to rehydrate dates:', e)
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
        // ── Store-level sanitization & validation ──────────────────────────
        const merchant = transaction.merchant?.trim() || 'Untitled Transaction'
        const amount = Number(transaction.amount) || 0

        // ── Store-level permission enforcement ──────────
        if (!hasPermission(state.role, Permission.TRANSACTIONS_CREATE)) {
          console.warn(`[RBAC] Unauthorized: role "${state.role}" lacks permission.`)
          return {}
        }

        const newTransaction = {
          ...transaction,
          merchant,
          amount,
          id: `TXN${Math.random().toString(36).substr(2, 6).toUpperCase()}`
        }
        return { transactions: [newTransaction, ...state.transactions] }
      }),

      // Mock API
      isLoading: false,
      isRefreshing: false,
      error: null,
      setError: (error: string | null) => set({ error }),
      refreshData: async () => {
        const { role } = get()
        if (!hasPermission(role, Permission.DATA_REFRESH)) {
          set({ error: 'You do not have permission to refresh data.' })
          return
        }

        set({ isRefreshing: true, error: null })
        try {
          // Simulate network delay
          await new Promise((res) => setTimeout(res, 1200))
          
          // Randomly simulate a mock failure for demonstration (10% chance)
          if (Math.random() < 0.1) {
            throw new Error('Database connection timed out')
          }

          const { mockTransactions: fresh } = await import('./data')
          set({ transactions: fresh, isRefreshing: false })
        } catch (err: any) {
          set({ error: err.message || 'Failed to sync with server', isRefreshing: false })
        }
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
        set({ isLoading: true, error: null })
        try {
          await new Promise((res) => setTimeout(res, 1000))
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
        } catch (err) {
          set({ error: 'Authentication engine error. Please try again.' })
        }

        set({ isLoading: false })
        return false
      },
      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token')
        }
        set({
          isAuthenticated: false,
          user: null,
          role: 'viewer',
          error: null,
          searchQuery: '',
          selectedCategory: null
        })
      },
      _hasHydrated: false,
      setHasHydrated: (state) => set({ _hasHydrated: state }),
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
          try {
            const converted = convertDatesToDateObjects(state);
            state.dateRange = converted.dateRange;
            state.transactions = converted.transactions;
            state.setHasHydrated(true)
          } catch (e) {
            console.error('[Store] Rehydration Critical Error:', e)
            state.setHasHydrated(true) // Set to true even on error so UI can proceed
          }
        }
      },
    }
  )
)
