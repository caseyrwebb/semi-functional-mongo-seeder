const httpStatus = require("http-status");
const { Dashboard } = require("../models");
const ApiError = require("../utils/ApiError");

/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<User>}
 */
const createDashboard = async (dashboard) => {
  return await Dashboard.create(dashboard);
};

const getAllDashboards = async () => {
  return await Dashboard.getAllDashboards();
};

module.exports = {
  createDashboard,
  getAllDashboards,
};
