import express from 'express'
import cors from 'cors'

const app = express()
const port = 5000;

app.use(cors("*"))

app.use(express.json())
app.post('/email-login', (req, res) => {
    console.log(req.body)
})

app.listen(port, "localhost", err => {
    if (err)
        console.error("Failed to setup server")
    console.log("Server started on port " + port + "...")
})