import models from './../database/index.js';
import { redisStore } from './../libs/redis.js';

// TODO - Get current user - GET /users/current_user

// ! Old: /api/user-data
// Return current user data from cache
export const getCurrentUser = async (req, res, next) => {
    try {
        await redisStore.get(req.sessionID, (_, data) => {
            res.send(data);
        });
    } catch (err) {
        next(err);
    }
};

// ! Old: /api/current_user
// True if there is a user in cache
// False if there is no user in cache
export const isCurrentUser = async (req, res, next) => {
    try {
        await redisStore.get(req.sessionID, (_, data) => {
            if (data) {
                res.send(true);
            } else {
                res.send(false);
            }
        });
    } catch (err) {
        next(err);
    }
};

// TODO - Get all users - GET /users
export const getUsers = async (req, res, next) => {};

// TODO - Get user by id - GET /users/:id
export const getUserById = async (req, res, next) => {};

// TODO - Update user by id - PUT /users/:id
export const updateUserById = async (req, res, next) => {};

// TODO - Delete user by id - DELETE /users/:id
export const deleteUserById = async (req, res, next) => {};
