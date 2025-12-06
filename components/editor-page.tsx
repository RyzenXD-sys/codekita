"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LogOut } from "lucide-react"

interface EditorPageProps {
  username: string | null
  token: string
  onLogout: () => void
}

export default function EditorPage({ username, token, onLogout }: EditorPageProps) {
  const [projectName, setProjectName] = useState("")
  const [language, setLanguage] = useState("js")
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<{ viewUrl: string; rawUrl: string } | null>(null)
  const [message, setMessage] = useState("")

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!projectName.trim() || !code.trim()) {
      setMessage("✗ Isi nama project dan code!")
      return
    }

    setLoading(true)
    setMessage("")

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ projectName, language, code }),
      })
      const data = await res.json()
      if (res.ok) {
        setResult(data)
        setProjectName("")
        setCode("")
        setMessage("✓ Upload berhasil!")
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-900 to-black p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
              KodeKita
            </h1>
            <p className="text-gray-400">
              Halo, <span className="font-bold text-cyan-300">{username}</span>!
            </p>
          </div>
          <Button
            onClick={onLogout}
            variant="outline"
            className="text-red-400 border-red-400 hover:bg-red-950 bg-transparent"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Editor */}
          <div className="md:col-span-2">
            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-purple-700/50 backdrop-blur">
              <CardHeader>
                <CardTitle className="text-white">Upload Code Baru</CardTitle>
                <CardDescription>Share code mu dengan folder sendiri</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleUpload} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Nama Project (contoh: game-tictactoe)"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="bg-slate-800 border-slate-700 text-white placeholder-gray-500"
                    />
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="px-4 py-2 rounded-md bg-slate-800 border border-slate-700 text-white"
                    >
                      <option value="js">JavaScript</option>
                      <option value="html">HTML</option>
                      <option value="css">CSS</option>
                      <option value="py">Python</option>
                      <option value="other">Lainnya</option>
                    </select>
                  </div>
                  <textarea
                    placeholder="Tulis code di sini..."
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full p-4 rounded-md bg-slate-800 border border-slate-700 text-white placeholder-gray-500 font-mono text-sm resize-none"
                    rows={16}
                  />
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-lg"
                  >
                    {loading ? "Uploading..." : "Upload & Dapatkan Link"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Result */}
            {result && (
              <Card className="mt-6 bg-gradient-to-br from-green-950 to-slate-800 border-green-700/50">
                <CardHeader>
                  <CardTitle className="text-green-400">Upload Berhasil!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-gray-300 text-sm mb-2">View Link:</p>
                    <a
                      href={result.viewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:underline break-all text-sm"
                    >
                      {result.viewUrl}
                    </a>
                  </div>
                  <div>
                    <p className="text-gray-300 text-sm mb-2">Raw URL:</p>
                    <p className="text-gray-400 break-all text-sm font-mono">{result.rawUrl}</p>
                  </div>
                  <Button
                    onClick={() => navigator.clipboard.writeText(result.viewUrl)}
                    className="w-full bg-cyan-600 hover:bg-cyan-700"
                  >
                    Copy Link
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="md:col-span-1">
            {message && (
              <Card className={`mb-6 border-none ${message.startsWith("✓") ? "bg-green-950" : "bg-red-950"}`}>
                <CardContent className="pt-6">
                  <p
                    className={`text-center font-semibold ${message.startsWith("✓") ? "text-green-400" : "text-red-400"}`}
                  >
                    {message}
                  </p>
                </CardContent>
              </Card>
            )}

            <Card className="bg-gradient-to-br from-slate-900 to-slate-800 border-purple-700/50">
              <CardHeader>
                <CardTitle className="text-white">Informasi</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-gray-300 text-sm">
                <div>
                  <p className="font-semibold text-white mb-1">Dukungan Bahasa:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>JavaScript</li>
                    <li>HTML</li>
                    <li>CSS</li>
                    <li>Python</li>
                    <li>Dan lainnya</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-white mb-1">Cara Kerja:</p>
                  <p>Code akan disimpan di GitHub repo mu dengan struktur folder otomatis.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
