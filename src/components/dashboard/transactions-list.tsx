'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useDashboardStore } from '@/lib/store'
import { formatCurrency, formatDate, CATEGORIES } from '@/lib/data'
import { useMemo, useState } from 'react'
import {
  ChevronUp,
  ChevronDown,
  Search,
  X,
  Filter,
  Plus,
  Download,
  RefreshCw,
  Layers,
  ChevronRight,
  Lock,
  AlertCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import type { Transaction } from '@/lib/types'
import { usePermissions } from '@/hooks/use-permissions'
import { PermissionGuard } from '@/components/rbac/permission-guard'
import { Permission } from '@/lib/rbac'

type SortKey = 'date' | 'amount'
type SortOrder = 'asc' | 'desc'

/* ─── CSV / JSON export helpers ─────────────────────────────── */
function exportCSV(transactions: Transaction[]) {
  const header = 'ID,Date,Merchant,Category,Type,Amount'
  const rows = transactions.map((tx) =>
    [tx.id, tx.date.toISOString().split('T')[0], `"${tx.merchant || tx.description}"`, tx.category, tx.type, tx.amount].join(',')
  )
  const blob = new Blob([[header, ...rows].join('\n')], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'zorvyn-transactions.csv'
  a.click()
  URL.revokeObjectURL(url)
}

function exportJSON(transactions: Transaction[]) {
  const data = transactions.map((tx) => ({ ...tx, date: tx.date.toISOString() }))
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'zorvyn-transactions.json'
  a.click()
  URL.revokeObjectURL(url)
}

/* ─── Category colour map ────────────────────────────────────── */
const CAT_COLORS: Record<string, string> = {
  Salary: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  Groceries: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  Transport: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  Utilities: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  Entertainment: 'bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-300',
  Healthcare: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  Other: 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300',
}

/* ─── Skeleton loader ────────────────────────────────────────── */
function SkeletonRow() {
  return (
    <tr>
      {[1, 2, 3, 4].map((i) => (
        <td key={i} className="py-4 px-4">
          <div className="h-4 rounded-lg bg-slate-100 dark:bg-slate-700 animate-pulse" style={{ width: `${60 + i * 10}%` }} />
        </td>
      ))}
    </tr>
  )
}

/* ─── Main component ─────────────────────────────────────────── */
export function TransactionsList() {
  const {
    transactions,
    addTransaction,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    dateRange,
    isLoading,
    isRefreshing,
    error,
    setError,
    refreshData,
    groupBy,
    setGroupBy,
    amountRange,
    setAmountRange,
  } = useDashboardStore()

  // ── RBAC: use the permissions hook instead of raw role checks ──
  const { can, role } = usePermissions()

  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)

  // Form State for New Transaction
  const [newTx, setNewTx] = useState({
    merchant: '',
    amount: '',
    category: 'Other' as Transaction['category'],
    type: 'expense' as 'income' | 'expense',
  })
  const [formError, setFormError] = useState<string | null>(null)

  const itemsPerPage = 8

  /* ─── Filtered + sorted list ─────────────────────────────── */
  const filteredTransactions = useMemo(() => {
    let filtered = transactions.filter((tx) => {
      // Safety check for date rehydration issues
      if (!(tx.date instanceof Date)) return false
      
      if (tx.date < dateRange.from || tx.date > dateRange.to) return false
      if (selectedCategory && tx.category !== selectedCategory) return false
      if (tx.amount < amountRange[0] || tx.amount > amountRange[1]) return false
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        return (
          tx.merchant?.toLowerCase().includes(query) ||
          tx.description.toLowerCase().includes(query) ||
          tx.id.toLowerCase().includes(query)
        )
      }
      return true
    })

    filtered.sort((a, b) => {
      const aVal = sortKey === 'date' ? a.date.getTime() : a.amount
      const bVal = sortKey === 'date' ? b.date.getTime() : b.amount
      const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      return sortOrder === 'desc' ? -comparison : comparison
    })

    return filtered
  }, [transactions, searchQuery, selectedCategory, dateRange, sortKey, sortOrder, amountRange])

  /* ─── Grouped data ──────────────────────────────────────── */
  const groupedData = useMemo(() => {
    if (groupBy === 'none') return null
    const groups: Record<string, Transaction[]> = {}
    filteredTransactions.forEach((tx) => {
      const key =
        groupBy === 'category'
          ? tx.category
          : tx.date.toLocaleString('default', { month: 'long', year: 'numeric' })
      if (!groups[key]) groups[key] = []
      groups[key].push(tx)
    })
    return groups
  }, [filteredTransactions, groupBy])

  const paginatedTransactions = useMemo(() => {
    if (groupBy !== 'none') return filteredTransactions
    const start = (currentPage - 1) * itemsPerPage
    return filteredTransactions.slice(start, start + itemsPerPage)
  }, [filteredTransactions, currentPage, groupBy])

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortKey(key)
      setSortOrder('desc')
    }
  }

  const handleAddTransaction = (e: React.FormEvent) => {
    e.preventDefault()
    setFormError(null)

    const merchant = newTx.merchant.trim()
    const amount = parseFloat(newTx.amount)

    // Robust Validation
    if (!merchant) {
      setFormError('Merchant name is required.')
      return
    }
    if (isNaN(amount) || amount <= 0) {
      setFormError('Please enter a valid amount greater than 0.')
      return
    }

    addTransaction({
      ...newTx,
      merchant,
      amount,
      date: new Date(),
      description: `${newTx.category} at ${merchant}`,
    })
    setIsAddModalOpen(false)
    setNewTx({ merchant: '', amount: '', category: 'Other', type: 'expense' })
    setFormError(null)
  }

  /* ─── Row renderer ──────────────────────────────────────── */
  const renderRow = (tx: Transaction, idx: number) => (
    <motion.tr
      key={tx.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ delay: idx * 0.015 }}
      className="group hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors"
    >
      <td className="py-4 pl-0 pr-4 text-xs font-semibold text-slate-400 dark:text-slate-500">
        {formatDate(tx.date)}
      </td>
      <td className="py-4 px-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-slate-700 font-bold text-slate-600 dark:text-slate-300 ring-1 ring-slate-200 dark:ring-slate-600 transition-colors group-hover:bg-emerald-600 group-hover:text-white group-hover:ring-emerald-600">
            {(tx.merchant || tx.description).charAt(0)}
          </div>
          <div>
            <p className="text-sm font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 transition-colors">
              {tx.merchant || tx.description}
            </p>
            <p className="text-[10px] font-medium text-slate-400 dark:text-slate-500 uppercase tracking-tighter">
              ID: {tx.id.slice(0, 8)}
            </p>
          </div>
        </div>
      </td>
      <td className="py-4 px-4">
        <span className={cn('inline-flex items-center rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-tight ring-1 ring-inset', CAT_COLORS[tx.category] || CAT_COLORS.Other, 'ring-current/20')}>
          {tx.category}
        </span>
      </td>
      <td className={cn('py-4 pl-4 pr-0 text-right text-sm font-bold tabular-nums', tx.type === 'income' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-900 dark:text-slate-100')}>
        {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
      </td>
    </motion.tr>
  )

  /* ─── Table head ─────────────────────────────────────────── */
  const TableHead = () => (
    <thead>
      <tr className="border-b border-slate-100 dark:border-slate-700">
        <th className="pb-4 pl-0 pr-4 font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 text-[10px]">
          <button onClick={() => toggleSort('date')} className="flex items-center gap-1 hover:text-emerald-600 transition-colors">
            Date
            {sortKey === 'date' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
          </button>
        </th>
        <th className="pb-4 px-4 font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 text-[10px]">Merchant</th>
        <th className="pb-4 px-4 font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 text-[10px]">Category</th>
        <th className="pb-4 pl-4 pr-0 font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 text-[10px] text-right">
          <button onClick={() => toggleSort('amount')} className="ml-auto flex items-center gap-1 hover:text-emerald-600 transition-colors">
            Amount
            {sortKey === 'amount' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
          </button>
        </th>
      </tr>
    </thead>
  )

  /* ─── Render ─────────────────────────────────────────────── */
  return (
    <div className="rounded-3xl bg-white dark:bg-slate-800 p-8 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 ring-1 ring-slate-200/50 dark:ring-slate-700/50 font-sans relative overflow-hidden">
      
      {/* Error Banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-rose-50 dark:bg-rose-950/20 border-b border-rose-100 dark:border-rose-500/10 px-8 py-3 -mx-8 -mt-8 mb-8 flex items-center justify-between group"
          >
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center">
                <Lock className="h-4 w-4 text-rose-600 dark:text-rose-400" />
              </div>
              <p className="text-sm font-bold text-rose-700 dark:text-rose-300">{error}</p>
            </div>
            <button
               onClick={() => setError(null)}
               className="p-2 hover:bg-rose-100 dark:hover:bg-rose-900/30 rounded-xl transition-colors"
            >
              <X className="h-4 w-4 text-rose-400" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Recent Transactions</h2>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Track and manage your global spending</p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative min-w-[200px] flex-1 md:flex-none">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="Search merchants..."
                className="h-10 rounded-xl border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-700/50 pl-10 dark:text-slate-100 dark:placeholder:text-slate-400 focus:border-emerald-500 focus:ring-emerald-500/10"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1) }}
              />
            </div>

            {/* Category filter */}
            <Select value={selectedCategory || 'all'} onValueChange={(v) => { setSelectedCategory(v === 'all' ? null : v); setCurrentPage(1) }}>
              <SelectTrigger className="h-10 w-[150px] rounded-xl border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-700/50 dark:text-slate-100">
                <div className="flex items-center gap-2">
                  <Filter className="h-3.5 w-3.5 text-slate-400" />
                  <SelectValue placeholder="Categories" />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200 dark:border-slate-700">
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
              </SelectContent>
            </Select>

            {/* Group By */}
            <Select value={groupBy} onValueChange={(v: any) => setGroupBy(v)}>
              <SelectTrigger className="h-10 w-[140px] rounded-xl border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-700/50 dark:text-slate-100">
                <div className="flex items-center gap-2">
                  <Layers className="h-3.5 w-3.5 text-slate-400" />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl dark:border-slate-700 z-[110]">
                <SelectItem value="none">No Grouping</SelectItem>
                <SelectItem value="category">By Category</SelectItem>
                <SelectItem value="month">By Month</SelectItem>
              </SelectContent>
            </Select>

            {/* Refresh (mock API) — requires DATA_REFRESH permission */}
            <PermissionGuard permission={Permission.DATA_REFRESH}>
              <Button
                variant="outline"
                size="icon"
                onClick={() => refreshData()}
                disabled={isLoading}
                title="Refresh data from API"
                className="h-10 w-10 rounded-xl border-slate-200 dark:border-slate-600 dark:bg-slate-700/50 dark:text-slate-100"
              >
                <RefreshCw className={cn('h-4 w-4', isLoading && 'animate-spin text-emerald-500')} />
              </Button>
            </PermissionGuard>

            {/* Export — requires TRANSACTIONS_EXPORT permission */}
            <PermissionGuard
              permission={Permission.TRANSACTIONS_EXPORT}
              fallback={
                <span className="inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-bold text-slate-300 dark:text-[#a6abb4]/50 cursor-not-allowed" title="Export unavailable for your role">
                  <Lock className="h-3.5 w-3.5" />
                  Export
                </span>
              }
            >
              <div className="relative">
                <Button
                  variant="outline"
                  onClick={() => setShowExportMenu((v) => !v)}
                  className="h-10 rounded-xl border-slate-200 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-700/50 dark:text-slate-100 gap-2 font-bold px-4"
                >
                  <Download className="h-4 w-4" />
                  Export
                  <ChevronDown className="h-3 w-3" />
                </Button>
                <AnimatePresence>
                  {showExportMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-12 z-[120] w-40 rounded-2xl border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl p-1.5"
                      onMouseLeave={() => setShowExportMenu(false)}
                    >
                      <PermissionGuard permission={Permission.DATA_EXPORT_CSV}>
                        <button
                          onClick={() => { exportCSV(filteredTransactions); setShowExportMenu(false) }}
                          className="w-full text-left rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                          📄 Export CSV
                        </button>
                      </PermissionGuard>
                      <PermissionGuard permission={Permission.DATA_EXPORT_JSON}>
                        <button
                          onClick={() => { exportJSON(filteredTransactions); setShowExportMenu(false) }}
                          className="w-full text-left rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                        >
                          📦 Export JSON
                        </button>
                      </PermissionGuard>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </PermissionGuard>

            {/* Add Transaction — requires TRANSACTIONS_CREATE permission */}
            <PermissionGuard
              permission={Permission.TRANSACTIONS_CREATE}
              fallback={
                <span
                  className="inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-bold text-slate-300 dark:text-[#a6abb4]/40 cursor-not-allowed"
                  title={`Add Transaction requires 'user' or 'admin' role. Current: '${role}'`}
                >
                  <Lock className="h-4 w-4" />
                  Add Transaction
                </span>
              }
            >
              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="h-10 bg-emerald-600 hover:bg-emerald-700 dark:bg-gradient-to-r dark:from-[#60fcc7] dark:to-[#19ce9c] dark:text-[#003d2c] text-white rounded-xl gap-2 font-bold px-4"
              >
                <Plus className="h-4 w-4" />
                Add Transaction
              </Button>
            </PermissionGuard>
          </div>
        </div>

        {/* Advanced filter: Amount Range */}
        <div>
          <button
            onClick={() => setShowAdvanced((v) => !v)}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            <ChevronRight className={cn('h-3.5 w-3.5 transition-transform', showAdvanced && 'rotate-90')} />
            Advanced Filters
          </button>
          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700">
                  <div className="flex-1 w-full">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-2">
                      Amount Range: <span className="text-emerald-600 dark:text-emerald-400">${amountRange[0]} – ${amountRange[1]}</span>
                    </p>
                    <div className="flex items-center gap-3">
                      <Input
                        type="number"
                        min={0}
                        max={amountRange[1]}
                        value={amountRange[0]}
                        onChange={(e) => setAmountRange([Number(e.target.value), amountRange[1]])}
                        placeholder="Min"
                        className="h-8 rounded-lg text-xs border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-slate-100 w-24"
                      />
                      <span className="text-slate-300 dark:text-slate-600">—</span>
                      <Input
                        type="number"
                        min={amountRange[0]}
                        value={amountRange[1]}
                        onChange={(e) => setAmountRange([amountRange[0], Number(e.target.value)])}
                        placeholder="Max"
                        className="h-8 rounded-lg text-xs border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 dark:text-slate-100 w-24"
                      />
                      <Button
                        variant="link"
                        className="text-xs text-slate-400 dark:text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 p-0 h-auto"
                        onClick={() => setAmountRange([0, 10000])}
                      >
                        Reset
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 rounded-3xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <RefreshCw className="h-8 w-8 text-emerald-500 animate-spin" />
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Refreshing from API…</p>
          </div>
        </div>
      )}

      {/* Transactions Table */}
      <div className="overflow-x-auto bg-white dark:bg-slate-800 min-h-[400px]">
        {filteredTransactions.length > 0 ? (
          groupBy !== 'none' && groupedData ? (
            // ──── Grouped view ────
            <div className="space-y-8">
              {Object.entries(groupedData).map(([group, txs]) => (
                <motion.div key={group} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <div className="flex items-center gap-3 mb-3">
                    <span className={cn('text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full', CAT_COLORS[group] || 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300')}>
                      {group}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">{txs.length} transactions · {formatCurrency(txs.reduce((s, t) => s + (t.type === 'income' ? t.amount : -t.amount), 0))} net</span>
                  </div>
                  <table className="w-full text-left min-w-[600px]">
                    <TableHead />
                    <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                      <AnimatePresence mode="popLayout">
                        {txs.map((tx, idx) => renderRow(tx, idx))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </motion.div>
              ))}
            </div>
          ) : (
            // ──── Flat view ────
            <table className="w-full text-left min-w-[600px]">
              <TableHead />
              <tbody className="divide-y divide-slate-50 dark:divide-slate-700/50">
                {isLoading
                  ? Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)
                  : (
                    <AnimatePresence mode="popLayout">
                      {paginatedTransactions.map((tx, idx) => renderRow(tx, idx))}
                    </AnimatePresence>
                  )}
              </tbody>
            </table>
          )
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-700 rounded-full flex items-center justify-center mb-4 ring-1 ring-slate-100 dark:ring-slate-600">
              <Search className="h-6 w-6 text-slate-300 dark:text-slate-500" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">No transactions found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-[240px] mt-1">Try adjusting your filters or search query.</p>
            {(searchQuery || selectedCategory || amountRange[0] > 0 || amountRange[1] < 10000) && (
              <Button variant="link" className="text-emerald-600 dark:text-emerald-400 font-bold mt-4" onClick={() => { setSearchQuery(''); setSelectedCategory(null); setAmountRange([0, 10000]) }}>
                Clear all filters
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Pagination (flat view only) */}
      {groupBy === 'none' && totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between border-t border-slate-100 dark:border-slate-700 pt-6">
          <p className="text-xs font-medium text-slate-400 dark:text-slate-500">
            Showing <span className="font-bold text-slate-900 dark:text-slate-100">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
            <span className="font-bold text-slate-900 dark:text-slate-100">{Math.min(currentPage * itemsPerPage, filteredTransactions.length)}</span> of{' '}
            <span className="font-bold text-slate-900 dark:text-slate-100">{filteredTransactions.length}</span> results
          </p>
          <div className="flex gap-2">
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1} className="rounded-xl border border-slate-200 dark:border-slate-600 px-4 py-2 text-xs font-bold dark:text-slate-200 transition-all hover:bg-slate-50 dark:hover:bg-slate-700 disabled:opacity-50">Previous</button>
            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} className="rounded-xl bg-emerald-900 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-emerald-800 disabled:opacity-50">Next</button>
          </div>
        </div>
      )}

      {/* Add Transaction Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-emerald-950/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-8 w-full max-w-md shadow-2xl dark:ring-1 dark:ring-slate-700"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold text-emerald-950 dark:text-slate-100">Add Transaction</h3>
                  <p className="text-xs font-medium text-slate-400 dark:text-slate-500">Create a new manual entry</p>
                </div>
                <button onClick={() => setIsAddModalOpen(false)} className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-700 flex items-center justify-center text-slate-400 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAddTransaction} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Merchant / Description</label>
                  <Input required placeholder="e.g. Starbucks, Amazon" value={newTx.merchant} onChange={(e) => setNewTx({ ...newTx, merchant: e.target.value })} className="h-12 rounded-xl border-slate-100 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-700/50 dark:text-slate-100" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Amount ($)</label>
                    <Input required type="number" step="0.01" placeholder="0.00" value={newTx.amount} onChange={(e) => setNewTx({ ...newTx, amount: e.target.value })} className="h-12 rounded-xl border-slate-100 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-700/50 dark:text-slate-100" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Type</label>
                    <Select value={newTx.type} onValueChange={(val: any) => setNewTx({ ...newTx, type: val })}>
                      <SelectTrigger className="h-12 rounded-xl border-slate-100 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-700/50 dark:text-slate-100">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl z-[110] dark:border-slate-700">
                        <SelectItem value="expense">Expense</SelectItem>
                        <SelectItem value="income">Income</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 ml-1">Category</label>
                  <Select value={newTx.category} onValueChange={(val: any) => setNewTx({ ...newTx, category: val })}>
                    <SelectTrigger className="h-12 rounded-xl border-slate-100 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-700/50 dark:text-slate-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl z-[110] dark:border-slate-700">
                      {CATEGORIES.map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>

                {/* Validation Error Display */}
                <AnimatePresence>
                  {formError && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/20 text-[11px] font-bold text-rose-600 dark:text-rose-400 ring-1 ring-rose-100 dark:ring-rose-500/10"
                    >
                      <AlertCircle className="h-3.5 w-3.5" />
                      {formError}
                    </motion.div>
                  )}
                </AnimatePresence>

                <Button type="submit" className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-600/20 mt-4">
                  Confirm Transaction
                </Button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
