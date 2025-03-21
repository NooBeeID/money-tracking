import Link from "next/link"
import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"
import { formatMoney } from "@/lib/format"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Transaction {
  id: string
  amount: number
  description: string
  date: string
  type: "income" | "expense"
  categoryName: string
}

interface RecentTransactionsProps {
  transactions: Transaction[]
  currency?: string
}

export function RecentTransactions({ transactions, currency = "$" }: RecentTransactionsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Recent Transactions</CardTitle>
        <Button asChild variant="ghost" size="sm" className="text-xs">
          <Link href="/dashboard/transactions">View all</Link>
        </Button>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="text-sm text-muted-foreground">No transactions yet</p>
            <Button asChild className="mt-4">
              <Link href="/dashboard/transactions/new">Add Transaction</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`rounded-full p-2 ${transaction.type === "income" ? "bg-green-100" : "bg-red-100"}`}>
                    {transaction.type === "income" ? (
                      <ArrowUpIcon className="h-4 w-4 text-green-500" />
                    ) : (
                      <ArrowDownIcon className="h-4 w-4 text-red-500" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{transaction.description}</div>
                    <div className="text-xs text-muted-foreground">
                      {transaction.categoryName} • {new Date(transaction.date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className={`font-medium ${transaction.type === "income" ? "text-green-500" : "text-red-500"}`}>
                  {transaction.type === "income" ? "+" : "-"}
                  {formatMoney(transaction.amount, currency).replace(`${currency} `, "")}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

