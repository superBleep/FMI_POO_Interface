import dotenv from 'dotenv';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import redis from 'redis';
import RedisStore from 'connect-redis';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import default_db from './default_db.js';

// Dotenv config
const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({
    path: resolve(__dirname + '/../../.env'),
});

// Redis config
const redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
});

redisClient.connect().catch(console.error);
redisClient.on('connect', () => {
    console.log('Connected to Redis');
});
redisClient.on('error', err => {
    console.error('Redis error: ' + err);
    process.exit();
});

const redisStore = new RedisStore({
    client: redisClient,
    prefix: 'fmiapssid:',
});

// JSON server config
const dbFile = join(__dirname, 'db.json');
const adapter = new JSONFile(dbFile);
const defaultData = default_db;
const db = new Low(adapter, defaultData);
await db.read();

// Express server config
const app = express();
const port = process.env.BACKEND_PORT;
const host = process.env.DOMAIN;

app.use(
    cors({
        origin: `http://${host}:${process.env.FRONTEND_PORT}`,
        credentials: true,
    })
);
app.use(cookieParser());
app.use(express.json());
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: true,
        cookie: { sameSite: 'strict' },
    })
);

// ----------- MOCK APIs -----------
// -------- AUTHENTICATION --------
app.get('/api/auth/is-current-user', async (req, res) => {
    try {
        await redisStore.get(req.sessionID, (_, data) => {
            if (data) res.send(true);
            else res.send(false);
        });
    } catch (err) {
        console.log(err);
    }
});

// User login
app.post('/api/auth/login-email', async (req, res) => {
    try {
        let found = false;

        let hour = 3600000;
        if (req.body.remember) req.session.cookie.maxAge = 5 * 24 * hour; // 5 days
        else req.session.cookie.maxAge = hour / 2; // 30 min

        let user;
        for(let u of db.data.users) {
            if(u.email == req.body.email && u.password == req.body.pass) 
                user = u;
        }
            
        if (user) {
            for(let student of db.data.students) {
                if(student.user_id == user.user_id) {
                    req.session.userData = Object.assign(user, student);
                    redisStore.set(req.sessionID, req.session);

                    res.status(200).send(req.sessionID);
                    found = true;
                }
            }
            
            for(let professor of db.data.professors) {
                if(professor.user_id == user.user_id) {
                    req.session.userData = Object.assign(user, professor);
                    redisStore.set(req.sessionID, req.session);

                    res.status(200).send(req.sessionID);
                    found = true;
                }
            }
            
            // to be implemented
            if(!found)
                res.status(400).send("User doesn't have an asigned role");
        } else {
            // to be implemented
            res.status(400).send('User not found in database');
        }
    } catch (err) {
        console.error(err);
    }
});

// User logout
app.get('/api/auth/logout', async (req, _) => {
    try {
        await redisStore.destroy(req.sessionID);
    } catch(err) {
        console.error(err);
    }
});

// -------- USERS table --------
// Fetch the data of the logged in user
app.get('/api/users/current-user', async (req, res) => {
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
app.get('/api/students/:student_id/projects', async (req, res) => {
    try {
        let projects = [];

        for(let project of db.data.projects) {
            if(project.student_id == req.params.student_id)
                projects.push(project);
        }
        
        if(!projects.length) return res.status(404);
        return res.status(200).json(projects);
    } catch(err) {
        console.error(err);
    }
});

// Fetch the CLASSES data of the logged in student by its ID
app.get('/api/students/:student_id/classes', async (req, res) => {
    try {
        let classesIds = [];
        let classes = [];

        for(let spc of db.data.students_professors_classes) {
            if(spc.student_id == req.params.student_id)
                classesIds.push(spc.class_id);
        }

        for(let cls of db.data.classes) {
            if(classesIds.includes(cls.class_id))
                classes.push(cls);
        }

        return res.status(200).json(classes);
    } catch (err) {
        console.log(err);
    }
});

// Fetch the PROFESSORS data of the logged in student by its ID
// and the 'professor_type' column
app.get('/api/students/:student_id/professors/:type', async (req, res) => {
    try {
        let professorsIds = [];
        let professors = [];

        for(let spc of db.data.students_professors_classes) {
            if(spc.student_id == req.params.student_id)
                professorsIds.push(spc.professor_id);
        }

        for(let prof of db.data.professors) {
            if(professorsIds.includes(prof.professor_id)) {
                for(let user of db.data.users) {
                    if(user.user_id == prof.user_id) {
                        Object.assign(prof, user);
                        professors.push(prof);
                    }
                }
            }
        }

        return res.status(200).json(professors);
    } catch (err) { 
        console.log(err);
    }
});

// -------- PROJECTS table --------
// Add an entry to the PROJECTS table
app.post('/api/projects', async (req, res) => {
    try {
        const projectId = db.data.projects.length + 1
        
        Object.assign(req.body, {"project_id": projectId});
        db.data.projects.push(req.body);
        await db.write();

        res.status(201).json();
    } catch (err) {
        console.log(err);
    }
});

// Delete an entry from the PROJECTS table by ID
app.delete('/api/projects/:project_id', async (req, res, next) => {
    try {
        function toBeDeleted(e) {
            return e.project_id == req.params.project_id;
        }

        db.data.projects.splice(db.data.projects.findIndex(toBeDeleted), 1);
        db.write();

        return res.status(204);
    } catch (err) {
        console.log(err);
    }
});

app.listen(port, host, async err => {
    if(err) console.error('Failed to setup server:', err);

    console.log('Server started on port ' + port);    
})