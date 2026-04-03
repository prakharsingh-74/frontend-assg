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
import { ChevronUp, ChevronDown, Search, X, Filter, Plus } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

type SortKey = 'date' | 'amount'
type SortOrder = 'asc' | 'desc'

export function TransactionsList() {
  const { 
    transactions, 
    addTransaction, 
    role,
    searchQuery, 
    setSearchQuery, 
    selectedCategory, 
    setSelectedCategory, 
    dateRange 
  } = useDashboardStore()
  
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  
  // Form State for New Transaction
  const [newTx, setNewTx] = useState({
    merchant: '',
    amount: '',
    category: 'Other' as any,
    type: 'expense' as 'income' | 'expense'
  })

  const itemsPerPage = 8

  const filteredTransactions = useMemo(() => {
    let filtered = transactions.filter((tx) => {
      if (tx.date < dateRange.from || tx.date > dateRange.to) return false
      if (selectedCategory && tx.category !== selectedCategory) return false
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
      let aVal = sortKey === 'date' ? a.date.getTime() : a.amount
      let bVal = sortKey === 'date' ? b.date.getTime() : b.amount
      const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      return sortOrder === 'desc' ? -comparison : comparison
    })

    return filtered
  }, [transactions, searchQuery, selectedCategory, dateRange, sortKey, sortOrder])

  const paginatedTransactions = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    return filteredTransactions.slice(start, start + itemsPerPage)
  }, [filteredTransactions, currentPage])

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
    addTransaction({
      ...newTx,
      amount: parseFloat(newTx.amount),
      date: new Date(),
      description: `${newTx.category} at ${newTx.merchant}`
    })
    setIsAddModalOpen(false)
    setNewTx({ merchant: '', amount: '', category: 'Other', type: 'expense' })
  }

  return (
    <div className="rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/50 ring-1 ring-slate-200/50 font-sans relative">
      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Recent Transactions</h2>
          <p className="text-sm font-medium text-slate-500">Track and manage your global spending</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px] flex-1 md:flex-none">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="Search merchants..."
              className="h-10 rounded-xl border-slate-200 bg-slate-50/50 pl-10 focus:border-emerald-500 focus:ring-emerald-500/10"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
            />
          </div>

          <Select
            value={selectedCategory || 'all'}
            onValueChange={(value) => {
              setSelectedCategory(value === 'all' ? null : value)
              setCurrentPage(1)
            }}
          >
            <SelectTrigger className="h-10 w-[140px] rounded-xl border-slate-200 bg-slate-50/50 focus:ring-emerald-500/10">
              <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5 text-slate-400" />
                <SelectValue placeholder="Categories" />
              </div>
            </SelectTrigger>
            <SelectContent className="rounded-xl border-slate-200">
              <SelectItem value="all">All Categories</SelectItem>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {role === 'admin' && (
            <Button 
              onClick={() => setIsAddModalOpen(true)}
              className="h-10 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl gap-2 font-bold px-4"
            >
              <Plus className="h-4 w-4" />
              Add Transaction
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-x-auto bg-white min-h-[400px]">
        {filteredTransactions.length > 0 ? (
          <table className="w-full text-left min-w-[600px]">
             <thead>
               <tr className="border-b border-slate-100">
                 <th className="pb-4 pl-0 pr-4 font-bold uppercase tracking-wider text-slate-400 text-[10px]">
                   <button onClick={() => toggleSort('date')} className="flex items-center gap-1 hover:text-emerald-600 transition-colors">
                     Date
                     {sortKey === 'date' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                   </button>
                 </th>
                 <th className="pb-4 px-4 font-bold uppercase tracking-wider text-slate-400 text-[10px]">Merchant</th>
                 <th className="pb-4 px-4 font-bold uppercase tracking-wider text-slate-400 text-[10px]">Category</th>
                 <th className="pb-4 pl-4 pr-0 font-bold uppercase tracking-wider text-slate-400 text-[10px] text-right">
                   <button onClick={() => toggleSort('amount')} className="ml-auto flex items-center gap-1 hover:text-emerald-600 transition-colors">
                     Amount
                     {sortKey === 'amount' && (sortOrder === 'asc' ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />)}
                   </button>
                 </th>
               </tr>
             </thead>
             <tbody className="divide-y divide-slate-50">
               <AnimatePresence mode="popLayout">
                 {paginatedTransactions.map((tx, idx) => (
                   <motion.tr
                     key={tx.id}
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, scale: 0.95 }}
                     transition={{ delay: idx * 0.02 }}
                     className="group hover:bg-slate-50/80 transition-colors"
                   >
                     <td className="py-4 pl-0 pr-4 text-xs font-semibold text-slate-400">{formatDate(tx.date)}</td>
                     <td className="py-4 px-4">
                       <div className="flex items-center gap-3">
                           <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 font-bold text-slate-600 ring-1 ring-slate-200 transition-colors group-hover:bg-emerald-600 group-hover:text-white group-hover:ring-emerald-600">
                               {(tx.merchant || tx.description).charAt(0)}
                           </div>
                           <div>
                               <p className="text-sm font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">{tx.merchant || tx.description}</p>
                               <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tighter">ID: {tx.id.slice(0, 8)}</p>
                           </div>
                       </div>
                     </td>
                     <td className="py-4 px-4">
                       <span className="inline-flex items-center rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 uppercase tracking-tight ring-1 ring-slate-200 transition-colors group-hover:bg-white">
                         {tx.category}
                       </span>
                     </td>
                     <td className={cn(
                       "py-4 pl-4 pr-0 text-right text-sm font-bold tabular-nums",
                       tx.type === 'income' ? 'text-emerald-600' : 'text-slate-900'
                     )}>
                       {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                     </td>
                   </motion.tr>
                 ))}
               </AnimatePresence>
             </tbody>
           </table>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 ring-1 ring-slate-100">
              <Search className="h-6 w-6 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No transactions found</h3>
            <p className="text-sm text-slate-500 max-w-[240px] mt-1">Try adjusting your filters or search query to find what you're looking for.</p>
            {(searchQuery || selectedCategory) && (
                <Button 
                    variant="link" 
                    className="text-emerald-600 font-bold mt-4"
                    onClick={() => {
                        setSearchQuery('')
                        setSelectedCategory(null)
                    }}
                >
                    Clear all filters
                </Button>
            )}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
          <p className="text-xs font-medium text-slate-400">
            Showing <span className="font-bold text-slate-900">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
            <span className="font-bold text-slate-900">{Math.min(currentPage * itemsPerPage, filteredTransactions.length)}</span> of{' '}
            <span className="font-bold text-slate-900">{filteredTransactions.length}</span> results
          </p>
          <div className="flex gap-2">
            <button
               onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
               disabled={currentPage === 1}
               className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold transition-all hover:bg-slate-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
               onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
               disabled={currentPage === totalPages}
               className="rounded-xl bg-emerald-900 px-4 py-2 text-xs font-bold text-white transition-all hover:bg-emerald-800 disabled:opacity-50"
            >
              Next
            </button>
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
              className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-bold text-emerald-950">Add Transaction</h3>
                  <p className="text-xs font-medium text-slate-400">Create a new manual entry</p>
                </div>
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAddTransaction} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Merchant / Description</label>
                  <Input 
                    required
                    placeholder="e.g. Starbucks, Amazon"
                    value={newTx.merchant}
                    onChange={e => setNewTx({...newTx, merchant: e.target.value})}
                    className="h-12 rounded-xl border-slate-100 bg-slate-50/50"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Amount ($)</label>
                    <Input 
                      required
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={newTx.amount}
                      onChange={e => setNewTx({...newTx, amount: e.target.value})}
                      className="h-12 rounded-xl border-slate-100 bg-slate-50/50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Type</label>
                    <Select 
                      value={newTx.type}
                      onValueChange={(val: any) => setNewTx({...newTx, type: val})}
                    >
                      <SelectTrigger className="h-12 rounded-xl border-slate-100 bg-slate-50/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl z-[110]">
                        <SelectItem value="expense">Expense</SelectItem>
                        <SelectItem value="income">Income</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Category</label>
                  <Select 
                    value={newTx.category}
                    onValueChange={(val: any) => setNewTx({...newTx, category: val})}
                  >
                    <SelectTrigger className="h-12 rounded-xl border-slate-100 bg-slate-50/50">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl z-[110]">
                      {CATEGORIES.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

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
