import { Sequelize } from 'sequelize';
import * as config from '../config/sequelize.js';
import initModels from './models/init-models.js';

const env = process.env.NODE_ENV || 'development';
const sequelizeConfig = config[env];

// Need to specify the url. Cannot use only the sequelize config.
export const sequelize = new Sequelize(sequelizeConfig.url, sequelizeConfig);

try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully with the database.');
} catch (error) {
    console.error('Unable to connect to the database:', error);
}

// TODO - Convert CommonJS models to ESM
// Init models
export const models = initModels(sequelize);
