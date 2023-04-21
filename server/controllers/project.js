import { models } from './../database/index.js';

// * Get all projects - GET /projects
export const getProjects = async (req, res, next) => {
    try {
        const projectsListResponse = await models.Project.findAll();
        return res.status(200).json(projectsListResponse);
    } catch (err) {
        next(err);
    }
};

// * Create project - POST /projects
export const createProject = async (req, res, next) => {
    try {
        const projectResponse = await models.Project.create(req.body);

        res.status(201).json(projectResponse);
    } catch (err) {
        next(err);
    }
};

// * Get project by id - GET /projects/:id
export const getProjectById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const projectResponse = await models.Project.findOne({
            where: { project_id: id },
        });

        if (projectResponse === null) {
            return res.status(404).json('Project not found');
        }

        return res.status(200).json(projectResponse);
    } catch (err) {
        next(err);
    }
};

// * Update project by id - PUT /projects/:id
export const updateProjectById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const projectResponse = await models.Project.findOne({
            where: { project_id: id },
        });

        if (projectResponse === null) {
            return res.status(404).json('Project not found');
        }

        await projectResponse.update(req.body);
        return res.status(200).json({ success: true });
    } catch (err) {
        next(err);
    }
};

// * Delete project by id - DELETE /projects/:id
export const deleteProjectById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const projectResponse = await models.Project.destroy({
            where: { project_id: id },
        });

        if (projectResponse === 0) {
            return res.status(404).json('Project not found');
        }

        return res.status(204).send();
    } catch (err) {
        next(err);
    }
};
