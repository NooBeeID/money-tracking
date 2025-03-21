import { requireAuth } from "@/lib/auth"
import { SettingsForm } from "@/components/settings-form"

export default async function SettingsPage() {
  const session = await requireAuth()

  return (
    <main className="container p-4 pb-20">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      <SettingsForm userId={session.userId} currentSettings={session.settings || { currency: "$" }} />
    </main>
  )
}

