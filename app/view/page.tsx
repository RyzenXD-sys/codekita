import { getCodeFromGitHub } from "@/lib/github-storage"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface ViewPageProps {
  searchParams: Promise<{ project?: string; ext?: string }>
}

export default async function ViewPage({ searchParams }: ViewPageProps) {
  const params = await searchParams
  const project = params.project || ""
  const ext = params.ext || "js"

  const code = await getCodeFromGitHub(project, ext)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-4xl font-bold text-white">KodeKita — View Code</h1>
          <Link href="/">
            <Button className="bg-cyan-600 hover:bg-cyan-700">Kembali ke Editor</Button>
          </Link>
        </div>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">{project}</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="bg-slate-900 p-6 rounded-lg overflow-x-auto text-cyan-300 font-mono text-sm">
              <code>{code || "Code tidak ditemukan"}</code>
            </pre>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
