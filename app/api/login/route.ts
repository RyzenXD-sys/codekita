import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"
import { getUsers } from "@/lib/github-storage"

const SECRET_KEY = process.env.SECRET_KEY || "kodekita2025vercel"

export async function POST(request: NextRequest) {
  try {
    const { identifier, password } = await request.json()

    const users = await getUsers()
    const user = users.find((u) => u.username === identifier || u.email === identifier)

    if (!user) {
      return NextResponse.json({ error: "Username/email atau password salah" }, { status: 401 })
    }

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) {
      return NextResponse.json({ error: "Username/email atau password salah" }, { status: 401 })
    }

    const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: "7d" })
    return NextResponse.json({ token, username: user.username })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
