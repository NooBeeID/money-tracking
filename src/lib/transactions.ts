"use server"

import fs from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"

const DATA_DIR = path.join(process.cwd(), "data")

export interface Transaction {
  id: string
  amount: number
  description: string
  date: string
  categoryId: string
  type: "income" | "expense"
}

export interface Category {
  id: string
  name: string
  type: "income" | "expense"
}

// Get user's transactions file path
function getTransactionsFilePath(userId: string): string {
  return path.join(DATA_DIR, userId, "transactions.json")
}

// Get user's categories file path
function getCategoriesFilePath(userId: string): string {
  return path.join(DATA_DIR, userId, "categories.json")
}

// Get all transactions for a user
export async function getTransactions(userId: string): Promise<Transaction[]> {
  const filePath = getTransactionsFilePath(userId)

  if (!fs.existsSync(filePath)) {
    return []
  }

  const data = fs.readFileSync(filePath, "utf8")
  return JSON.parse(data)
}

// Get all categories for a user
export async function getCategories(userId: string): Promise<Category[]> {
  const filePath = getCategoriesFilePath(userId)

  if (!fs.existsSync(filePath)) {
    return []
  }

  const data = fs.readFileSync(filePath, "utf8")
  return JSON.parse(data)
}

// Get a category by ID
export async function getCategory(userId: string, categoryId: string): Promise<Category | null> {
  const categories = await getCategories(userId)
  const category = categories.find((c) => c.id === categoryId)
  return category || null
}

// Create a new transaction
export async function createTransaction(userId: string, data: Omit<Transaction, "id">): Promise<Transaction> {
  const transactions = await getTransactions(userId)

  const newTransaction: Transaction = {
    id: uuidv4(),
    ...data,
  }

  transactions.push(newTransaction)

  const filePath = getTransactionsFilePath(userId)
  fs.writeFileSync(filePath, JSON.stringify(transactions, null, 2), "utf8")

  return newTransaction
}

// Create a new category
export async function createCategory(userId: string, data: Omit<Category, "id">): Promise<Category> {
  const categories = await getCategories(userId)

  const newCategory: Category = {
    id: uuidv4(),
    ...data,
  }

  categories.push(newCategory)

  const filePath = getCategoriesFilePath(userId)
  fs.writeFileSync(filePath, JSON.stringify(categories, null, 2), "utf8")

  return newCategory
}

// Update a category
export async function updateCategory(
  userId: string,
  categoryId: string,
  data: Partial<Omit<Category, "id">>,
): Promise<Category | null> {
  const categories = await getCategories(userId)
  const index = categories.findIndex((c) => c.id === categoryId)

  if (index === -1) {
    return null
  }

  categories[index] = {
    ...categories[index],
    ...data,
  }

  const filePath = getCategoriesFilePath(userId)
  fs.writeFileSync(filePath, JSON.stringify(categories, null, 2), "utf8")

  return categories[index]
}

// Delete a category
export async function deleteCategory(userId: string, categoryId: string): Promise<boolean> {
  const categories = await getCategories(userId)
  const newCategories = categories.filter((c) => c.id !== categoryId)

  if (newCategories.length === categories.length) {
    return false
  }

  const filePath = getCategoriesFilePath(userId)
  fs.writeFileSync(filePath, JSON.stringify(newCategories, null, 2), "utf8")

  return true
}

// Get monthly data
export async function getMonthlyData(userId: string, month: number, year: number) {
  const transactions = await getTransactions(userId)
  const categories = await getCategories(userId)

  // Filter transactions for the specified month
  const monthlyTransactions = transactions.filter((transaction) => {
    const date = new Date(transaction.date)
    return date.getMonth() === month && date.getFullYear() === year
  })

  console.log({monthlyTransactions, transactions, month})

  // Sort by date (newest first)
  monthlyTransactions.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })

  // Calculate totals
  const income = monthlyTransactions.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0)

  const expense = monthlyTransactions.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0)

  // Enhance transactions with category names
  const enhancedTransactions = monthlyTransactions.map((transaction) => {
    const category = categories.find((c) => c.id === transaction.categoryId)
    return {
      ...transaction,
      categoryName: category ? category.name : "Uncategorized",
    }
  })

  return {
    transactions: enhancedTransactions,
    income,
    expense,
  }
}

