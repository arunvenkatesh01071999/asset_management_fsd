const AssetCategory = require('../models/asset_category');

const addAssetCategoryService = async ({ name, description }) => {
  try {
    
    const exists = await AssetCategory.findOne({ where: { name } });
    if (exists) throw new Error("Asset category already exists");

    const newCategory = await AssetCategory.create({
      name,
      description,
    });

    return newCategory;
  } catch (error) {
    throw error;
  }
};


const getAllAssetCategoriesService = async (page, limit, searchQuery) => {
  const offset = (page - 1) * limit;

  const [categories, total] = await Promise.all([
    AssetCategory.findAll({
      where: searchQuery,
      offset,
      limit,
      order: [["createdAt", "DESC"]],
      attributes: ["id", "name", "description", "createdAt"],
    }),

    AssetCategory.count({ where: searchQuery }),
  ]);

  return { categories, total };
};


const getAssetCategoryByIdService = async (id) => {
  const category = await AssetCategory.findByPk(id);

  if (!category) throw new Error("Asset category not found");

  return category;
};

const updateAssetCategoryService = async (id, data) => {
  const category = await AssetCategory.findByPk(id);

  if (!category) throw new Error("Asset category not found");

  await category.update(data);

  return category;
};

const deleteAssetCategoryService = async (id) => {
  const category = await AssetCategory.findByPk(id);

  if (!category) throw new Error("Asset category not found");

  await category.destroy();

  return;
};

module.exports = {
  addAssetCategoryService,
  getAllAssetCategoriesService,
  getAssetCategoryByIdService,
  updateAssetCategoryService,
  deleteAssetCategoryService
};
