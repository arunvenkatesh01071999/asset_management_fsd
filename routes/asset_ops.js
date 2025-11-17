const express = require("express");
const {
  getStockViewController,
  issueAssetController,
  returnAssetController,
  scrapAssetController,
  assetHistoryController
} = require("../controller/asset_ops_controller");

const router = express.Router();

router.get('/stock/view', getStockViewController);

router.post("/issue", issueAssetController);

router.post("/return", returnAssetController);

router.post("/scrap", scrapAssetController);

router.get("/history/:employee_id", assetHistoryController);

module.exports = router;
