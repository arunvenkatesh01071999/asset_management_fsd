const { Op, Sequelize } = require("sequelize");

const {
  addAssetService,
  getAllAssetsService,
  getAssetByIdService,
  updateAssetService,
  deleteAssetService,
} = require('../service/asset_service');

const addAssetController = async (req, res) => {
  try {
    const {     
      serial_number,
      make,
      model,
      asset_category_id,
      branch_id,
      stock,
      is_active 
    } = req.body;

    const newAsset = await addAssetService({
      serial_number,
      make,
      model,
      asset_category_id,
      branch_id,
      stock,
      is_active
    });

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Asset created successfully",
      data: newAsset
    });

  } catch (error) {
    console.error(error);

    if (
      error.name === "SequelizeValidationError" ||
      error.name === "SequelizeUniqueConstraintError"
    ) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Validation failed",
        errors: error.errors.map((err) => err.message),
      });
    }

    if (error.message === "Asset already exists") {
      return res.status(409).json({
        success: false,
        statusCode: 409,
        message: "Asset already exists",
      });
    }

    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Internal server error",
    });
  }
};



const getAllAssetsController = async (req, res) => {
  try {
    let {
      page = 1,
      limit = 10,
      search = "",
      type = "all"
    } = req.query;

    page = Number(page) || 1;
    limit = Number(limit) || 10;

    let searchQuery = {};

    if (type !== "all") {
      searchQuery.type = type;
    }

    if (search.trim()) {
      const term = search.trim();
      const like = { [Op.iLike]: `%${term}%` };

      searchQuery[Op.or] = [
        { make: like },
        { model: like },
        { type: like },
        { serial_number: like },

        Sequelize.where(
          Sequelize.cast(Sequelize.col("status"), "TEXT"),
          { [Op.iLike]: `%${term}%` }
        ),

        Sequelize.where(
          Sequelize.cast(Sequelize.col("value"), "TEXT"),
          { [Op.iLike]: `%${term}%` }
        ),
      ];
    }

    const { assets, total } = await getAllAssetsService(page, limit, searchQuery);

    return res.status(201).json({
      success: true,
      message: "Assets fetched successfully",
      data: assets,
      filters: { type },
      pagination: {
        currentPage: page,
        totalItems: total,
        itemsPerPage: limit,
        totalPages: Math.ceil(total / limit),
      },
    });

  } catch (error) {
    console.error("Error fetching assets:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


const getAssetByIdController = async (req, res) => {
  try {
    const { id } = req.params;

    const asset = await getAssetByIdService(id);

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Asset fetched successfully",
      data: asset,
    });

  } catch (error) {
    console.error(error);

    if (error.message === "Asset not found") {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Asset not found",
      });
    }

    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Internal server error",
    });
  }
};


const updateAssetController = async (req, res) => {
  try {
    const { id } = req.params;
    const { serial_number, make, model, type, status, value } = req.body;

    const updatedAsset = await updateAssetService(id, {
      serial_number,
      make,
      model,
      type,
      status,
      value
    });

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Asset updated successfully",
      data: updatedAsset
    });

  } catch (error) {
    console.error(error);

    if (
      error.name === "SequelizeValidationError" ||
      error.name === "SequelizeUniqueConstraintError"
    ) {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Validation failed",
        errors: error.errors.map((err) => err.message),
      });
    }

    if (error.message === "Asset not found") {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Asset not found",
      });
    }

    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Internal server error",
    });
  }
};


const deleteAssetController = async (req, res) => {
  try {
    const { id } = req.params;

    await deleteAssetService(id);

    return res.status(200).json({
      success: true,
      statusCode: 200,
      message: "Asset deleted successfully",
    });

  } catch (error) {
    console.error(error);

    if (error.message === "Asset not found") {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Asset not found",
      });
    }

    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Internal server error",
    });
  }
};


module.exports = {
  addAssetController,
  getAllAssetsController,
  getAssetByIdController,
  updateAssetController,
  deleteAssetController,
};
