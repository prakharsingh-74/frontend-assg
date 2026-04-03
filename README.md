# Zorvyn Finance Dashboard

A clean, interactive, and high-performance financial management interface built with Next.js and Tailwind CSS. This dashboard allows users to track their spending, visualize financial trends, and manage transactions across different roles.

## 🚀 Objective
This project was built to demonstrate an understanding of modern frontend development, focusing on intuitive UI design, robust state management, and interactive data visualization.

## 🔐 Quick Start: Demo Access
To access the protected dashboard and explore the **Admin** features, use the following hardcoded credentials on the [Login Page](http://localhost:3000/login):

```yaml
# Credentials for Zorvyn Finance Dashboard
Email:    admin@zorvyn.com
Password: admin123
```

> [!IMPORTANT]
> The dashboard is protected by an **AuthGuard**. Direct access to `/dashboard` via the URL will redirect to login if no active session is found.

---

## ✨ Key Features

### 1. Dashboard Overview
- **Summary Cards**: Real-time tracking of Total Balance, Monthly Income, and Monthly Expenses with trend indicators.
- **Balance Trend**: Interactive Area Chart visualizing asset growth over the last 30 days.
- **Real-time Metrics**: All summary figures are reactive and update instantly when data is added or filtered.

### 2. Transaction Management
- **Detailed List**: Track transactions with Merchant, Category, Amount, and ID.
- **Live Search**: Instant filtering by merchant name or transaction ID.
- **Category Filtering**: Narrow down spending by Salary, Groceries, Transport, Utilities, etc.
- **Sorting**: Multi-column sorting by Date and Amount.

### 3. Role-Based UI (RBAC Simulation)
- **Role Switcher**: Dynamic toggle in the sidebar to switch between **Viewer** and **Admin** modes.
- **Viewer Role**: Read-only access to dashboard metrics and transaction history.
- **Admin Role**: Unlocks "Add Transaction" capabilities and specialized Admin Control panels in the settings.

### 4. Financial Insights
- **Top Spending Category**: Identifies the highest expense category for the current month.
- **Monthly Trend**: Calculates the percentage change in spending compared to the previous month.
- **Activity Velocity**: Tracks transaction frequency trends.
- **AI-Driven Suggestions**: Proactive financial observations based on spending patterns.

### 5. State Management & Persistence
- **Zustand Store**: Centralized state for roles, transactions, search queries, and filters.
- **Persistence**: Dashboard state (including added transactions) is persisted to LocalStorage, ensuring data isn't lost on refresh.
- **Hydration**: Robust date rehydration logic to handle complex JSON-to-Date object conversions.

## 🛠️ Tech Stack
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 📦 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🧪 UX Considerations
- **Empty States**: Every chart and list handles "No data found" scenarios gracefully with helpful fallbacks.
- **Responsiveness**: Fully optimized for mobile, tablet, and desktop viewports with a collapsible sidebar.
- **Visual Polish**: Uses a premium Emerald-based color palette with glassmorphism effects and smooth transitions.

---
