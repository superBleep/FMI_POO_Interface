import dotenv from 'dotenv';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';

import { dbUser, student, admin, dbProject } from './sequelizeModels.js';

import { sequelize, models } from './database/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({
    path: resolve(__dirname + '/../.env'),
});

import { redisStore } from './libs/redis.js';

const app = express();
const port = process.env.BACKEND_PORT;

app.use(
    cors({
        origin: `http://${process.env.DOMAIN}:${process.env.FRONTEND_PORT}`,
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

app.get('/api/current-user', async (req, res) => {
    await redisStore.get(req.sessionID, (_, data) => {
        if (data) {
            res.send(true);
        } else {
            res.send(false);
        }
    });
});

app.get('/api/user-data', async (req, res) => {
    await redisStore.get(req.sessionID, (_, data) => {
        res.send(data);
    });
});

app.post('/api/user-projects', async (req, res) => {
    let projectsObj = await dbProject.findAll({
        where: {
            student_id: req.body.student_id,
        },
    });

    if (projectsObj.length) {
        res.status(200).json(
            Object.keys(projectsObj).map((key) => {
                return projectsObj[key].dataValues;
            })
        );
    } else {
        res.status(404).send();
    }
});

app.post('/api/delete-project', async (req, res) => {
    dbProject
        .findOne({
            where: {
                id: req.body.id,
            },
        })
        .then((project) => project.destroy())
        .then((res) => res);
});

app.post('/api/post-project', async (req, res) => {
    dbProject.create({
        student_id: req.body.student_id,
        name: req.body.name,
        link: req.body.link,
        starred: false,
    });

    res.status(200);
});

app.post('/api/email-login', async (req, res) => {
    let hour = 3600000;
    if (req.body.remember) {
        req.session.cookie.maxAge = 5 * 24 * hour; // 5 days
    } else {
        req.session.cookie.maxAge = hour / 2; // 30 min
    }

    let userObj = await dbUser.findOne({
        where: {
            email: req.body.email,
            password: req.body.pass,
        },
    });

    if (userObj) {
        let studentObj = await student.findOne({
            where: {
                id: userObj.dataValues.id,
            },
        });

        let adminObj = await admin.findOne({
            where: {
                id: userObj.dataValues.id,
            },
        });

        if (studentObj) {
            req.session.userData = Object.assign(studentObj.dataValues, userObj.dataValues);
            redisStore.set(req.sessionID, req.session);

            res.status(200).send(req.sessionID);
        } else if (adminObj) {
            req.session.userData = Object.assign(adminObj.dataValues, userObj.dataValues);
            redisStore.set(req.sessionID, req.session);

            res.status(200).send(req.sessionID);
        } else {
            // to be implemented
            res.status(400).send("User doesn't have an asigned role");
        }
    } else {
        // to be implemented
        res.status(400).send('User not found in database');
    }
});

app.listen(port, 'localhost', async (err) => {
    if (err) console.error('Failed to setup server:', err);

    // TODO - Switch .sync() for migrations
    await sequelize.sync();
    console.log('Database synced');

    console.log('Server started on port ' + port);
});
