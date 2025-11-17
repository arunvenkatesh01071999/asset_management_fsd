const express = require('express');
const {
  addAssetController,
  getAllAssetsController,
  getAssetByIdController,
  updateAssetController,
  deleteAssetController,
} = require('../controller/asset_controller');
const validate = require("../middleware/validate");
const {
  assetSchema,
  updateAssetSchema,
} = require("../validators/asset_validator");
const router = express.Router();


router.post('/add', validate(assetSchema), addAssetController);

router.get('/get/all', getAllAssetsController);

router.get('/get-one/:id', getAssetByIdController);

router.put('/update/:id', validate(updateAssetSchema), updateAssetController);

router.delete('/delete/:id', deleteAssetController);

module.exports = router;
