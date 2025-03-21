"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

interface Transaction {
  id: string
  amount: number
  date: string
  type: "income" | "expense"
}

interface MonthlyChartProps {
  transactions: Transaction[]
}

export function MonthlyChart({ transactions }: MonthlyChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)

  // Process data for the last 6 months
  function processData() {
    const today = new Date()
    const months = []
    const incomeData = []
    const expenseData = []

    // Get the last 6 months
    for (let i = 5; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1)
      const monthName = month.toLocaleString("default", { month: "short" })
      months.push(monthName)

      // Filter transactions for this month
      const monthTransactions = transactions.filter((t) => {
        const transactionDate = new Date(t.date)
        return transactionDate.getMonth() === month.getMonth() && transactionDate.getFullYear() === month.getFullYear()
      })

      // Calculate totals
      const income = monthTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

      const expense = monthTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

      incomeData.push(income)
      expenseData.push(expense)
    }

    return { months, incomeData, expenseData }
  }

  // Create or update chart
  function createChart(type: "bar" | "line") {
    const { months, incomeData, expenseData } = processData()

    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    if (chartRef.current) {
      chartInstance.current = new Chart(chartRef.current, {
        type,
        data: {
          labels: months,
          datasets: [
            {
              label: "Income",
              data: incomeData,
              backgroundColor: "rgba(34, 197, 94, 0.2)",
              borderColor: "rgb(34, 197, 94)",
              borderWidth: 2,
            },
            {
              label: "Expense",
              data: expenseData,
              backgroundColor: "rgba(239, 68, 68, 0.2)",
              borderColor: "rgb(239, 68, 68)",
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      })
    }
  }

  useEffect(() => {
    createChart("bar")

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [transactions])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="bar" onValueChange={(value) => createChart(value as "bar" | "line")}>
          <TabsList className="mb-4">
            <TabsTrigger value="bar">Bar Chart</TabsTrigger>
            <TabsTrigger value="line">Line Chart</TabsTrigger>
          </TabsList>
          <div className="h-[300px] w-full">
            <canvas ref={chartRef} />
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}

