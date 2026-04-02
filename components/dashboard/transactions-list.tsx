'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useDashboardStore } from '@/lib/store'
import { mockTransactions, formatCurrency, formatDate, CATEGORIES } from '@/lib/data'
import { useMemo, useState } from 'react'
import { ChevronUp, ChevronDown, Search, X } from 'lucide-react'
import type { Transaction } from '@/lib/types'

type SortKey = 'date' | 'amount'
type SortOrder = 'asc' | 'desc'

export function TransactionsList() {
  const { searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, dateRange } = useDashboardStore()
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const filteredTransactions = useMemo(() => {
    let filtered = mockTransactions.filter((tx) => {
      // Date range filter
      if (tx.date < dateRange.from || tx.date > dateRange.to) {
        return false
      }

      // Category filter
      if (selectedCategory && tx.category !== selectedCategory) {
        return false
      }

      // Search filter
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

    // Sorting
    filtered.sort((a, b) => {
      let aVal: number | Date
      let bVal: number | Date

      if (sortKey === 'date') {
        aVal = a.date
        bVal = b.date
      } else {
        aVal = a.amount
        bVal = b.amount
      }

      const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      return sortOrder === 'desc' ? -comparison : comparison
    })

    return filtered
  }, [searchQuery, selectedCategory, dateRange, sortKey, sortOrder])

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

  const hasFilters = searchQuery || selectedCategory

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Transactions</h2>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by merchant, description..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>

          <Select
            value={selectedCategory || 'all'}
            onValueChange={(value) => {
              setSelectedCategory(value === 'all' ? null : value)
              setCurrentPage(1)
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {hasFilters && (
          <div className="mt-3 flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs bg-muted px-2 py-1 rounded flex items-center gap-1 hover:bg-border"
              >
                Search: {searchQuery}
                <X className="w-3 h-3" />
              </button>
            )}
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory(null)}
                className="text-xs bg-muted px-2 py-1 rounded flex items-center gap-1 hover:bg-border"
              >
                {selectedCategory}
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        )}
      </div>

      {paginatedTransactions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-2">No transactions found</p>
          <p className="text-sm text-muted-foreground">Try adjusting your filters</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-3 font-semibold text-foreground">
                    <button
                      onClick={() => toggleSort('date')}
                      className="flex items-center gap-1 hover:text-accent transition-colors"
                    >
                      Date
                      {sortKey === 'date' &&
                        (sortOrder === 'asc' ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        ))}
                    </button>
                  </th>
                  <th className="text-left py-3 px-3 font-semibold text-foreground">Merchant</th>
                  <th className="text-left py-3 px-3 font-semibold text-foreground">Category</th>
                  <th className="text-right py-3 px-3 font-semibold text-foreground">
                    <button
                      onClick={() => toggleSort('amount')}
                      className="flex items-center justify-end gap-1 hover:text-accent transition-colors w-full"
                    >
                      Amount
                      {sortKey === 'amount' &&
                        (sortOrder === 'asc' ? (
                          <ChevronUp className="w-4 h-4" />
                        ) : (
                          <ChevronDown className="w-4 h-4" />
                        ))}
                    </button>
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedTransactions.map((tx) => (
                  <tr
                    key={tx.id}
                    className="border-b border-border hover:bg-muted transition-colors"
                  >
                    <td className="py-3 px-3 text-muted-foreground">{formatDate(tx.date)}</td>
                    <td className="py-3 px-3">
                      <div>
                        <p className="font-medium text-foreground">{tx.merchant || tx.description}</p>
                        <p className="text-xs text-muted-foreground">{tx.id}</p>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-foreground">
                        {tx.category}
                      </span>
                    </td>
                    <td
                      className={`py-3 px-3 text-right font-semibold ${
                        tx.type === 'income'
                          ? 'text-green-600 dark:text-green-400'
                          : 'text-foreground'
                      }`}
                    >
                      {tx.type === 'income' ? '+' : '-'}
                      {formatCurrency(tx.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} of{' '}
                {filteredTransactions.length}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const page = i + 1
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  )
                })}
                {totalPages > 5 && <span className="text-muted-foreground">...</span>}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </Card>
  )
}
