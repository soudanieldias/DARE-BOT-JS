// /* eslint-disable no-undef */
const { Sequelize } = require('sequelize');
const fs = require('fs');
const path = require('path');
const connection = require('./connection.json');

const environment = process.env.NODE_ENV || 'development';

const sequelize = new Sequelize(connection[environment]);

const modelsDir = path.join(__dirname, 'models');
fs.readdirSync(modelsDir).forEach(file => {
  if (file.endsWith('.js')) {
    require(path.join(modelsDir, file));
  }
});

sequelize.sync().then(() => {
  console.log('All models were synchronized successfully.');
}).catch(err => {
  console.error('An error occurred while synchronizing models:', err);
});

module.exports = { sequelize, Sequelize };
