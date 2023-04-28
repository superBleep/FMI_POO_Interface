import _sequelize from 'sequelize';
const { Model, Sequelize } = _sequelize;

export default class Class extends Model {
    static init(sequelize, DataTypes) {
        return super.init(
            {
                class_id: {
                    type: DataTypes.UUID,
                    allowNull: false,
                    primaryKey: true,
                    defaultValue: DataTypes.UUIDV4,
                },
                name: {
                    type: DataTypes.STRING(100),
                    allowNull: false,
                },
                description: {
                    type: DataTypes.TEXT,
                    allowNull: true,
                },
            },
            {
                sequelize,
                tableName: 'Class',
                timestamps: false,
                indexes: [
                    {
                        name: 'Class_pkey',
                        unique: true,
                        fields: [{ name: 'class_id' }],
                    },
                ],
                schema: 'app'
            }
        );
    }
}
