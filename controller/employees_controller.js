const { Op, Sequelize } = require("sequelize");

const {
  addEmployeeService,
  getAllEmployeesService,
  getEmployeeByIdService,
  updateEmployeeService,
  deleteEmployeeService,
} = require('../service/employees_service');

const addEmployeeController = async (req, res) => {
  try {
    const { first_name, last_name, email, branch_id, is_active } = req.body;

    const newEmployee = await addEmployeeService({
      first_name,
      last_name,
      email,
      branch_id,
      is_active,
    });

    return res.status(201).json({
      success: true,
      message: "Employee created successfully",
      data: {
        id: newEmployee.id,
        first_name: newEmployee.first_name,
        last_name: newEmployee.last_name,
        email: newEmployee.email,
        branch_id: newEmployee.branch_id,
        is_active: newEmployee.is_active,
        createdAt: newEmployee.createdAt,
        updatedAt: newEmployee.updatedAt
      }

    });

  } catch (error) {
    console.error(error);

    if (
      error.name === "SequelizeValidationError" ||
      error.name === "SequelizeUniqueConstraintError"
    ) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.errors.map((err) => err.message),
      });
    }

    if (error.message === "Employee already exists") {
      return res.status(409).json({
        success: false,
        message: "Employee already exists",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


const getAllEmployeesController = async (req, res) => {
  try {
    const { params, query } = req;

    const { employees, total } = await getAllEmployeesService(params, query, res);

    return res.status(200).json({
      success: true,
      message: "Employees fetched successfully",
      employees,
      pagination: {
        currentPage: params.page,
        totalPages: Math.ceil(total / params.limit),
        totalItems: total,
        itemsPerPage: params.limit,
      },
    });

  } catch (error) {
    console.log('error', error);

    return res.status(500).json({
      success: false,
      statusCode: 500,
      message: "Internal server error",
    });
  }
};

const getEmployeeByIdController = async (req, res) => {
  try {
    const { id } = req.params;
    const employee = await getEmployeeByIdService(id);
    res.status(200).json({
      success: true,
      message: "Employees fetched successfully",
      data: employee
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Employee Not Found",
      error: error.message
    });
  }
};

const updateEmployeeController = async (req, res) => {
  try {
    const { id } = req.params;
    const { first_name, last_name, email, branch_id, is_active } = req.body;

    const updatedEmployee = await updateEmployeeService(id, {
      first_name,
      last_name,
      email,
      is_active,
      branch_id
    });

    return res.status(201).json({
      success: true,
      message: "Employee updated successfully",
      data: {
        id: updatedEmployee.id,
        first_name: updatedEmployee.first_name,
        last_name: updatedEmployee.last_name,
        email: updatedEmployee.email,
        branch: newEmployee.branch_id,
        is_active: updatedEmployee.is_active,
        createdAt: updatedEmployee.createdAt,
        updatedAt: updatedEmployee.updatedAt
      }
    });

  } catch (error) {
    console.error(error);

    if (
      error.name === "SequelizeValidationError" ||
      error.name === "SequelizeUniqueConstraintError"
    ) {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: error.errors.map((err) => err.message),
      });
    }

    if (error.message === "Employee not found") {
      return res.status(404).json({
        success: false,
        message: "Employee not found",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};


const deleteEmployeeController = async (req, res) => {
  try {
    const { id } = req.params;

    await deleteEmployeeService(id);

    return res.status(201).json({
      success: true,
      statusCode: 201,
      message: "Employee deleted successfully",
    });

  } catch (error) {
    console.error(error);

    if (error.message === "Employee not found") {
      return res.status(404).json({
        success: false,
        statusCode: 404,
        message: "Employee not found",
      });
    }

    if (error.message === "Employee already deleted") {
      return res.status(400).json({
        success: false,
        statusCode: 400,
        message: "Employee already deleted",
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
  addEmployeeController,
  getAllEmployeesController,
  getEmployeeByIdController,
  updateEmployeeController,
  deleteEmployeeController,
};
