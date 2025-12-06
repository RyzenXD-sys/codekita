"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface AuthPageProps {
  onLogin: (token: string, username: string) => void
}

export default function AuthPage({ onLogin }: AuthPageProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, password, confirm: confirmPassword }),
      })
      const data = await res.json()
      if (res.ok) {
        setMessage("✓ Daftar berhasil! Silakan login")
        setTimeout(() => setIsLogin(true), 1500)
      } else {
        setMessage(`✗ ${data.error}`)
      }
    } catch (err) {
      setMessage("✗ Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: email || username, password }),
      })
      const data = await res.json()
      if (res.ok) {
        onLogin(data.token, data.username)
      } else {
        setMessage(`✗ ${data.error}`)
      }
    } catch (err) {
      setMessage("✗ Terjadi kesalahan")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gradient-to-br from-slate-900 to-slate-800 border-purple-700/50 backdrop-blur">
        <CardHeader className="text-center">
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
            KodeKita
          </CardTitle>
          <CardDescription className="text-gray-300">Share code dengan folder sendiri di GitHub</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Tabs */}
          <div className="flex gap-2 mb-6">
            <Button
              onClick={() => setIsLogin(true)}
              className={`flex-1 ${isLogin ? "bg-cyan-600 hover:bg-cyan-700" : "bg-slate-700 hover:bg-slate-600"}`}
            >
              Login
            </Button>
            <Button
              onClick={() => setIsLogin(false)}
              className={`flex-1 ${!isLogin ? "bg-purple-600 hover:bg-purple-700" : "bg-slate-700 hover:bg-slate-600"}`}
            >
              Daftar
            </Button>
          </div>

          {isLogin ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <Input
                type="text"
                placeholder="Username atau Email"
                value={email || username}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white placeholder-gray-500"
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white placeholder-gray-500"
              />
              <Button type="submit" disabled={loading} className="w-full bg-cyan-600 hover:bg-cyan-700">
                {loading ? "Loading..." : "Login"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-4">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white placeholder-gray-500"
              />
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white placeholder-gray-500"
              />
              <Input
                type="password"
                placeholder="Password (min 6 karakter)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white placeholder-gray-500"
              />
              <Input
                type="password"
                placeholder="Konfirmasi Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="bg-slate-800 border-slate-700 text-white placeholder-gray-500"
              />
              <Button type="submit" disabled={loading} className="w-full bg-purple-600 hover:bg-purple-700">
                {loading ? "Loading..." : "Daftar"}
              </Button>
            </form>
          )}

          {message && (
            <p
              className={`mt-4 text-center font-semibold ${message.startsWith("✓") ? "text-green-400" : "text-red-400"}`}
            >
              {message}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
