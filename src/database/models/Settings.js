const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../index.js');

class Settings extends Model {}

Settings.init({
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.STRING,
  },
  ownerId: DataTypes.STRING,
  staffChannelId: DataTypes.STRING,
  ticketChannelId: DataTypes.STRING,
  announcesChannelId: DataTypes.STRING,
  modRoleId: DataTypes.STRING,
  ticketCategoryId: DataTypes.STRING,
  ticketLogsChannelId: DataTypes.STRING,
  ticketRoleId: DataTypes.STRING,
  ticketTitle: DataTypes.STRING,
  ticketButtonName: DataTypes.STRING,
  ticketDescription: DataTypes.STRING(2048),
  createdAt: {
    allowNull: false,
    type: DataTypes.DATE,
  },
  updatedAt: {
    allowNull: false,
    type: DataTypes.DATE,
  },
}, {
  sequelize,
  modelName: 'Settings',
});

module.exports = Settings;
