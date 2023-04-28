import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class User_Class extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                user_id: {
                    type: DataTypes.UUID,
                    allowNull: false,
                    primaryKey: true,
                    references: {
                        model: 'User',
                        key: 'user_id',
                    },
                },
                class_id: {
                    type: DataTypes.UUID,
                    allowNull: false,
                    primaryKey: true,
                    references: {
                        model: 'Class',
                        key: 'class_id',
                    },
                },
            },
            {
                sequelize,
                tableName: 'User_Class',
                timestamps: false,
                indexes: [
                    {
                        name: 'User_Class_pkey',
                        unique: true,
                        fields: [{ name: 'user_id' }, { name: 'class_id' }],
                    },
                ],
                schema: 'app'
            }
        );
    }
}
