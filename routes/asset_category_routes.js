const express = require("express");
const router = express.Router();

const {
  addAssetCategoryController,
  getAllAssetCategoriesController,
  getAssetCategoryByIdController,
  updateAssetCategoryController,
  deleteAssetCategoryController,
} = require("../controller/asset_category_controller");

const validate = require("../middleware/validate");

const {
  assetCategorySchema,
  updateAssetCategorySchema
} = require("../validators/asset_category_validator");

router.post("/add", validate(assetCategorySchema), addAssetCategoryController);

router.get("/get/all", getAllAssetCategoriesController);

router.get("/get-one/:id", getAssetCategoryByIdController);

router.put("/update/:id", validate(updateAssetCategorySchema), updateAssetCategoryController);

router.delete("/delete/:id", deleteAssetCategoryController);

module.exports = router;
