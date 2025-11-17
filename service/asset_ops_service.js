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

const getStockViewService = async () => {
  const assets = await Asset.findAll({
    include: [
      {
        model: Branch,
        attributes: ["id", "branch_name"],
      },
      {
        model: AssetTransaction,
        attributes: ["status_id"],
        required: false,
        where: {
          status_id: 1,
        },
      }
    ]
  });

  const inStock = assets.filter(a => a.asset_transactions.length === 0);

  const grouped = {};

  inStock.forEach(asset => {
    const branchId = asset.branch_id;
    const branchName = asset.branch.branch_name;

    if (!grouped[branchId]) {
      grouped[branchId] = {
        branch_id: branchId,
        branch_name: branchName,
        total_stock: 0,
        total_value: 0
      };
    }

    grouped[branchId].total_stock += 1;
    grouped[branchId].total_value += Number(asset.stock || 0);
  });

  const branchWise = Object.values(grouped);

  const grand_total_stock = branchWise.reduce((s, b) => s + b.total_stock, 0);
  const grand_total_value = branchWise.reduce((s, b) => s + b.total_value, 0);

  return {
    data: branchWise,
    grand_total_stock,
    grand_total_value
  };
};

const issueAssetService = async ({ asset_id, employee_id }) => {
  return sequelize.transaction(async (t) => {
    const asset = await Asset.findByPk(asset_id, { transaction: t });
    if (!asset) throw new Error("Asset not found");

    const activeIssue = await AssetTransaction.findOne({
      where: { asset_id, status_id: 1 }, // issued
      transaction: t
    });

    if (activeIssue) {
      throw new Error("Asset already issued to an employee");
    }

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

    const activeIssue = await AssetTransaction.findOne({
      where: { asset_id, employee_id, status_id: 1 },
      transaction: t
    });

    if (!activeIssue) {
      throw new Error("This employee does not have this asset");
    }

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


const scrapAssetService = async ({ asset_id, reason }) => {
  return sequelize.transaction(async (t) => {
    const asset = await Asset.findByPk(asset_id, { transaction: t });
    if (!asset) throw new Error("Asset not found");

    const lastTransaction = await AssetTransaction.findOne({
      where: { asset_id },
      order: [['id', 'DESC']],   // latest record
      transaction: t
    });

    if (!lastTransaction || lastTransaction.status_id !== 2) {
      throw new Error("Could not scrap. Return it before scrapping.");
    }

    const txn = await AssetTransaction.create({
      asset_id: asset.id,
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
  getStockViewService,
  issueAssetService,
  returnAssetService,
  scrapAssetService,
  assetHistoryService
};
