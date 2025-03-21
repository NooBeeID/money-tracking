"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

interface Transaction {
  id: string
  amount: number
  categoryId: string
  type: "income" | "expense"
}

interface Category {
  id: string
  name: string
  type: "income" | "expense"
}

interface CategoryBreakdownProps {
  transactions: Transaction[]
  categories: Category[]
}

export function CategoryBreakdown({ transactions, categories }: CategoryBreakdownProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)
  const chartInstance = useRef<Chart | null>(null)
  const [activeTab, setActiveTab] = useState<"income" | "expense">("expense")

  // Process data for categories
  function processData(type: "income" | "expense") {
    // Filter transactions by type
    const filteredTransactions = transactions.filter((t) => t.type === type)

    // Group by category
    const categoryTotals: Record<string, number> = {}

    filteredTransactions.forEach((transaction) => {
      if (categoryTotals[transaction.categoryId]) {
        categoryTotals[transaction.categoryId] += transaction.amount
      } else {
        categoryTotals[transaction.categoryId] = transaction.amount
      }
    })

    // Prepare data for chart
    const categoryNames: string[] = []
    const categoryAmounts: number[] = []
    const backgroundColors: string[] = []

    // Generate random colors for each category
    const generateColor = () => {
      const r = Math.floor(Math.random() * 200)
      const g = Math.floor(Math.random() * 200)
      const b = Math.floor(Math.random() * 200)
      return `rgba(${r}, ${g}, ${b}, 0.7)`
    }

    // Map category IDs to names and prepare chart data
    Object.entries(categoryTotals).forEach(([categoryId, amount]) => {
      const category = categories.find((c) => c.id === categoryId)
      if (category) {
        categoryNames.push(category.name)
        categoryAmounts.push(amount)
        backgroundColors.push(generateColor())
      }
    })

    return { categoryNames, categoryAmounts, backgroundColors }
  }

  // Create or update chart
  function createChart(type: "income" | "expense") {
    const { categoryNames, categoryAmounts, backgroundColors } = processData(type)

    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    if (chartRef.current) {
      chartInstance.current = new Chart(chartRef.current, {
        type: "doughnut",
        data: {
          labels: categoryNames,
          datasets: [
            {
              data: categoryAmounts,
              backgroundColor: backgroundColors,
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "bottom",
            },
          },
        },
      })
    }
  }

  useEffect(() => {
    createChart(activeTab)

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [transactions, categories, activeTab])

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="expense"
          onValueChange={(value) => {
            setActiveTab(value as "income" | "expense")
            createChart(value as "income" | "expense")
          }}
        >
          <TabsList className="mb-4">
            <TabsTrigger value="expense">Expenses</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
          </TabsList>
          <div className="h-[300px] w-full">
            <canvas ref={chartRef} />
          </div>
        </Tabs>
      </CardContent>
    </Card>
  )
}

