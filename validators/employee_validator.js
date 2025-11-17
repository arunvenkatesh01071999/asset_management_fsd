const Joi = require("joi");

const employeeSchema = Joi.object({
  first_name: Joi.string().min(2).max(50).required(),
  last_name: Joi.string().min(1).max(50).required(),
  email: Joi.string().email().required(),
  branch_id: Joi.number().required(),
  is_active:Joi.boolean().required()
});

const updateEmployeeSchema = Joi.object({
  first_name: Joi.string().min(2).max(50).optional(),
  last_name: Joi.string().min(1).max(50).optional(),
  email: Joi.string().email().optional(),
  branch_id: Joi.number().required(),
  is_active:Joi.boolean().required()
}).min(1);

module.exports = {
  employeeSchema,
  updateEmployeeSchema,
};
