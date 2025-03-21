"use client"

import Link from "next/link"
import { LogOut, User } from "lucide-react"
import { logout } from "@/lib/auth"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"

interface AppHeaderProps {
  user: {
    name: string
    email: string
  }
}

export function AppHeader({ user }: AppHeaderProps) {
  return (
    <header className="border-b">
      <div className="container flex h-14 items-center px-4">
        <Link href="/dashboard" className="font-semibold">
          Money Tracker
        </Link>
        <div className="ml-auto flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline-block">{user.name}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <span>{user.email}</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <form action={logout}>
                  <button className="flex w-full items-center gap-2 text-destructive">
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </form>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}

