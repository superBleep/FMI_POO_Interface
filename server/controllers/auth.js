import { models } from './../database/index.js';
import { redisStore } from './../libs/redis.js';

// TODO - Login request with email - POST /auth/login-email
export const loginEmail = async (req, res, next) => {
    try {
        let hour = 3600000;
        if (req.body.remember) {
            req.session.cookie.maxAge = 5 * 24 * hour; // 5 days
        } else {
            req.session.cookie.maxAge = hour / 2; // 30 min
        }

        let userObj = await models.User.findOne({
            where: {
                email: req.body.email,
                password: req.body.password,
            },
        });

        if (userObj) {
            if (userObj.user_type === 'student') {
                req.session.userData = Object.assign(userObj.dataValues);
                redisStore.set(req.sessionID, req.session);

                res.status(200).send(req.sessionID);
            } else if (userObj.user_type === 'admin') {
                req.session.userData = Object.assign(userObj.dataValues);
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
    } catch (err) {
        next(err);
    }
};

// TODO - Login request - POST /auth/login
// ! - Email + Github login
export const login = async (req, res, next) => {};

// TODO - Register request - POST /auth/register
export const register = async (req, res, next) => {};
