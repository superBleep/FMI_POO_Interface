import { Router } from 'express';
import * as userController from '../controllers/user.js';

const router = Router();

// TODO - Use validations before controller functions
// TODO - Check if authenticated

// ! TEMP | Old: /api/current-user
router.route('/is-current-user').get(userController.isCurrentUser);

// ! Move to auth
router.route('/current-user').get(userController.getCurrentUser);

router.route('/').get(userController.getUsers);

router
    .route('/:id')
    .get(UserController.getUserById)
    .put(UserController.updateUserById)
    .delete(UserController.deleteUserById);

export default router;
