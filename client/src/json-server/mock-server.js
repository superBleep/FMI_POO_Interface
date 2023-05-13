import dotenv from 'dotenv';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import jsonServer from 'json-server';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import redis from 'redis';
import RedisStore from 'connect-redis';

// JSON-server config
const server = jsonServer.create();
const router = jsonServer.router('./mock-db.json');
const middlewares = jsonServer.defaults({"logger": false});

// Dotenv config
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({
    path: resolve(__dirname + '../../../../.env'),
});
const backendLink = `http://${process.env.DOMAIN}:${process.env.BACKEND_PORT}`;

// JSON-server steup
server.use(middlewares);
server.use(cookieParser());
server.use(jsonServer.bodyParser);
server.use(
    cors({
        origin: `http://${process.env.DOMAIN}:${process.env.FRONTEND_PORT}`,
        credentials: true,
    })
);
server.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { sameSite: 'strict' },
    })
)

// Redis setup
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

// ----------- MOCK APIs -----------
// -------- AUTHENTICATION --------
// Check whether user is logged in or not
server.get('/api/auth/is-current-user', async (req, res) => {
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

// User login
server.post('/api/auth/login-email', async (req, res) => {
    try {
        let hour = 3600000;
        if (req.body.remember) {
            req.session.cookie.maxAge = 5 * 24 * hour; // 5 days
        } else {
            req.session.cookie.maxAge = hour / 2; // 30 min
        }

        let userObj = (await fetch(`${backendLink}/users?email=${req.body.email}&password=${req.body.pass}`, {
            header: {
                'Content-Type': 'application/json',
            },
            method: 'GET'
        }).then(res => res.json()))[0];

        if (userObj) {
            let studentObj = (await fetch(`${backendLink}/students?user_id=${userObj['user_id']}`, {
                header: {
                    'Content-Type': 'application/json',
                },
                method: 'GET'
            }).then(res => res.json()));
            let professorObj = (await fetch(`${backendLink}/professors?user_id=${userObj['user_id']}`, {
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

// -------- USERS table --------
// Fetch the data of the logged in user
server.get('/api/users/current-user', async (req, res) => {
    try {
        await redisStore.get(req.sessionID, (_, data) => {
            res.send(data);
        });
    } catch (err) {
        console.log(err);
    }
});

// -------- STUDENTS table --------
// Fetch the PROJECTS data of the logged in student by its ID
server.get('/api/students/:student_id/projects', async (req, res) => {
    try {
        const { student_id } = req.params;

        const projectResp = await fetch(`${backendLink}/projects?student_id=${student_id}`, {
            header: {
                'Content-Type': 'application/json',
            },
            method: 'GET'
        }).then(res => res.json());

        if (!projectResp.length) {
            return res.status(404);
        }

        return res.status(200).json(projectResp);
    } catch (err) {
        console.log(err);
    }
});

// Fetch the CLASSES data of the logged in student by its ID
server.get('/api/students/:student_id/classes', async (req, res) => {
    try {
        const { student_id } = req.params;
        let classesArr = [];

        let classes = await fetch(`${backendLink}/students_professors_classes?student_id=${student_id}`, {
            header: {
                'Content-Type': 'application/json',
            },
            method: 'GET'
        }).then(res => res.json());
        classes = classes.map(e => e['class_id']);

        for(let clsId of classes) {
            let cls = await fetch(`${backendLink}/classes?class_id=${clsId}`, {
                header: {
                    'Content-Type': 'application/json',
                },
                method: 'GET'
            }).then(res => res.json());

            classesArr.push(cls[0]);
        }

        return res.status(200).json(classesArr);
    } catch (err) {
        console.log(err);
    }
});

// Fetch the PROFESSORS data of the logged in student by its ID
// and the 'professor_type' column
server.get('/api/students/:student_id/professors/:type', async (req, res) => {
    try {
        let profsObj = [];

        let profsIds = await fetch(`${backendLink}/students_professors_classes?student_id=${req.params.student_id}`, {
            header: {
                'Content-Type': 'application/json', 
            },
            method: 'GET'
        }).then(res => res.json());
        profsIds = profsIds.map(e => e['professor_id']);

        for(let profId of profsIds) {
            let profData = await fetch(`${backendLink}/professors?professor_id=${profId}&professor_type=${req.params.type}`, {
                header: {
                    'Content-Type': 'application/json', 
                },
                method: 'GET'
            }).then(res => res.json());
            
            let profUserData = await fetch(`${backendLink}/users?user_id=${profData[0]['user_id']}`, {
                header: {
                    'Content-Type': 'application/json',
                },
                method: 'GET'
            }).then(res => res.json());

            profsObj.push(profUserData[0]);
        }

        return res.status(200).json(profsObj);
    } catch (err) { 
        console.log(err);
    }
});

// -------- PROJECTS table --------
// Add an entry to the PROJECTS table
server.post('/api/projects', async (req, res) => {
    try {
        console.log(req.body)

        const projectResp = await fetch(`${backendLink}/projects`, {
            header: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify(req.body)
        }).then(res => res.json());

        res.status(201);
    } catch (err) {
        console.log(err);
    }
});

// Delete an entry from the PROJECTS table by ID
server.delete('/api/projects/:project_id', async (req, res, next) => {
    try {
        const { project_id } = req.params;

        await fetch(`${backendLink}/projects?project_id=${project_id}`, {
            header: {
                'Content-Type': 'application/json',
            },
            method: 'DELETE'
        });

        return res.status(204).send();
    } catch (err) {
        console.log(err);
    }
});

// Start the server
server.use(router)
server.listen(process.env.BACKEND_PORT, () => {
    console.log("Starting JSON server...")
})