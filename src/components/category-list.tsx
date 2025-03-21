"use client"

import { useState } from "react"
import { Edit2, Trash2 } from "lucide-react"
import { deleteCategory, updateCategory } from "@/lib/transactions"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"

interface Category {
    id: string
    name: string
    type: "income" | "expense"
}

interface CategoryListProps {
    userId: string
    categories: Category[]
}

const formSchema = z.object({
    name: z.string().min(1, { message: "Name is required" }),
    type: z.enum(["income", "expense"]),
})

export function CategoryList({ userId, categories }: CategoryListProps) {
    const router = useRouter()

    const [isEditing, setIsEditing] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            type: "expense",
        },
    })

    function onEdit(category: Category) {
        setSelectedCategory(category)
        form.reset({
            name: category.name,
            type: category.type,
        })
        setIsEditing(true)
    }

    async function onDelete(categoryId: string) {
        try {
            await deleteCategory(userId, categoryId)
            toast("Category deleted", {
                description: "The category has been deleted successfully"
            })
            router.refresh()
        } catch (error: any) {
            toast("Error", {
                description: "Failed to delete category with error: " + error.message + ". Please try again."
            })
        }
    }

    async function onSubmit(values: z.infer<typeof formSchema>) {
        if (!selectedCategory) return

        try {
            await updateCategory(userId, selectedCategory.id, values)
            
            toast("Category updated", {
                description: "The category has been updated successfully"
            })
            setIsEditing(false)
            router.refresh()
        } catch (error:any) {
            toast("Error", {
                description: "Failed to update category with error: " + error.message + ". Please try again."
            })
        }
    }

    // Group categories by type
    const incomeCategories = categories.filter((c) => c.type === "income")
    const expenseCategories = categories.filter((c) => c.type === "expense")

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Income Categories</CardTitle>
                    <CardDescription>Categories for your income transactions</CardDescription>
                </CardHeader>
                <CardContent>
                    {incomeCategories.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No income categories yet</p>
                    ) : (
                        <ul className="space-y-2">
                            {incomeCategories.map((category) => (
                                <li key={category.id} className="flex items-center justify-between rounded-md border p-2">
                                    <span>{category.name}</span>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => onEdit(category)}>
                                            <Edit2 className="h-4 w-4" />
                                            <span className="sr-only">Edit</span>
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => onDelete(category.id)}>
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">Delete</span>
                                        </Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Expense Categories</CardTitle>
                    <CardDescription>Categories for your expense transactions</CardDescription>
                </CardHeader>
                <CardContent>
                    {expenseCategories.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No expense categories yet</p>
                    ) : (
                        <ul className="space-y-2">
                            {expenseCategories.map((category) => (
                                <li key={category.id} className="flex items-center justify-between rounded-md border p-2">
                                    <span>{category.name}</span>
                                    <div className="flex gap-2">
                                        <Button variant="ghost" size="icon" onClick={() => onEdit(category)}>
                                            <Edit2 className="h-4 w-4" />
                                            <span className="sr-only">Edit</span>
                                        </Button>
                                        <Button variant="ghost" size="icon" onClick={() => onDelete(category.id)}>
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">Delete</span>
                                        </Button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </CardContent>
            </Card>

            <Dialog open={isEditing} onOpenChange={setIsEditing}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Category</DialogTitle>
                        <DialogDescription>Update the category details below.</DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="type"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="income">Income</SelectItem>
                                                <SelectItem value="expense">Expense</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                                    Cancel
                                </Button>
                                <Button type="submit">Save Changes</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

