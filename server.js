const express = require("express")
const path = require("path")
const app = express()

const publicDir = path.join(__dirname, "public")

app.use(express.static(publicDir))

app.get("/", (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"))
})

// Em produção (Vercel) o app é exportado; localmente sobe na porta 3000
if (require.main === module) {
  const port = process.env.PORT || 3000
  app.listen(port, () => {
    console.log(`http://localhost:${port}`)
  })
}

module.exports = app
