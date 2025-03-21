import { requireAuth } from "@/lib/auth"
import { getTransactions, getCategories } from "@/lib/transactions"
import { TransactionsList } from "@/components/transactions-list"

export default async function TransactionsPage() {
  const session = await requireAuth()
  const transactions = await getTransactions(session.userId)
  const categories = await getCategories(session.userId)

  // Get user's currency preference
  const currency = session.settings?.currency || "$"

  // Enhance transactions with category names
  const enhancedTransactions = transactions.map((transaction) => {
    const category = categories.find((c) => c.id === transaction.categoryId)
    return {
      ...transaction,
      categoryName: category ? category.name : "Uncategorized",
    }
  })

  // Sort by date (newest first)
  enhancedTransactions.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  return (
    <main className="container p-4 space-y-6 pb-20">
      <h1 className="text-2xl font-bold">All Transactions</h1>
      <TransactionsList transactions={enhancedTransactions} currency={currency} />
    </main>
  )
}

