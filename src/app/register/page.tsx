import { redirect } from "next/navigation"
import { getSession } from "@/lib/auth"
import { RegisterForm } from "@/components/register-form"

export default async function RegisterPage() {
  const session = await getSession()

  if (session) {
    redirect("/dashboard")
  }

  return (
    <main className="container max-w-md mx-auto p-4 flex flex-col min-h-screen justify-center">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Money Tracker</h1>
        <p className="text-muted-foreground mt-2">Create your account</p>
      </div>
      <RegisterForm />
    </main>
  )
}

