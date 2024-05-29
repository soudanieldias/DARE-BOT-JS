/* eslint-disable no-undef */
const { Sequelize } = require('sequelize');
const connection = require('./connection.json');
const dotenv = require('dotenv');
dotenv.config();

const environment = process.env.DB_ENV || 'development';

const sequelize = new Sequelize(connection[environment]);


sequelize.sync().then(() => {
  console.log('Todos os Models foram sincronizados com sucesso.');
  console.log(process.env.DB_ENV, environment);
}).catch(err => {
  console.error('Ocorreu um erro enquanto os models eram sincronizados:', err);
});

module.exports = { sequelize };
