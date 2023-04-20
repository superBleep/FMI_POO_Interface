import _sequelize from 'sequelize';
const DataTypes = _sequelize.DataTypes;
import _Class from './Class.js';
import _Project from './Project.js';
import _User from './User.js';
import _User_Class from './User_Class.js';

export default function initModels(sequelize) {
    const Class = _Class.init(sequelize, DataTypes);
    const Project = _Project.init(sequelize, DataTypes);
    const User = _User.init(sequelize, DataTypes);
    const User_Class = _User_Class.init(sequelize, DataTypes);

    Class.belongsToMany(User, {
        as: 'user_id_Users',
        through: User_Class,
        foreignKey: 'class_id',
        otherKey: 'user_id',
    });
    User.belongsToMany(Class, {
        as: 'class_id_Classes',
        through: User_Class,
        foreignKey: 'user_id',
        otherKey: 'class_id',
    });
    Project.belongsTo(Class, { as: 'class', foreignKey: 'class_id' });
    Class.hasMany(Project, { as: 'Projects', foreignKey: 'class_id' });
    User_Class.belongsTo(Class, { as: 'class', foreignKey: 'class_id' });
    Class.hasMany(User_Class, { as: 'User_Classes', foreignKey: 'class_id' });
    Project.belongsTo(User, { as: 'user', foreignKey: 'user_id' });
    User.hasMany(Project, { as: 'Projects', foreignKey: 'user_id' });
    User_Class.belongsTo(User, { as: 'user', foreignKey: 'user_id' });
    User.hasMany(User_Class, { as: 'User_Classes', foreignKey: 'user_id' });

    return {
        Class,
        Project,
        User,
        User_Class,
    };
}
