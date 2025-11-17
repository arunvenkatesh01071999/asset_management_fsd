const Asset = require("./asset");
const Employee = require("./employee");
const AssetTransaction = require("./asset_transaction");
const AssetCategory = require("./asset_category");
const AssetStatus = require("./asset_status");
const Branch = require("./branch");


Asset.hasMany(AssetTransaction, { foreignKey: "asset_id" });
AssetTransaction.belongsTo(Asset, { foreignKey: "asset_id" });

Asset.belongsTo(AssetCategory, { foreignKey: "asset_category_id" });
AssetCategory.hasMany(Asset, { foreignKey: "asset_category_id" });

Asset.belongsTo(Branch, { foreignKey: "branch_id" });
Branch.hasMany(Asset, { foreignKey: "branch_id" });

Employee.hasMany(AssetTransaction, { foreignKey: "employee_id" });
AssetTransaction.belongsTo(Employee, { foreignKey: "employee_id" });

Employee.belongsTo(Branch, { foreignKey: "branch_id" });
Branch.hasMany(Employee, { foreignKey: "branch_id" });

AssetTransaction.belongsTo(AssetStatus, { foreignKey: "status_id" });
AssetStatus.hasMany(AssetTransaction, { foreignKey: "status_id" });

module.exports = {
  Asset,
  Employee,
  AssetTransaction,
  AssetCategory,
  AssetStatus,
  Branch
};
