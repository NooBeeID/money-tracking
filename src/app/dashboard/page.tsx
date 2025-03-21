import { requireAuth } from "@/lib/auth"
import { getMonthlyData } from "@/lib/transactions"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardSummary } from "@/components/dashboard-summary"
import { RecentTransactions } from "@/components/recent-transactions"


export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>
}) {
  const session = await requireAuth()

  const params = await searchParams
  // Get current month data or use query parameters
  const today = new Date()
  const currentMonth = params.month ? Number.parseInt(params.month) : today.getMonth()
  const currentYear = params.year ? Number.parseInt(params.year) : today.getFullYear()

  const { transactions, income, expense } = await getMonthlyData(session.userId, currentMonth, currentYear)

  // Get user's currency preference
  const currency = session.settings?.currency || "$"

  return (
    <main className="container p-4 space-y-6 pb-20">
      <DashboardHeader month={currentMonth} year={currentYear} />
      <DashboardSummary income={income} expense={expense} currency={currency} />
      <RecentTransactions transactions={transactions.slice(0, 5)} currency={currency} />
    </main>
  )
}

