/* eslint-disable no-undef */
const { Sequelize } = require('sequelize');
const connection = require('./connection.json');

const environment = process.env.NODE_ENV || 'development';

const sequelize = new Sequelize(connection[environment]);


sequelize.sync().then(() => {
  console.log('All models were synchronized successfully.');
}).catch(err => {
  console.error('An error occurred while synchronizing models:', err);
});

module.exports = { sequelize };
