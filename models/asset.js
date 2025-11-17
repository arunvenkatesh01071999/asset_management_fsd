
const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Asset = sequelize.define("asset", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  serial_number: { type: DataTypes.STRING, allowNull: false, unique: true },
  make: { type: DataTypes.STRING, allowNull: true },
  model: { type: DataTypes.STRING, allowNull: true },
  asset_category_id: { type: DataTypes.INTEGER, allowNull: false }, 
  stock: { type: DataTypes.DECIMAL(12, 2), allowNull: true },
  branch_id: { type: DataTypes.INTEGER, allowNull: false }
}, {
  underscored: true,
  timestamps: true
});

module.exports = Asset;
