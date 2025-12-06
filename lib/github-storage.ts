import { Octokit } from "@octokit/rest"

const GITHUB_USERNAME = process.env.GITHUB_USERNAME
const GITHUB_REPO = process.env.GITHUB_REPO
const GITHUB_TOKEN = process.env.GITHUB_TOKEN
const USERS_FILE = "users.json"

const octokit = new Octokit({ auth: GITHUB_TOKEN })

interface User {
  email: string
  username: string
  password: string
}

export async function getUsers(): Promise<User[]> {
  try {
    if (!GITHUB_USERNAME || !GITHUB_REPO) return []

    const { data } = await octokit.repos.getContent({
      owner: GITHUB_USERNAME,
      repo: GITHUB_REPO,
      path: USERS_FILE,
    })
    return JSON.parse(Buffer.from((data as any).content, "base64").toString())
  } catch {
    return []
  }
}

export async function saveUsers(users: User[]): Promise<void> {
  try {
    if (!GITHUB_USERNAME || !GITHUB_REPO) return

    let sha
    try {
      const { data } = await octokit.repos.getContent({
        owner: GITHUB_USERNAME,
        repo: GITHUB_REPO,
        path: USERS_FILE,
      })
      sha = (data as any).sha
    } catch {}

    await octokit.repos.createOrUpdateFileContents({
      owner: GITHUB_USERNAME,
      repo: GITHUB_REPO,
      path: USERS_FILE,
      message: `Update users: ${users.length}`,
      content: Buffer.from(JSON.stringify(users, null, 2)).toString("base64"),
      sha,
    })
  } catch (error) {
    console.error("Failed to save users:", error)
  }
}

export async function getCodeFromGitHub(project: string, ext: string): Promise<string> {
  try {
    if (!GITHUB_USERNAME || !GITHUB_REPO) return ""

    const filePath = `projects/${project}/main.${ext}`
    const { data } = await octokit.repos.getContent({
      owner: GITHUB_USERNAME,
      repo: GITHUB_REPO,
      path: filePath,
    })
    return Buffer.from((data as any).content, "base64").toString()
  } catch {
    return ""
  }
}
