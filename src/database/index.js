/* eslint-disable no-undef */
// const settings = require('./settings.js');

const Sequelize = require('sequelize');
const process = require('process');
const logger = require('../lib/logger');
const env = process.env.DB_ENV || 'development';
const config = require(__dirname + './config.json')[env];
const db = {};

let sequelize;

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
  );
}

logger.info('Sincronizando tabelas...');
sequelize.sync({ alter: true }).then(() => logger.log('Tabelas sincronizadas'));

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = {
  db
}
