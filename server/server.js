import dotenv from 'dotenv';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import { sequelize } from './database/index.js';
import * as configs from './config/index.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({
    path: resolve(__dirname + '/../.env'),
});

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

// * Router
configs.routerConfig(app);

app.listen(port, 'localhost', async (err) => {
    if (err) console.error('Failed to setup server:', err);

    // TODO - Switch .sync() for migrations
    await sequelize.sync({
        schema: 'app'
    });
    console.log('Database synced');

    console.log('Server started on port ' + port);
});
