import { Router } from 'express';
import * as projectController from '../controllers/project.js';

const router = Router();

// TODO - Use validations before controller functions
// TODO - Check if authenticated

router.route('/').get(projectController.getProjects).post(projectController.createProject);

router
    .route('/:id')
    .get(projectController.getProjectById)
    .put(projectController.updateProjectById)
    .delete(projectController.deleteProjectById);

export default router;
