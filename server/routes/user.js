import { Router } from 'express';
import * as userController from '../controllers/user.js';

const router = Router();

// TODO - Use validations before controller functions
// TODO - Check if authenticated

router.route('/').get(userController.getUsers);

router.route('/current_user').get(userController.getCurrentUser);

router
    .route('/:id')
    .get(UserController.getUserById)
    .put(UserController.updateUserById)
    .delete(UserController.deleteUserById);

export default router;
