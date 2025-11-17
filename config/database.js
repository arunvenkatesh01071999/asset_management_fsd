const { Sequelize } = require('sequelize');

const DB_DRIVER = process.env.DB_DRIVER || 'postgres';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 5433;
const DB_NAME = process.env.DB_NAME || 'asset';
const DB_USER = process.env.DB_USER || 'postgres';
const DB_PASS = process.env.DB_PASS || '9629';

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: DB_DRIVER === 'sqlite' ? 'sqlite' : DB_DRIVER,
  storage: DB_DRIVER === 'sqlite' ? './database.sqlite' : undefined,
  logging: false,
});

module.exports = sequelize;
