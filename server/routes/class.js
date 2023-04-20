import { Router } from 'express';
import * as classController from './../controllers/class.js';

const router = Router();

router.router('/').get(classController.getClasses).post(classController.createClass);

router
    .router('/:id')
    .get(classController.getClassById)
    .put(classController.updateClassById)
    .delete(classController.deleteClassById);

export default router;
