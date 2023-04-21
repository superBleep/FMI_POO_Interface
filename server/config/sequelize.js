// ! FIX THIS
// import 'dotenv/config';

// ! TEMP env loading
import dotenv from 'dotenv';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({
    path: resolve(__dirname + './../../.env'),
});

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
