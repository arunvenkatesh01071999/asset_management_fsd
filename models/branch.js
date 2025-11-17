const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Branch = sequelize.define('branch', {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  branch_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

module.exports = Branch;
