"use client"

import { useState, useEffect } from "react"
import AuthPage from "@/components/auth-page"
import EditorPage from "@/components/editor-page"

export default function Home() {
  const [token, setToken] = useState<string | null>(null)
  const [username, setUsername] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedToken = localStorage.getItem("token")
    const savedUsername = localStorage.getItem("username")
    if (savedToken && savedUsername) {
      setToken(savedToken)
      setUsername(savedUsername)
    }
    setLoading(false)
  }, [])

  const handleLogin = (newToken: string, newUsername: string) => {
    localStorage.setItem("token", newToken)
    localStorage.setItem("username", newUsername)
    setToken(newToken)
    setUsername(newUsername)
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("username")
    setToken(null)
    setUsername(null)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-950 to-black flex items-center justify-center">
        <p className="text-white text-2xl">Loading...</p>
      </div>
    )
  }

  return token ? (
    <EditorPage username={username} token={token} onLogout={handleLogout} />
  ) : (
    <AuthPage onLogin={handleLogin} />
  )
}
