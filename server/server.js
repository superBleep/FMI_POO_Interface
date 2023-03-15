import express from 'express'
import ViteExpress from 'vite-express'
import path from 'path'

const app = express()
const port = 5173

const __dirname = path.resolve(path.dirname(''));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'))
})

ViteExpress.listen(app, port, () => {
    console.log('Server started...')
})