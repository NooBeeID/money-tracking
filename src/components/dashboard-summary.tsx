import { ArrowDownIcon, ArrowUpIcon } from "lucide-react"
import { formatMoney } from "@/lib/format"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

interface DashboardSummaryProps {
  income: number
  expense: number
  currency?: string
}

export function DashboardSummary({ income, expense, currency = "$" }: DashboardSummaryProps) {
  const balance = income - expense
  const progressValue = income > 0 ? (expense / income) * 100 : 0

  return (
    <div className="grid gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Balance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatMoney(balance, currency)}</div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <ArrowUpIcon className="h-4 w-4 text-green-500" />
              Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-green-500">{formatMoney(income, currency)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <ArrowDownIcon className="h-4 w-4 text-red-500" />
              Expense
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-red-500">{formatMoney(expense, currency)}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Spending</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Progress value={progressValue} className="h-2" />
          <div className="text-xs text-muted-foreground">{progressValue.toFixed(0)}% of income spent</div>
        </CardContent>
      </Card>
    </div>
  )
}

