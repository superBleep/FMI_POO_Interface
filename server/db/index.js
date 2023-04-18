import dotenv from 'dotenv';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { Sequelize } from 'sequelize';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({
    path: resolve(__dirname + '/../../.env'),
});

export const sequelize = new Sequelize(process.env.DATABASE_LOGIN, {
    logging: false,
});

try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully with the database.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}
