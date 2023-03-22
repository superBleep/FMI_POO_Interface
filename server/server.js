import dotenv from 'dotenv'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import cors from 'cors'
import session from 'express-session'
import { admin, dbUser, student } from './sequelizeModels.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({
    path: resolve(__dirname + '/../.env')
})

const app = express()
const port = process.env.BACKEND_PORT

app.use(cors("*"))
app.use(express.json())
app.use(
    session({
        key: "sid",
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true
    })
)

app.post('/email-login', async (req, res) => {
    let userObj = (await dbUser.findOne({
        where: {
            email: req.body.email,
            password: req.body.pass
        }
    }))

    if(userObj) {
        let studentObj = (await student.findOne({
            where: {
                id: userObj.dataValues.id
            }
        }))

        let adminObj = (await admin.findOne({
            where: {
                id: userObj.dataValues.id
            }
        }))

        if(studentObj) {
            req.session.userData = Object.assign(studentObj.dataValues, userObj.dataValues)
            res.send({
                userData: req.session.userData,
                userSID: req.sessionID
            })
        }
        else if(adminObj) {
            req.session.userData = Object.assign(studentObj.dataValues, userObj.dataValues)
            res.send({
                userData: req.session.userData,
                userSID: req.sessionID
            })
        }
        else {
            // to be implemented in frontend
            res.send({})
        }
    } 
    else {
        res.send({})
    }
})

app.listen(port, "localhost", err => {
    if (err)
        console.error("Failed to setup server:", err)
    console.log("Server started on port " + port + "...")
})