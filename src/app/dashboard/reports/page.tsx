import { requireAuth } from "@/lib/auth"
import { getTransactions, getCategories } from "@/lib/transactions"
import { MonthlyChart } from "@/components/monthly-chart"
import { CategoryBreakdown } from "@/components/category-breakdown"

export default async function ReportsPage() {
  const session = await requireAuth()
  const transactions = await getTransactions(session.userId)
  const categories = await getCategories(session.userId)

  return (
    <main className="container p-4 space-y-6 pb-20">
      <h1 className="text-2xl font-bold">Reports</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <MonthlyChart transactions={transactions} />
        <CategoryBreakdown transactions={transactions} categories={categories} />
      </div>
    </main>
  )
}

