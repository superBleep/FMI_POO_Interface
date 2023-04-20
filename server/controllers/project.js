import models from './../database/index.js';

// TODO - Get all projects - GET /projects
export const getProjects = async (req, res, next) => {};

// TODO - Create project - POST /projects
// ! Currently old /api/post-project
export const createProject = async (req, res, next) => {
    try {
        const { user_id, class_id, body } = req.body;

        models.Project.create({
            body,
            user_id: user_id,
            class_id: class_id,
        });

        res.status(200);
    } catch (err) {
        next(err);
    }
};

// TODO - Get project by id - GET /projects/:id
// ! Currently old /api/user-projects
export const getProjectById = async (req, res, next) => {
    try {
        const project = await models.Project.findAll({
            where: {
                user_id: req.body.user_id,
            },
        });

        if (project.length) {
            res.status(200).json(
                Object.keys(project).map((key) => {
                    return project[key].dataValues;
                })
            );
        } else {
            res.status(404).send();
        }
    } catch (err) {
        next(err);
    }
};

// TODO - Update project by id - PUT /projects/:id
export const updateProjectById = async (req, res, next) => {};

// TODO - Delete project by id - DELETE /projects/:id
// ! Currently old /api/delete-project
export const deleteProjectById = async (req, res, next) => {
    try {
        models.Project.findOne({
            where: {
                id: req.params.id,
            },
        })
            .then((project) => project.destroy())
            .then((res) => res);
    } catch (err) {
        next(err);
    }
};
