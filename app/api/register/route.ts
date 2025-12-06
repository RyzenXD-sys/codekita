import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcrypt"
import { getUsers, saveUsers } from "@/lib/github-storage"

export async function POST(request: NextRequest) {
  try {
    const { email, username, password, confirm } = await request.json()

    if (!email || !username || !password) {
      return NextResponse.json({ error: "Isi semua field" }, { status: 400 })
    }

    if (password !== confirm) {
      return NextResponse.json({ error: "Password tidak sama" }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: "Password minimal 6 karakter" }, { status: 400 })
    }

    const users = await getUsers()
    if (users.some((u) => u.username === username || u.email === email)) {
      return NextResponse.json({ error: "Username/email sudah dipakai" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    users.push({ email, username, password: hashedPassword })
    await saveUsers(users)

    return NextResponse.json({ message: "Daftar berhasil!" })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Server error" }, { status: 500 })
  }
}
