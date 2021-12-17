const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const { subsystemService } = require("../services");

const getSubsystem = catchAsync(async (req, res) => {
  const { subsystem } = req.params;
  const data = await subsystemService.getDataPointsOfSubsystem(subsystem);
  res.send(data);
});

const getAllSubsystems = catchAsync(async (req, res) => {
  const data = await subsystemService.getSubsystemNames();
  res.send(data);
});

const getHistoricData = catchAsync(async (req, res) => {
  const { subsystem, timeScale } = req.query;

  const data = await subsystemService.getSubsystemHistoricData(
    subsystem,
    timeScale
  );
  res.send(data);
});

const getSubsystemByDataType = catchAsync(async (req, res) => {
  const { dataType } = req.params;
  const data = await subsystemService.getSubsystemByDataType(dataType);
  res.send(data);
});

const insertMessage = catchAsync(async (req, res) => {
  const data = await subsystemService.insertMessage(req.body);
  res.send(data);
});

const seedCollection = catchAsync(async (req, res) => {
  const data = await subsystemService.insertMessage(req.body);
  res.send(data);
});

module.exports = {
  getSubsystem,
  getAllSubsystems,
  getHistoricData,
  getSubsystemByDataType,
  insertMessage,
  seedCollection,
};
