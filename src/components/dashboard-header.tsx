"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from "@/components/ui/button"

interface DashboardHeaderProps {
  month: number
  year: number
}

export function DashboardHeader({ month, year }: DashboardHeaderProps) {
  const router = useRouter()
  const [currentMonth, setCurrentMonth] = useState(month)
  const [currentYear, setCurrentYear] = useState(year)
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ]
  
  function previousMonth() {
    let newMonth = currentMonth - 1
    let newYear = currentYear
    
    if (newMonth < 0) {
      newMonth = 11
      newYear--
    }
    
    setCurrentMonth(newMonth)
    setCurrentYear(newYear)
    router.push(`/dashboard?month=${newMonth}&year=${newYear}`)
  }
  
  function nextMonth() {
    let newMonth = currentMonth + 1
    let newYear = currentYear
    
    if (newMonth > 11) {
      newMonth = 0
      newYear++
    }
    
    setCurrentMonth(newMonth)
    setCurrentYear(newYear)
    router.push(`/dashboard?month=${newMonth}&year=${newYear}`)
  }
  
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={previousMonth}>
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">Previous month</span>
        </Button>
        <div className="min-w-24 text-center">
          {monthNames[currentMonth]} {currentYear}
        </div>
        <Button variant="outline" size="icon" onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">Next month</span>
        </Button>
      </div>
    </div>
  )
}
