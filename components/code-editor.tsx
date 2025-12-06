"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const LANGUAGES = ["javascript", "python", "java", "cpp", "html", "css", "sql", "bash", "json"]

export default function CodeEditor({ onSubmit, onCancel }) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [language, setLanguage] = useState("javascript")
  const [code, setCode] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!title.trim() || !code.trim()) {
      alert("Please fill in title and code")
      return
    }
    onSubmit({ title, description, language, code })
    setTitle("")
    setDescription("")
    setCode("")
  }

  return (
    <Card className="bg-slate-800 border-slate-700">
      <CardHeader>
        <CardTitle className="text-white">Create New Code Snippet</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Authentication Function"
              className="bg-slate-700 border-slate-600 text-white"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this code does..."
              className="bg-slate-700 border-slate-600 text-white"
              rows={2}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 text-white rounded-md p-2"
            >
              {LANGUAGES.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Code</label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste your code here..."
              className="w-full bg-slate-700 border border-slate-600 text-white rounded-md p-3 font-mono text-sm"
              rows={10}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Save Code
            </Button>
            <Button type="button" onClick={onCancel} variant="outline" className="border-slate-600 bg-transparent">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
