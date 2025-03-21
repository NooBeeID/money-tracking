import { requireAuth } from "@/lib/auth"
import { getCategories } from "@/lib/transactions"
import { TransactionForm } from "@/components/transaction-form"

export default async function NewTransactionPage() {
  const session = await requireAuth()
  const categories = await getCategories(session.userId)

  return (
    <main className="container p-4 pb-20">
      <h1 className="text-2xl font-bold mb-6">Add Transaction</h1>
      <TransactionForm userId={session.userId} categories={categories} />
    </main>
  )
}

