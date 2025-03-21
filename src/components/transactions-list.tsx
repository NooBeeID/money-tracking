"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowDownIcon, ArrowUpIcon, Search } from "lucide-react"
import { formatMoney } from "@/lib/format"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface Transaction {
  id: string
  amount: number
  description: string
  date: string
  type: "income" | "expense"
  categoryName: string
}

interface TransactionsListProps {
  transactions: Transaction[]
  currency?: string
}

export function TransactionsList({ transactions, currency = "$" }: TransactionsListProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all")

  // Filter transactions based on search term and type
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.categoryName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = filterType === "all" || transaction.type === filterType

    return matchesSearch && matchesType
  })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">Transactions</CardTitle>
        <Button asChild variant="default" size="sm">
          <Link href="/dashboard/transactions/new">Add New</Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4 sm:flex-row mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search transactions..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Select defaultValue="all" onValueChange={(value: "all" | "income" | "expense") => setFilterType(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Transactions</SelectItem>
              <SelectItem value="income">Income Only</SelectItem>
              <SelectItem value="expense">Expenses Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <p className="text-sm text-muted-foreground">No transactions found</p>
            {transactions.length > 0 && (
              <p className="text-xs text-muted-foreground mt-1">Try adjusting your filters</p>
            )}
            <Button asChild className="mt-4">
              <Link href="/dashboard/transactions/new">Add Transaction</Link>
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between border-b pb-4">
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

