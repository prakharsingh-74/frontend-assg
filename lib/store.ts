'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { DashboardStore, UserRole } from './types'

const getDefaultDateRange = () => ({
  from: new Date(new Date().setDate(new Date().getDate() - 90)),
  to: new Date(),
})

const convertDatesToDateObjects = (state: any) => {
  if (state && state.dateRange) {
    return {
      ...state,
      dateRange: {
        from: new Date(state.dateRange.from),
        to: new Date(state.dateRange.to),
      },
    }
  }
  return state
}

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
    }),
    {
      name: 'dashboard-store',
      partialize: (state) => ({
        role: state.role,
        selectedCategory: state.selectedCategory,
        dateRange: {
          from: state.dateRange.from.toISOString(),
          to: state.dateRange.to.toISOString(),
        },
      }),
      onRehydrate: (state) => convertDatesToDateObjects(state),
    }
  )
)
