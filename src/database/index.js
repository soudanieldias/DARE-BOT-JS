/* eslint-disable no-undef */
const { Sequelize } = require('sequelize');
const connection = require('./connection.json');
const dotenv = require('dotenv');
const LoggerModule = require('../utils/LoggerModule');
dotenv.config();

const environment = process.env.DB_ENV || 'production';
const logger = new LoggerModule();

const sequelize = new Sequelize(connection[environment]);

sequelize
  .sync()
  .then(() => {
    logger.info('Database', 'Todos os Models foram sincronizados com sucesso.');
    logger.info('Database', `Conectado no ambiente: ${process.env.DB_ENV}`);
  })
  .catch(err => {
    logger.error(
      'Database',
      `Ocorreu um erro enquanto os models eram sincronizados: ${err}`
    );
  });

module.exports = { sequelize };
