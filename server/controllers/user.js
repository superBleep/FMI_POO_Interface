import { redisStore } from './../libs/redis.js';
import { models } from './../database/index.js';

// TODO - Get current user - GET /users/current_user

// ! Old: /api/user-data
// Return current user data from cache
export const getCurrentUser = async (req, res, next) => {
    try {
        await redisStore.get(req.sessionID, (_, data) => {
            res.send(data);
        });
    } catch (err) {
        console.log(err);
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
        console.log(err);
    }
};

// * Get all users - GET /users
export const getUsers = async (req, res, next) => {
    try {
        const UsersListResponse = await models.User.findAll();
        return res.status(200).json(UsersListResponse);
    } catch (err) {
        console.log(err);
    }
};

// * Get user by id - GET /users/:id
// TODO If id is not UUID -> throws error
export const getUserById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const userResponse = await models.User.findOne({
            where: { user_id: id },
        });

        if (userResponse === null) {
            return res.status(404).json('User not found');
        }

        return res.status(200).json(userResponse);
    } catch (err) {
        console.log(err);
    }
};

// * Update user by id - PUT /users/:id
export const updateUserById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const userResponse = await models.User.findOne({
            where: { user_id: id },
        });

        if (userResponse === null) {
            return res.status(404).json('User not found');
        }

        await userResponse.update(req.body);
        return res.status(200).json({ success: true });
    } catch (err) {
        console.log(err);
    }
};

// * Delete user by id - DELETE /users/:id
export const deleteUserById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const userResponse = await models.User.destroy({
            where: { user_id: id },
        });

        if (userResponse === 0) {
            return res.status(404).json('User not found');
        }

        return res.status(204).send();
    } catch (err) {
        console.log(err);
    }
};
