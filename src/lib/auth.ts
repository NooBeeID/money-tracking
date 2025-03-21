"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import fs from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"
import bcrypt from "bcryptjs"

const DATA_DIR = path.join(process.cwd(), "data")
const USERS_FILE = path.join(DATA_DIR, "users.json")
const SESSION_COOKIE = "money-tracker-session"

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true })
}

// Ensure users file exists
if (!fs.existsSync(USERS_FILE)) {
    fs.writeFileSync(USERS_FILE, JSON.stringify([]), "utf8")
}

interface User {
    id: string
    name: string
    email: string
    password: string
    settings?: {
        currency: string
    }
}

interface Session {
    id: string
    userId: string
    name: string
    email: string
    settings?: {
        currency: string
    }
}

// Get all users
function getUsers(): User[] {
    try {
        const data = fs.readFileSync(USERS_FILE, "utf8")
        return JSON.parse(data)
    } catch (error) {
        return []
    }
}

// Save users
function saveUsers(users: User[]) {
    fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2), "utf8")
}

// Find user by email
function findUserByEmail(email: string): User | undefined {
    const users = getUsers()
    return users.find((user) => user.email === email)
}

// Find user by ID
function findUserById(id: string): User | undefined {
    const users = getUsers()
    return users.find((user) => user.id === id)
}

// Register a new user
export async function register(name: string, email: string, password: string) {
    const users = getUsers()

    // Check if user already exists
    if (findUserByEmail(email)) {
        throw new Error("User already exists")
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const newUser: User = {
        id: uuidv4(),
        name,
        email,
        password: hashedPassword,
        settings: {
            currency: "$", // Default currency
        },
    }

    // Save user
    users.push(newUser)
    saveUsers(users)

    // Create user directory for transactions
    const userDir = path.join(DATA_DIR, newUser.id)
    if (!fs.existsSync(userDir)) {
        fs.mkdirSync(userDir, { recursive: true })

        // Create initial categories
        const categoriesFile = path.join(userDir, "categories.json")
        const initialCategories = [
            { id: uuidv4(), name: "Food", type: "expense" },
            { id: uuidv4(), name: "Transportation", type: "expense" },
            { id: uuidv4(), name: "Entertainment", type: "expense" },
            { id: uuidv4(), name: "Utilities", type: "expense" },
            { id: uuidv4(), name: "Salary", type: "income" },
            { id: uuidv4(), name: "Gifts", type: "income" },
        ]
        fs.writeFileSync(categoriesFile, JSON.stringify(initialCategories, null, 2), "utf8")

        // Create empty transactions file
        const transactionsFile = path.join(userDir, "transactions.json")
        fs.writeFileSync(transactionsFile, JSON.stringify([]), "utf8")
    }

    return { id: newUser.id, name: newUser.name, email: newUser.email }
}

// Login user
export async function login(email: string, password: string) {
    const user = findUserByEmail(email)

    if (!user) {
        throw new Error("Invalid credentials")
    }

    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
        throw new Error("Invalid credentials")
    }

    // Create session
    const session: Session = {
        id: uuidv4(),
        userId: user.id,
        name: user.name,
        email: user.email,
        settings: user.settings,
    }

    // Set session cookie
    const cookie = await cookies()
    cookie.set({
        name: SESSION_COOKIE,
        value: JSON.stringify(session),
        httpOnly: true,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7, // 1 week
    })

    return session
}

// Logout user
export async function logout() {
    const cookie = await cookies()

    cookie.delete(SESSION_COOKIE)
    redirect("/")
}

// Get current session
export async function getSession(): Promise<Session | null> {

    const cookie = await cookies()
    const sessionCookie = cookie.get(SESSION_COOKIE)

    if (!sessionCookie) {
        return null
    }

    try {
        const session = JSON.parse(sessionCookie.value) as Session
        return session
    } catch (error) {
        return null
    }
}

// Require authentication
export async function requireAuth() {
    const session = await getSession()

    if (!session) {
        redirect("/")
    }

    return session
}

// Update user settings
export async function updateUserSettings(userId: string, settings: { currency: string }) {
    const users = getUsers()
    const userIndex = users.findIndex((user) => user.id === userId)

    if (userIndex === -1) {
        throw new Error("User not found")
    }

    // Update user settings
    users[userIndex].settings = settings
    saveUsers(users)

    // Update session
    const session = await getSession()
    if (session && session.userId === userId) {
        const updatedSession: Session = {
            ...session,
            settings,
        }

        const cookie = await cookies()
        cookie.set({
            name: SESSION_COOKIE,
            value: JSON.stringify(updatedSession),
            httpOnly: true,
            path: "/",
            secure: process.env.NODE_ENV === "production",
            maxAge: 60 * 60 * 24 * 7, // 1 week
        })
    }

    return settings
}

