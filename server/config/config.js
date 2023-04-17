const dotenv = require('dotenv');
const path = require('path');
dotenv.config({
    path: path.resolve(__dirname + '/../../.env'),
});

module.exports = {
    development: {
        url: process.env.DATABASE_LOGIN,
        dialect: 'postgres',
    },
    test: {
        url: process.env.DATABASE_LOGIN,
        dialect: 'postgres',
    },
    production: {
        url: process.env.DATABASE_LOGIN,
        dialect: 'postgres',
    },
};
