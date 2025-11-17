const Employee = require('../models/employee');
const { Op } = require("sequelize");

const addEmployeeService = async ({ first_name, last_name, email, branch_id, is_active }) => {
  try {
    const newEmployee = await Employee.create({
      first_name,
      last_name,
      email,
      branch_id,
      is_active
    });

    return newEmployee;
  } catch (error) {
    throw error
  }
};


const getAllEmployeesService = async (params, query, res) => {
  try {
    const { page, limit } = params;
    let { search, status } = query;

    let whereCondition = {};

    if (search && search.trim()) {
      let like = `%${search.trim()}%`;

      whereCondition[Op.or] = [
        { first_name: { [Op.iLike]: like } },
        { last_name: { [Op.iLike]: like } },
        { email: { [Op.iLike]: like } }
      ];
    }

    if (status === "active") {
      whereCondition.is_active = true;
    } else if (status === "inactive") {
      whereCondition.is_active = false;
    }

    const offset = (page - 1) * limit;

    const [employees, total] = await Promise.all([
      Employee.findAll({
        where: whereCondition,
        offset,
        limit,
        order: [['createdAt', 'DESC']],
        attributes: ['id', 'first_name', 'last_name', 'email', 'is_active']
      }),
       Employee.count({ where: whereCondition })
    ]);

    return { employees, total };

  } catch (error) {
    throw new Error(error.message);
  }
};


const getEmployeeByIdService = async (id) => {
  try {
    const employee = await Employee.findOne({ where: { id: id } });
    if (!employee) {
      throw new Error('Employee not found');
    }
    return employee;
  } catch (error) {
    throw new Error(error.message);
  }
};

const updateEmployeeService = async (id, employeeData) => {
  try {
    const employee = await Employee.findOne({ where: { id: id } });
    if (!employee) {
      throw new Error('Employee not found');
    }
    Object.assign(employee, employeeData);
    await employee.save();
    return employee;
  } catch (error) {
    throw error
  }
};

const deleteEmployeeService = async (id) => {
  try {
    const employee = await Employee.findByPk(id);

    if (!employee) {
      throw new Error("Employee not found");
    }

    if (employee.isActive === false) {
      throw new Error("Employee already deleted");
    }

    employee.is_active = false;
    await employee.save();

    return;
  } catch (error) {
    throw error;
  }
};


module.exports = {
  addEmployeeService,
  getAllEmployeesService,
  getEmployeeByIdService,
  updateEmployeeService,
  deleteEmployeeService,
};