import dotenv from 'dotenv';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import jsonServer from 'json-server';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import redis from 'redis';
import RedisStore from 'connect-redis';

const server = jsonServer.create();
const router = jsonServer.router('./mock_db.json');
const middlewares = jsonServer.defaults({"logger": false});

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({
    path: resolve(__dirname + '../../../../.env'),
});
const backendLink = `http://${process.env.DOMAIN}:${process.env.BACKEND_PORT}`;

server.use(middlewares);
server.use(
    cors({
        origin: `http://${process.env.DOMAIN}:${process.env.FRONTEND_PORT}`,
        credentials: true,
    })
);
server.use(cookieParser());
server.use(jsonServer.bodyParser);
server.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { sameSite: 'strict' },
    })
)

const redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
});

redisClient.connect().catch(console.error);

redisClient.on('connect', () => {
    console.log('Connected to Redis');
});

redisClient.on('error', (err) => {
    console.error('Redis error: ' + err);
});

const redisStore = new RedisStore({
    client: redisClient,
    prefix: 'fmiappsid:',
});

server.get('/api/users/is-current-user', async (req, res) => {
    try {
        await redisStore.get(req.sessionID, (_, data) => {
            if (data) {
                res.send(true);
            } else {
                res.send(false);
            }
        });
    } catch (err) {
        console.log(err);
    }
});

server.post('/api/auth/login-email', async (req, res) => {
    try {
        let hour = 3600000;
        if (req.body.remember) {
            req.session.cookie.maxAge = 5 * 24 * hour; // 5 days
        } else {
            req.session.cookie.maxAge = hour / 2; // 30 min
        }

        let userObj = (await fetch(`${backendLink}/user?email=${req.body.email}&password=${req.body.pass}`, {
            header: {
                'Content-Type': 'application/json',
            },
            method: 'GET'
        }).then(res => res.json()))[0];

        if (userObj) {
            let studentObj = (await fetch(`${backendLink}/student?user_id=${userObj['user_id']}`, {
                header: {
                    'Content-Type': 'application/json',
                },
                method: 'GET'
            }).then(res => res.json()));
            let professorObj = (await fetch(`${backendLink}/professor?user_id=${userObj['user_id']}`, {
                header: {
                    'Content-Type': 'application/json',
                },
                method: 'GET'
            }).then(res => res.json()));

            if (studentObj.length) {
                req.session.userData = Object.assign(userObj, studentObj[0]);
                redisStore.set(req.sessionID, req.session);

                res.status(200).send(req.sessionID);
            }
            else if (professorObj.length) {
                req.session.userData = Object.assign(userObj, professorObj[0]);
                redisStore.set(req.sessionID, req.session);

                res.status(200).send(req.sessionID);
            }
            else {
                // to be implemented
                res.status(400).send("User doesn't have an asigned role");
            }
        } else {
            // to be implemented
            res.status(400).send('User not found in database');
        }
    } catch (err) {
        console.error(err);
    }
});

server.get('/api/users/current-user', async (req, res) => {
    try {
        await redisStore.get(req.sessionID, (_, data) => {
            res.send(data);
        });
    } catch (err) {
        console.log(err);
    }
});

server.get('/api/projects/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const projectResp = await fetch(`${backendLink}/project?user_id=${id}`, {
            header: {
                'Content-Type': 'application/json',
            },
            method: 'GET'
        }).then(res => res.json())

        if (!projectResp.length) {
            return res.status(404);
        }

        return res.status(200).json(projectResp);
    } catch (err) {
        console.log(err);
    }
});

server.post('/api/projects', async (req, res) => {
    console.log(req.body)
    try {
        const projectResp = await fetch(`${backendLink}/project`, {
            header: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(req.body)
        })

        res.status(201).json(projectResp);
    } catch (err) {
        console.log(err);
    }
});

server.delete('/api/projects/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        const projectResponse = await models.Project.destroy({
            where: { project_id: id },
        });

        if (projectResponse === 0) {
            return res.status(404).json('Project not found');
        }

        return res.status(204).send();
    } catch (err) {
        console.log(err);
    }
});

server.use(router)
server.listen(process.env.BACKEND_PORT, () => {
    console.log("Starting JSON server...")
})