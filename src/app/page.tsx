import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { LoginForm } from "@/components/login-form"

export default async function Home() {
  const session = await getSession()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <main className="container max-w-md mx-auto p-4 flex flex-col min-h-screen justify-center">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Money Tracker</h1>
        <p className="text-muted-foreground mt-2">Track your income and expenses</p>
      </div>
      <LoginForm />
    </main>
  )
}

