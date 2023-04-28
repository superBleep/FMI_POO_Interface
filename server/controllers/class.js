import { models } from './../database/index.js';

// * Get all classes - GET /classes
export const getClasses = async (req, res, next) => {
    try {
        const classesListResponse = await models.Class.findAll();
        return res.status(200).json(classesListResponse);
    } catch (err) {
        console.log(err);
    }
};

// * Create class - POST /classes
export const createClass = async (req, res, next) => {
    try {
        const classResponse = await models.Class.create(req.body);
        res.status(201).json(classResponse);
    } catch (err) {
        console.log(err);
    }
};

// * Get class by id - GET /classes/:id
export const getClassById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const classResponse = await models.Class.findOne({
            where: { class_id: id },
        });

        if (classResponse === null) {
            return res.status(404).json('Class not found');
        }

        return res.status(200).json(classResponse);
    } catch (err) {
        console.log(err);
    }
};

// * Update class by id - PUT /classes/:id
export const updateClassById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const classResponse = await models.Class.findOne({
            where: { class_id: id },
        });

        if (classResponse === null) {
            return res.status(404).json('Class not found');
        }

        await classResponse.update(req.body);
        return res.status(200).json({ success: true });
    } catch (err) {
        console.error(err);
    }
};

// * Delete class by id - DELETE /classes/:id
export const deleteClassById = async (req, res, next) => {
    try {
        const { id } = req.params;

        const classResponse = await models.Class.destroy({
            where: { class_id: id },
        });

        if (classResponse === 0) {
            return res.status(404).json('Class not found');
        }

        return res.status(204).send();
    } catch (err) {
        console.log(err);
    }
};
