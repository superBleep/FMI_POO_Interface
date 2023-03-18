import { Sequelize, DataTypes } from 'sequelize'

export const sequelize = new Sequelize('postgres://fmi_app_db_admin:wLz*4p4M!dU9K$@localhost:5432/fmi_app_db', {logging: false})

export const dbUser = sequelize.define('dbUser', {
    surname: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    name: {
        type: DataTypes.STRING(20),
        allowNull: false
    },
    initial: {
        type: DataTypes.STRING(4)
    },
    email: {
        type: DataTypes.STRING(70),
        allowNull: false
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: 'dbuser',
    timestamps: false
})

export const student = sequelize.define('student', {
    github: {
        type: DataTypes.TEXT,
    }
}, {
    tableName: 'student',
    timestamps: false
})

export const admin = sequelize.define('admin', {
    type: {
        type: DataTypes.STRING(20)
    }
}, {
    tableName: 'admin',
    timestamps: false
})