import express from 'express'
import ViteExpress from 'vite-express'
import path from 'path'
import Sequelize, { DataTypes } from 'sequelize'

const app = express()
const port = 5173
const __dirname = path.resolve(path.dirname(''))
const sequilze = new Sequelize('postgres://fmi_app_db_admin:wLz*4p4M!dU9K$@localhost:5432/fmi_app_db')

try {
    await sequilze.authenticate()
    console.log('Connected to database')
} catch (e) {
    console.error('Database: ', error)
}

const dbUser = sequilze.define('dbUser', {
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

const users = await dbUser.findAll()
console.log(JSON.stringify(users, null, 2))

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'))
})

ViteExpress.listen(app, port, () => {
    console.log('Server started...')
})