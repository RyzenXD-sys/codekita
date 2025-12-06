const express = require("express")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const { Octokit } = require("@octokit/rest")

const app = express()
app.use(express.json({ limit: "10mb" }))
app.use(express.static("public"))

const PORT = process.env.PORT || 3000
const SECRET_KEY = process.env.SECRET_KEY || "kodekita2025vercel"

let config
try {
  if (process.env.GITHUB_TOKEN && process.env.GITHUB_USERNAME && process.env.GITHUB_REPO) {
    config = {
      GITHUB_USERNAME: process.env.GITHUB_USERNAME,
      GITHUB_REPO: process.env.GITHUB_REPO,
      GITHUB_TOKEN: process.env.GITHUB_TOKEN,
    }
  } else {
    config = require("./config")
  }
} catch (err) {
  console.error("config.js atau environment variables tidak ditemukan!")
  process.exit(1)
}

const octokit = new Octokit({ auth: config.GITHUB_TOKEN })
const USERS_FILE = "users.json"

// Helper: ambil & simpan users.json dari GitHub
const getUsers = async () => {
  try {
    const { data } = await octokit.repos.getContent({
      owner: config.GITHUB_USERNAME,
      repo: config.GITHUB_REPO,
      path: USERS_FILE,
    })
    return JSON.parse(Buffer.from(data.content, "base64").toString())
  } catch {
    return []
  }
}

const saveUsers = async (users) => {
  let sha
  try {
    const { data } = await octokit.repos.getContent({
      owner: config.GITHUB_USERNAME,
      repo: config.GITHUB_REPO,
      path: USERS_FILE,
    })
    sha = data.sha
  } catch {}

  await octokit.repos.createOrUpdateFileContents({
    owner: config.GITHUB_USERNAME,
    repo: config.GITHUB_REPO,
    path: USERS_FILE,
    message: `Update users: ${users.length}`,
    content: Buffer.from(JSON.stringify(users, null, 2)).toString("base64"),
    sha,
  })
}

app.post("/api/register", async (req, res) => {
  try {
    const { email, username, password, confirm } = req.body
    if (password !== confirm) return res.status(400).json({ error: "Password tidak sama" })
    if (password.length < 6) return res.status(400).json({ error: "Password minimal 6 karakter" })

    const users = await getUsers()
    if (users.some((u) => u.username === username || u.email === email)) {
      return res.status(400).json({ error: "Username/email sudah dipakai" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    users.push({ email, username, password: hashedPassword })
    await saveUsers(users)
    res.json({ message: "Daftar berhasil!" })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: "Server error" })
  }
})

app.post("/api/login", async (req, res) => {
  try {
    const { identifier, password } = req.body
    const users = await getUsers()
    const user = users.find((u) => u.username === identifier || u.email === identifier)
    if (!user) return res.status(401).json({ error: "Username/email atau password salah" })

    const isValid = await bcrypt.compare(password, user.password)
    if (!isValid) return res.status(401).json({ error: "Username/email atau password salah" })

    const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: "7d" })
    res.json({ token, username: user.username })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: "Server error" })
  }
})

// Upload → folder otomatis
app.post("/api/upload", async (req, res) => {
  const token = req.headers.authorization
  if (!token) return res.status(401).json({ error: "Login dulu!" })
  try {
    jwt.verify(token, SECRET_KEY)
  } catch {
    return res.status(401).json({ error: "Token salah" })
  }

  const { projectName, language, code } = req.body
  const safeName = projectName.replace(/[^a-zA-Z0-9-]/g, "-").toLowerCase()
  const ext = { js: "js", html: "html", css: "css", py: "py", other: "txt" }[language] || "txt"
  const filePath = `projects/${safeName}/main.${ext}`

  try {
    let sha
    try {
      const { data } = await octokit.repos.getContent({
        owner: config.GITHUB_USERNAME,
        repo: config.GITHUB_REPO,
        path: filePath,
      })
      sha = data.sha
    } catch {}

    await octokit.repos.createOrUpdateFileContents({
      owner: config.GITHUB_USERNAME,
      repo: config.GITHUB_REPO,
      path: filePath,
      message: `Upload: ${projectName}`,
      content: Buffer.from(code).toString("base64"),
      sha,
    })

    const rawUrl = `https://raw.githubusercontent.com/${config.GITHUB_USERNAME}/${config.GITHUB_REPO}/main/${filePath}`
    const viewUrl = `/view.html?project=${safeName}&ext=${ext}`

    res.json({ rawUrl, viewUrl })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: "Gagal upload" })
  }
})

app.listen(PORT, () => console.log(`Server jalan di port ${PORT}`))
