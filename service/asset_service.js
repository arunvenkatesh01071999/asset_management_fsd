const Asset = require('../models/asset');

const addAssetService = async ({
  serial_number,
  make,
  model,
  asset_category_id,
  branch_id,
  stock,
  is_active }) => {
  try {
    const exists = await Asset.findOne({ where: { serial_number } });
    if (exists) {
      throw new Error("Asset already exists");
    }

    const newAsset = await Asset.create({
      serial_number,
      make,
      model,
      asset_category_id,
      branch_id,
      stock,
      is_active
    });

    return newAsset;

  } catch (error) {
    throw error;
  }
};



const getAllAssetsService = async (page, limit, searchQuery) => {
  const offset = (page - 1) * limit;

  const [assets, total] = await Promise.all([
    Asset.findAll({
      where: searchQuery,
      offset,
      limit,
      order: [["createdAt", "DESC"]],
      attributes: [
        "id",
        "serial_number",
        "make",
        "model",
        "type",
        "status",
        "value",
        "createdAt"
      ],
    }),

    Asset.count({ where: searchQuery }),
  ]);

  return { assets, total };
};

module.exports = { getAllAssetsService };



const getAssetByIdService = async (id) => {
  try {
    const asset = await Asset.findByPk(id);

    if (!asset) {
      throw new Error("Asset not found");
    }

    return asset;

  } catch (error) {
    throw new Error(error.message);
  }
};


const updateAssetService = async (id, assetData) => {
  try {
    const asset = await Asset.findByPk(id);

    if (!asset) {
      throw new Error("Asset not found");
    }

    Object.assign(asset, assetData);
    await asset.save();

    return asset;

  } catch (error) {
    throw error;
  }
};


const deleteAssetService = async (id) => {
  try {
    const asset = await Asset.findByPk(id);

    if (!asset) {
      throw new Error("Asset not found");
    }

    await asset.destroy();
    return;

  } catch (error) {
    throw error;
  }
};


module.exports = {
  addAssetService,
  getAllAssetsService,
  getAssetByIdService,
  updateAssetService,
  deleteAssetService,
};
