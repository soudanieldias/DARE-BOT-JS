const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../index.js');

class Users extends Model {}

Users.init({
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  points: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
}, {
  sequelize,
  modelName: 'Users'
});

module.exports = Users;
