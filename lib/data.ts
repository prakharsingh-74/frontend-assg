import type { Transaction } from './types'

// Generate realistic mock transactions for the past 6 months
export const generateMockTransactions = (): Transaction[] => {
  // Use a simple seeded PRNG to ensure server/client consistency for hydration
  let seed = 42
  const seededRandom = () => {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  }

  const transactions: Transaction[] = []
  const categories: Transaction['category'][] = [
    'Salary',
    'Groceries',
    'Transport',
    'Utilities',
    'Entertainment',
    'Healthcare',
    'Other',
  ]

  const merchants: Record<string, string[]> = {
    Salary: ['TechCorp Inc.', 'Digital Solutions Ltd.', 'InnovateLabs'],
    Groceries: ['Whole Foods', "Trader Joe's", 'Kroger', 'Safeway', 'Costco'],
    Transport: ['Uber', 'Lyft', 'Shell Gas', 'EV Charging', 'Parking'],
    Utilities: ['PG&E', 'Water Company', 'Internet Provider', 'Phone Bill'],
    Entertainment: ['Netflix', 'Spotify', 'Cinema', 'Restaurant', 'Bar'],
    Healthcare: ['Pharmacy', 'Hospital', 'Clinic', 'Dentist'],
    Other: ['Amazon', 'Apple', 'Electronics Store'],
  }

  let id = 1
  const today = new Date('2026-04-03T00:00:00Z') // Use a fixed 'today' for consistency
  const sixMonthsAgo = new Date(today.getTime() - 180 * 24 * 60 * 60 * 1000)

  // Generate 150 transactions
  for (let i = 0; i < 150; i++) {
    const randomDays = Math.floor(seededRandom() * 180)
    const transactionDate = new Date(sixMonthsAgo.getTime() + randomDays * 24 * 60 * 60 * 1000)

    // Add time variation
    transactionDate.setHours(Math.floor(seededRandom() * 24))
    transactionDate.setMinutes(Math.floor(seededRandom() * 60))

    const category = categories[Math.floor(seededRandom() * categories.length)]
    const isIncome = category === 'Salary' ? true : seededRandom() > 0.95
    const merchant = merchants[category][Math.floor(seededRandom() * merchants[category].length)]

    let amount = 0
    if (category === 'Salary') {
      amount = 4500 + Math.floor(seededRandom() * 2000)
    } else if (category === 'Utilities') {
      amount = 50 + Math.floor(seededRandom() * 150)
    } else if (category === 'Groceries') {
      amount = 30 + Math.floor(seededRandom() * 120)
    } else if (category === 'Transport') {
      amount = 10 + Math.floor(seededRandom() * 80)
    } else if (category === 'Entertainment') {
      amount = 20 + Math.floor(seededRandom() * 150)
    } else if (category === 'Healthcare') {
      amount = 50 + Math.floor(seededRandom() * 300)
    } else {
      amount = 20 + Math.floor(seededRandom() * 200)
    }

    transactions.push({
      id: `TXN${String(id).padStart(6, '0')}`,
      date: transactionDate,
      amount: parseFloat((amount + seededRandom() * 0.99).toFixed(2)),
      category,
      type: isIncome ? 'income' : 'expense',
      description: `${category} purchase at ${merchant}`,
      merchant,
    })

    id++
  }

  return transactions.sort((a, b) => b.date.getTime() - a.date.getTime())
}

export const mockTransactions = generateMockTransactions()

export const CATEGORIES = [
  'Salary',
  'Groceries',
  'Transport',
  'Utilities',
  'Entertainment',
  'Healthcare',
  'Other',
] as const

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export const formatDateShort = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(date)
}
