const express = require("express");
const departmentRouters = new express.Router();
const departmentController = require("../../Controller/departments/DepartmentController");
const { authenticate, authorizeRoles } = require("../../Config/Authorize");

// Create department

departmentRouters.post(
  "/create",
  authenticate,
  authorizeRoles(["Admin"]),
  departmentController.createDepartment
);


// department

departmentRouters.get("/get",
  authenticate,
  authorizeRoles(["Admin"]),
  departmentController.getDepartments);



// Single department By ID

departmentRouters.get("/get/:departmentID",
  authenticate,
  authorizeRoles(["Admin"]),
  departmentController.singleDepartmentByID
);



// Update department By ID

departmentRouters.put(
  "/update/:departmentID",
  authenticate,
  authorizeRoles(["Admin"]),
  departmentController.updateDepartmentByID
);



// Change department Status By ID

departmentRouters.put(
  "/status/:departmentID",
  authenticate,
  authorizeRoles(["Admin"]),
  departmentController.changeStatusByID
);

module.exports = departmentRouters;
