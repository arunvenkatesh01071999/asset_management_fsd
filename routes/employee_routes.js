const express = require('express');
const {
  addEmployeeController,
  getAllEmployeesController,
  getEmployeeByIdController,
  updateEmployeeController,
  deleteEmployeeController,
} = require('../controller/employees_controller');

const router = express.Router();

const validate = require("../middleware/validate");
const {
  employeeSchema,
  updateEmployeeSchema,
} = require("../validators/employee_validator");


router.post('/add', validate(employeeSchema), addEmployeeController);

router.get('/get/all/:page/:limit', getAllEmployeesController);

router.get('/get-one/:id', getEmployeeByIdController);

router.put('/update/:id', validate(updateEmployeeSchema), updateEmployeeController);

router.delete('/delete/:id', deleteEmployeeController);

module.exports = router;
