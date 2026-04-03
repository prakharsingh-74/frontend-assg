'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { DashboardStore, UserRole } from './types'

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
    (set) => ({
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
        const newTransaction = {
          ...transaction,
          id: `TXN${Math.random().toString(36).substr(2, 6).toUpperCase()}`
        }
        return { transactions: [newTransaction, ...state.transactions] }
      }),

      // Mock API
      isLoading: false,
      refreshData: async () => {
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
    }),
    {
      name: 'dashboard-store',
      partialize: (state) => ({
        role: state.role,
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
