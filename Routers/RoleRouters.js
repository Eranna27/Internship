const express = require("express");
const roleRouters = new express.Router();
const authController = require("../Controller/RoleManagement/AuthController");
const adminController = require("../Controller/RoleManagement/AdminController");


// Admin, Reporter and Guest Reporter Login

roleRouters.post("/login", authController.login);


roleRouters.post(
  "/role/add",
  adminController.addRole
);

roleRouters.post(
  "/role/forgot/password",
  adminController.forgotPassword
);

// Logout

roleRouters.post(
  "/logout/:roleID",
  authController.logout
);


module.exports = roleRouters