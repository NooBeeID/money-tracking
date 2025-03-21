"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Home, PlusCircle, Settings, Tag } from "lucide-react"

import { cn } from "@/lib/utils"

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Reports",
    href: "/dashboard/reports",
    icon: BarChart3,
  },
  {
    title: "Add",
    href: "/dashboard/transactions/new",
    icon: PlusCircle,
  },
  {
    title: "Categories",
    href: "/dashboard/categories",
    icon: Tag,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function AppNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-background z-10">
      <div className="container flex h-16 items-center justify-between px-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1 text-muted-foreground transition-colors hover:text-foreground",
              pathname === item.href && "text-foreground",
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="text-xs">{item.title}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}

