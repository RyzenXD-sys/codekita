import { type NextRequest, NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { Octokit } from "@octokit/rest"

const SECRET_KEY = process.env.SECRET_KEY || "kodekita2025vercel"
const GITHUB_USERNAME = process.env.GITHUB_USERNAME
const GITHUB_REPO = process.env.GITHUB_REPO
const GITHUB_TOKEN = process.env.GITHUB_TOKEN

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")
    if (!token) {
      return NextResponse.json({ error: "Login dulu!" }, { status: 401 })
    }

    try {
      jwt.verify(token, SECRET_KEY)
    } catch {
      return NextResponse.json({ error: "Token salah" }, { status: 401 })
    }

    if (!GITHUB_USERNAME || !GITHUB_REPO || !GITHUB_TOKEN) {
      return NextResponse.json({ error: "GitHub config tidak lengkap" }, { status: 500 })
    }

    const { projectName, language, code } = await request.json()
    const safeName = projectName.replace(/[^a-zA-Z0-9-]/g, "-").toLowerCase()
    const ext = { js: "js", html: "html", css: "css", py: "py", other: "txt" }[language as string] || "txt"
    const filePath = `projects/${safeName}/main.${ext}`

    const octokit = new Octokit({ auth: GITHUB_TOKEN })

    let sha
    try {
      const { data } = await octokit.repos.getContent({
        owner: GITHUB_USERNAME,
        repo: GITHUB_REPO,
        path: filePath,
      })
      sha = (data as any).sha
    } catch {}

    await octokit.repos.createOrUpdateFileContents({
      owner: GITHUB_USERNAME,
      repo: GITHUB_REPO,
      path: filePath,
      message: `Upload: ${projectName}`,
      content: Buffer.from(code).toString("base64"),
      sha,
    })

    const rawUrl = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPO}/main/${filePath}`
    const viewUrl = `/view?project=${safeName}&ext=${ext}`

    return NextResponse.json({ rawUrl, viewUrl })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: "Gagal upload" }, { status: 500 })
  }
}
