require('dotenv').config()

const express = require('express')
const compression = require('compression')
const path = require('path')

const app = express()
const port = process.env.PORT || 3000

app.use(compression())

app.use(express.static(path.resolve(__dirname, 'dist'), {
  maxAge: '1y',
  immutable: true
}))

app.use((req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist/index.html'), {
    headers: { 'Cache-Control': 'no-cache' }
  })
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})
