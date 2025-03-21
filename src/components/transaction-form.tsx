"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { createTransaction } from "@/lib/transactions"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

interface Category {
    id: string
    name: string
    type: "income" | "expense"
}

const formSchema = z.object({
    amount: z
        .string()
        .min(1, { message: "Amount is required" })
        .refine((val) => !isNaN(Number.parseFloat(val)) && Number.parseFloat(val) > 0, {
            message: "Amount must be a positive number",
        }),
    description: z.string().min(1, { message: "Description is required" }),
    date: z.string().min(1, { message: "Date is required" }),
    categoryId: z.string().min(1, { message: "Category is required" }),
    type: z.enum(["income", "expense"]),
})

interface TransactionFormProps {
    userId: string
    categories: Category[]
}

export function TransactionForm({ userId, categories }: TransactionFormProps) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [transactionType, setTransactionType] = useState<"income" | "expense">("expense")

    // Format today's date as YYYY-MM-DD for the date input
    const today = new Date()
    const formattedDate = today.toISOString().split("T")[0]

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            amount: "",
            description: "",
            date: formattedDate,
            categoryId: "",
            type: "expense",
        },
    })

    // Filter categories based on selected transaction type
    const filteredCategories = categories.filter((category) => category.type === transactionType)

    async function onSubmit(values: z.infer<typeof formSchema>) {
        setIsLoading(true)
        try {
            await createTransaction(userId, {
                amount: Number.parseFloat(values.amount),
                description: values.description,
                date: values.date,
                categoryId: values.categoryId,
                type: values.type,
            })


            toast("Transaction added", {
                description: "Your transaction has been added successfully.",
            })

            router.push("/dashboard")
            router.refresh()
        } catch (error) {
            toast("Error", {
                description: "Failed to add transaction. Please try again.",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>New Transaction</CardTitle>
                <CardDescription>Add a new income or expense transaction</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Transaction Type</FormLabel>
                                    <Select
                                        onValueChange={(value: "income" | "expense") => {
                                            field.onChange(value)
                                            setTransactionType(value)
                                            form.setValue("categoryId", "")
                                        }}
                                        defaultValue={field.value}
                                    >
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

                        <FormField
                            control={form.control}
                            name="amount"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Amount</FormLabel>
                                    <FormControl>
                                        <Input type="number" step="0.01" placeholder="0.00" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="What was this transaction for?" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="date"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Date</FormLabel>
                                    <FormControl>
                                        <Input type="date" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Category</FormLabel>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {filteredCategories.length === 0 ? (
                                                <SelectItem value="none" disabled>
                                                    No categories available
                                                </SelectItem>
                                            ) : (
                                                filteredCategories.map((category) => (
                                                    <SelectItem key={category.id} value={category.id}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))
                                            )}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? "Adding..." : "Add Transaction"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

