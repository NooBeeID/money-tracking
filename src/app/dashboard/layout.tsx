import type React from "react"
import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { AppHeader } from "@/components/app-header"
import { AppNav } from "@/components/app-nav"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getSession()

  if (!session) {
    redirect("/")
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader user={session} />
      <div className="flex-1 pb-16">{children}</div>
      <AppNav />
    </div>
  )
}

