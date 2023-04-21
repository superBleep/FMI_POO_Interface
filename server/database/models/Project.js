import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Project extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                project_id: {
                    type: DataTypes.UUID,
                    allowNull: false,
                    primaryKey: true,
                    defaultValue: DataTypes.UUIDV4,
                },
                user_id: {
                    type: DataTypes.UUID,
                    allowNull: false,
                    references: {
                        model: 'User',
                        key: 'user_id',
                    },
                },
                class_id: {
                    type: DataTypes.UUID,
                    allowNull: false,
                    references: {
                        model: 'Class',
                        key: 'class_id',
                    },
                },
                name: {
                    type: DataTypes.STRING(100),
                    allowNull: true,
                },
                github_link: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
                observations: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: 'Project',
                timestamps: false,
                indexes: [
                    {
                        name: 'Project_pkey',
                        unique: true,
                        fields: [{ name: 'project_id' }],
                    },
                ],
            }
        );
    }
}
