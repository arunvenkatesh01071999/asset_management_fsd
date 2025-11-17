const {
  addAssetCategoryService,
  getAllAssetCategoriesService,
  getAssetCategoryByIdService,
  updateAssetCategoryService,
  deleteAssetCategoryService,
} = require("../service/asset_category_service");
const { Op } = require("sequelize");

// Add
const addAssetCategoryController = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const newCategory = await addAssetCategoryService({
      name,
      description
    });

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Asset category created successfully",
      data: newCategory,
    });

  } catch (error) {
    if (error.message === "Asset category already exists") {
      return res.status(409).json({
        success: false,
        statusCode: 409,
        message: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Internal server error",
    });
  }
};

// Get All

const getAllAssetCategoriesController = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      search = ""
    } = req.query;

    page = Number(page) || 1;
    limit = Number(limit) || 10;

    let searchQuery = {};

    // Search logic (same as assets)
    if (search.trim()) {
      const term = search.trim();
      const like = { [Op.iLike]: `%${term}%` };

      searchQuery[Op.or] = [
        { name: like },
        { description: like }
      ];
    }

    const { categories, total } = await getAllAssetCategoriesService(
      page,
      limit,
      searchQuery
    );

    return res.status(200).json({
      success: true,
      message: "Asset categories fetched successfully",
      data: categories,
      pagination: {
        currentPage: page,
        totalItems: total,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error("Error fetching categories:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


// Get One
const getAssetCategoryByIdController = async (req, res) => {
  try {
    const category = await getAssetCategoryByIdService(req.params.id);

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Asset category fetched successfully",
      data: category,
    });

  } catch (error) {
    return res.status(404).json({
      success: false,
      statusCode: 404,
      message: "Asset category not found",
    });
  }
};

// Update
const updateAssetCategoryController = async (req, res) => {
  try {
    const updated = await updateAssetCategoryService(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Asset category updated successfully",
      data: updated,
    });

  } catch (error) {
    return res.status(404).json({
      success: false,
      statusCode: 404,
      message: "Asset category not found",
    });
  }
};

// Delete
const deleteAssetCategoryController = async (req, res) => {
  try {
    await deleteAssetCategoryService(req.params.id);

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Asset category deleted successfully",
    });

  } catch (error) {
    return res.status(404).json({
      success: false,
      statusCode: 404,
      message: "Asset category not found",
    });
  }
};

module.exports = {
  addAssetCategoryController,
  getAllAssetCategoriesController,
  getAssetCategoryByIdController,
  updateAssetCategoryController,
  deleteAssetCategoryController,
};
