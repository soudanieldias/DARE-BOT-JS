const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../index.js');

class Guilds extends Model {}

Guilds.init({
  id: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  iconURL: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  bannerURL: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  sequelize,
  modelName: 'Guilds',
});

module.exports = Guilds;
