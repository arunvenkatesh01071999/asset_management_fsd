const { Op, Sequelize } = require("sequelize");
const {
  Asset,
  Employee,
  AssetTransaction,
  AssetCategory,
  AssetStatus,
  Branch
} = require("../models");

const sequelize = require("../config/database");



const issueAssetService = async ({ asset_id, employee_id }) => {
  return sequelize.transaction(async (t) => {
    const asset = await Asset.findByPk(asset_id, { transaction: t });
    if (!asset) throw new Error("Asset not found");

    const employee = await Employee.findByPk(employee_id, { transaction: t });
    if (!employee) throw new Error("Employee not found");

    const txn = await AssetTransaction.create({
      asset_id: asset.id,
      employee_id: employee.id,
      status_id: 1,
      issue_date: new Date()
    }, { transaction: t });

    await asset.save({ transaction: t });

    return txn;
  });
};


const returnAssetService = async ({ asset_id, employee_id, reason }) => {
  return sequelize.transaction(async (t) => {
    const asset = await Asset.findByPk(asset_id, { transaction: t });
    if (!asset) throw new Error("Asset not found");

    const employee = await Employee.findByPk(employee_id, { transaction: t });
    if (!employee) throw new Error("Employee not found");

    const txn = await AssetTransaction.create({
      asset_id: asset.id,
      employee_id: employee.id,
      status_id: 2,
      reason: reason,
      return_date: new Date()
    }, { transaction: t });

    await asset.save({ transaction: t });

    return txn;
  });
};


const scrapAssetService = async ({ asset_id, employee_id, reason }) => {
  return sequelize.transaction(async (t) => {
    const asset = await Asset.findByPk(asset_id, { transaction: t });
    if (!asset) throw new Error("Asset not found");

    const employee = await Employee.findByPk(employee_id, { transaction: t });
    if (!employee) throw new Error("Employee not found");

    const txn = await AssetTransaction.create({
      asset_id: asset.id,
      employee_id: employee.id,
      status_id: 3,
      reason: reason,
      scrap_date: new Date()
    }, { transaction: t });

    await asset.save({ transaction: t });

    return txn;
  });
};

const assetHistoryService = async (employee_id) => {
  const id = Number(employee_id);

  const transactions = await AssetTransaction.findAll({
    where: { employee_id: id },

    include: [
      {
        model: Employee,
        attributes: ["id", "first_name", "last_name", "email", "branch_id"],
        include: [
          {
            model: Branch,
            attributes: ["id", "branch_name"]
          }
        ]
      },
      {
        model: Asset,
        attributes: ["id", "serial_number", "make", "model", "asset_category_id", "branch_id"],
        include: [
          {
            model: AssetCategory,
            attributes: ["id", "name", "description"]
          }
        ]
      },
      {
        model: AssetStatus,
        attributes: ["id", "status_name"]
      }
    ],

    order: [["createdAt", "ASC"]],
  });

  return { transactions };
};



module.exports = {
  issueAssetService,
  returnAssetService,
  scrapAssetService,
  assetHistoryService
};
