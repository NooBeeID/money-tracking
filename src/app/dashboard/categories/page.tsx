import { requireAuth } from "@/lib/auth"
import { getCategories } from "@/lib/transactions"
import { CategoryList } from "@/components/category-list"
import { NewCategoryForm } from "@/components/new-category-form"

export default async function CategoriesPage() {
  const session = await requireAuth()
  const categories = await getCategories(session.userId)

  return (
    <main className="container p-4 space-y-6 pb-20">
      <h1 className="text-2xl font-bold">Categories</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <CategoryList userId={session.userId} categories={categories} />
        <NewCategoryForm userId={session.userId} />
      </div>
    </main>
  )
}

