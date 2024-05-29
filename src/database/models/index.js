/* eslint-disable no-undef */

const Sequelize = require('sequelize');
const process = require('process');
const logger = require('../../modules/Logger');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../../database/config.json')[env];
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

module.exports = db;
