import { Router } from 'express';
import * as classController from './../controllers/class.js';

const router = Router();

router.route('/').get(classController.getClasses).post(classController.createClass);

router
    .route('/:id')
    .get(classController.getClassById)
    .put(classController.updateClassById)
    .delete(classController.deleteClassById);

export default router;
