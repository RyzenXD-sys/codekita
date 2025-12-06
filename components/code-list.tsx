"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Trash2 } from "lucide-react"

export default function CodeList({ codes, onDelete, onCopy }) {
  return (
    <div className="space-y-4">
      {codes.map((codeItem) => (
        <Card key={codeItem.id} className="bg-slate-800 border-slate-700 overflow-hidden">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-white">{codeItem.title}</h3>
                {codeItem.description && <p className="text-sm text-gray-400 mt-1">{codeItem.description}</p>}
              </div>
              <span className="px-3 py-1 bg-blue-900 text-blue-200 text-xs rounded-full">{codeItem.language}</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <pre className="bg-slate-900 rounded-lg p-4 overflow-x-auto">
              <code className="text-gray-300 font-mono text-sm">{codeItem.code}</code>
            </pre>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>{codeItem.createdAt}</span>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onCopy(codeItem.code)}
                  className="border-slate-600 text-gray-300 hover:bg-slate-700"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onDelete(codeItem.id)}
                  className="border-red-600 text-red-400 hover:bg-red-900/20"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
