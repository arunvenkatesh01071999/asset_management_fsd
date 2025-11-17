const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AssetStatus = sequelize.define('asset_status', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  status_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
}, {
  timestamps: true,
});

module.exports = AssetStatus;
