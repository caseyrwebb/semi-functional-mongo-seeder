const { Subsystem } = require("../models");

/**
 * Get data points of subsystem
 * @param {string} subsystem
 * @returns {Promise<Document>}
 */
const getDataPointsOfSubsystem = async (subsystem) => {
  return await Subsystem.findBySubsystem(subsystem);
};

const getSubsystemNames = async () => {
  return await Subsystem.returnAllSubsystems();
};

const getSubsystemHistoricData = async (subsystem, timeScale) => {
  return await Subsystem.subsystemHistoricData(subsystem, timeScale);
};

const getSubsystemByDataType = async (dataType) => {
  return await Subsystem.getSubsystemByDataType(dataType);
};

const insertMessage = async (message) => {
  return await Subsystem.insertMessage(message);
};

const seedCollection = async (message) => {
  return await Subsystem.insertMessage(message);
};

module.exports = {
  getDataPointsOfSubsystem,
  getSubsystemNames,
  getSubsystemHistoricData,
  getSubsystemByDataType,
  insertMessage,
  seedCollection,
};
