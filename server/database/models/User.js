import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class User extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                user_id: {
                    type: DataTypes.UUID,
                    allowNull: false,
                    primaryKey: true,
                    defaultValue: DataTypes.UUIDV4,
                },
                user_type: {
                    type: DataTypes.ENUM('admin', 'professor', 'student'),
                    allowNull: false,
                    defaultValue: 'student',
                },
                first_name: {
                    type: DataTypes.STRING(30),
                    allowNull: false,
                },
                last_name: {
                    type: DataTypes.STRING(50),
                    allowNull: false,
                },
                email: {
                    type: DataTypes.STRING(50),
                    allowNull: false,
                },
                password: {
                    type: DataTypes.TEXT,
                    allowNull: false,
                },
                study_year: {
                    type: DataTypes.STRING(5),
                    allowNull: true,
                },
                study_group: {
                    type: DataTypes.STRING(5),
                    allowNull: true,
                },
                github_token: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: 'User',
                timestamps: false,
                indexes: [
                    {
                        name: 'User_pkey',
                        unique: true,
                        fields: [{ name: 'user_id' }],
                    },
                ],
                schema: 'app'
            }
        );
    }
}
