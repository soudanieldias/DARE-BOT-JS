const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('./index');

class settings extends Model {}

settings.init(
  {
    id: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING,
    },
    owner_id: DataTypes.STRING,
    staff_channel_id: DataTypes.STRING,
    announces_channel_id: DataTypes.STRING,
    mod_role_id: DataTypes.STRING,
    ticket_category_id: DataTypes.STRING,
    ticket_logs_channel_id: DataTypes.STRING,
    ticket_role_id: DataTypes.STRING,
    ticket_title: DataTypes.STRING,
    ticket_description: DataTypes.STRING(2048),
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
    },
  },
  {
    sequelize,
    modelName: 'settings',
  }
);

module.exports = {
  settings,
};
