import dotenv from 'dotenv'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import express from 'express'
import cors from 'cors'
import session from 'express-session'
import cookieParser from 'cookie-parser'
import redis from 'redis'
import RedisStore from 'connect-redis'
import { admin, dbUser, student } from './sequelizeModels.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({
    path: resolve(__dirname + '/../.env')
})

const app = express()
const port = process.env.BACKEND_PORT

const redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
})
redisClient.connect().catch(console.error)
const redisStore = new RedisStore({
    client: redisClient,
    prefix: "fmiappsid:",
})

redisClient.on('error', err => {
    console.error('Redis error: ' + err)
})
redisClient.on('connect', err => {
    console.log('Connected to Redis')
})

app.use(cors({
    origin: `http://${process.env.DOMAIN}:${process.env.FRONTEND_PORT}`,
    credentials: true
}))
app.use(cookieParser())
app.use(express.json())
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: {sameSite: 'strict'}
    })
)

app.get('/api/current-user', async (req, res) => {
    await redisStore.get(req.sessionID, (_, data) => {
        if(data) {
            res.send(true)
        } else {
            res.send(false)
        }
    })
})

app.post('/api/email-login', async (req, res) => {
    let hour = 3600000
    if(req.body.remember) {
        req.session.cookie.maxAge = 5 * 24 * hour // 5 days
    } else {
        req.session.cookie.maxAge = hour / 2 // 30 min
    }

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
            redisStore.set(req.sessionID, req.session)

            res.status(200).send(req.sessionID)
        }
        else if(adminObj) {
            req.session.userData = Object.assign(adminObj.dataValues, userObj.dataValues)
            redisStore.set(req.sessionID, req.session)

            res.status(200).send(req.sessionID)
        }
        else {
            // to be implemented
            res.status(400).send("User doesn't have an asigned role")
        }
    } 
    else {
        // to be implemented
        res.status(400).send("User not found in database")
    }
})

app.listen(port, "localhost", err => {
    if (err)
        console.error("Failed to setup server:", err)
    console.log("Server started on port " + port)
})