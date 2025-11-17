const Joi = require("joi");

const assetSchema = Joi.object({
  serial_number: Joi.string().min(3).max(100).required(),
  make: Joi.string().min(2).max(100).required(),
  model: Joi.string().min(1).max(100).required(),
  asset_category_id: Joi.number().required(),
  branch_id: Joi.number().required(),
  stock:Joi.number().required(),
  is_active: Joi.string(),
});

const updateAssetSchema = Joi.object({
  serial_number: Joi.string().min(3).max(100).optional(),
  make: Joi.string().min(2).max(100).optional(),
  model: Joi.string().min(1).max(100).optional(),
  type: Joi.string().min(2).max(100).optional(),

  status: Joi.string()
    .valid("in_stock", "issued", "obsolete")
    .optional(),

  value: Joi.number().precision(2).min(1).optional(),
}).min(1);

module.exports = {
  assetSchema,
  updateAssetSchema,
};
