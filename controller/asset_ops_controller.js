const {
  getStockViewService,
  issueAssetService,
  returnAssetService,
  scrapAssetService,
  assetHistoryService
} = require("../service/asset_ops_service");


const getStockViewController = async (req, res) => {
  try {
    const result = await getStockViewService();

    return res.status(200).json({
      success: true,
      message: "Stock view fetched successfully",
      ...result
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


const issueAssetController = async (req, res) => {
  try {
    const { asset_id, employee_id } = req.body;

    const txn = await issueAssetService({
      asset_id, employee_id
    });

    return res.status(201).json({
      success: true,
      message: "Asset issued successfully",
      data: txn
    });
  } catch (error) {
    console.error("Issue error:", error);
    if (error.message === "Asset not found") {
      return res.status(404).json({ success: false, message: "Asset not found" });
    }
    if (error.message === "Asset already issued to an employee") {
      return res.status(409).json({ success: false, message: "Asset already issued to an employee" });
    }
    if (error.message === "Employee not found") {
      return res.status(404).json({ success: false, message: "Employee not found" });
    }
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const returnAssetController = async (req, res) => {
  try {
    const { asset_id, employee_id, reason } = req.body;

    const txn = await returnAssetService({
      asset_id, employee_id, reason
    });

    return res.status(200).json({
      success: true,
      message: "Asset returned successfully",
      data: txn
    });
  } catch (error) {
    console.error("Return error:", error);
    if (error.message === "Asset not found") {
      return res.status(404).json({ success: false, message: "Asset not found" });
    }
    if (error.message === "This employee does not have this asset") {
      return res.status(409).json({ success: false, message: "This employee does not have this asset" });
    }
    if (error.message === "Invalid return") {
      return res.status(400).json({ success: false, message: "Invalid return request" });
    }
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const scrapAssetController = async (req, res) => {
  try {
    const { asset_id, reason } = req.body;

    const txn = await scrapAssetService({ asset_id, reason });

    return res.status(200).json({
      success: true,
      message: "Asset Scraped successfully",
      data: txn
    });
  } catch (error) {
    console.error("Return error:", error);
    if (error.message === "Asset not found") {
      return res.status(404).json({ success: false, message: "Asset not found" });
    }
     if (error.message === "Could not scrap. Return it before scrapping.") {
      return res.status(409).json({ success: false, message: "Could not scrap. Return it before scrapping." });
    }
    if (error.message === "Invalid return") {
      return res.status(400).json({ success: false, message: "Invalid return request" });
    }
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const assetHistoryController = async (req, res) => {
  try {
    const { employee_id } = req.params;
    const history = await assetHistoryService(employee_id);

    return res.status(200).json({
      success: true,
      message: "Asset history fetched successfully",
      data: history
    });
  } catch (error) {
    console.error("History error:", error);
    if (error.message === "Asset not found") {
      return res.status(404).json({ success: false, message: "Asset not found" });
    }
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  getStockViewController,
  issueAssetController,
  returnAssetController,
  scrapAssetController,
  assetHistoryController
};
