import dotenv from 'dotenv'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import { Sequelize, DataTypes } from 'sequelize'

const __dirname = dirname(fileURLToPath(import.meta.url))
dotenv.config({
    path: resolve(__dirname + '/../.env')
})

export const sequelize = new Sequelize(process.env.DATABASE_LOGIN, {logging: false})

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

export const dbProject = sequelize.define('dbProject', {
    student_id: {
        type: DataTypes.INTEGER,
        references: 'student',
        referencesKey: 'id',
        primaryKey: true
    },
    link: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    starred: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
    },
    observations: {
        type: DataTypes.TEXT
    },
    outdated: {
        type: DataTypes.ENUM('yellow', 'orange', 'red')
    }
}, {
    tableName: 'project',
    timestamps: false
})