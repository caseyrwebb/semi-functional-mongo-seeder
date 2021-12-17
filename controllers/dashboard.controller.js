const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { dashboardService } = require("../services");

const createDashboard = catchAsync(async (req, res) => {
  const data = await dashboardService.createDashboard(req.body);
  res.send(data);
});

const getAllDashboards = catchAsync(async (req, res) => {
  const data = await dashboardService.getAllDashboards();
  res.send(data);
});

module.exports = {
  createDashboard,
  getAllDashboards,
};
