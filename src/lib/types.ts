export type UserRole = 'viewer' | 'user' | 'admin'

export interface Transaction {
  id: string
  date: Date
  amount: number
  category: 'Salary' | 'Groceries' | 'Transport' | 'Utilities' | 'Entertainment' | 'Healthcare' | 'Other'
  type: 'income' | 'expense'
  description: string
  merchant?: string
}

export interface DashboardMetrics {
  totalBalance: number
  totalIncome: number
  totalExpenses: number
  balanceTrend: Array<{
    date: string
    balance: number
  }>
  categoryBreakdown: Array<{
    category: string
    amount: number
    percentage: number
  }>
}

export interface DashboardStore {
  role: UserRole
  setRole: (role: UserRole) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  selectedCategory: string | null
  setSelectedCategory: (category: string | null) => void
  dateRange: { from: Date; to: Date }
  setDateRange: (from: Date, to: Date) => void
  transactions: Transaction[]
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void
  // Mock API
  isLoading: boolean
  isRefreshing: boolean
  error: string | null
  setError: (error: string | null) => void
  refreshData: () => Promise<void>
  // Advanced filtering & grouping
  groupBy: 'none' | 'category' | 'month'
  setGroupBy: (groupBy: 'none' | 'category' | 'month') => void
  amountRange: [number, number]
  setAmountRange: (range: [number, number]) => void

  // ── Authentication ──────────────────────────────────────────────────────
  isAuthenticated: boolean
  user: { name: string; email: string; avatar?: string } | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  _hasHydrated: boolean
  setHasHydrated: (state: boolean) => void
}
