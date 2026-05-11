const { Sequelize } = require('sequelize');
require('dotenv').config();

const isDev = process.env.NODE_ENV === 'development';

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: process.env.DB_TYPE,
    dialectOptions: {
        ssl: isDev ? false : {
            require: true,
            rejectUnauthorized: false
        }
    },
    logging: false
});

module.exports = sequelize;