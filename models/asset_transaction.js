const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const AssetTransaction = sequelize.define("asset_transaction", {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    asset_id: { type: DataTypes.INTEGER, allowNull: false },
    employee_id: { type: DataTypes.INTEGER, allowNull: false },
    reason: { type: DataTypes.TEXT, allowNull: true },
    status_id :{ type: DataTypes.INTEGER, allowNull: false },
    issue_date :{ type: DataTypes.DATE, allowNull: true },
    return_date :{ type: DataTypes.DATE, allowNull: true },
    scrap_date :{ type: DataTypes.DATE, allowNull: true }
}, {
    underscored: true,
    timestamps: true
});

module.exports = AssetTransaction;
