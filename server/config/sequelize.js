import 'dotenv/config';
const { DATABASE_LOGIN } = process.env;

const defaultConfig = {
    url: DATABASE_LOGIN,
    dialect: 'postgres',
    logging: false,
};

export const development = {
    ...defaultConfig,
};

export const test = {
    ...defaultConfig,
};

export const production = {
    ...defaultConfig,
};
