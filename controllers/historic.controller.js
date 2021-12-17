const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');

const getHistoric = catchAsync(async (req, res) => {
  const { subsystem, timeScale } = req.query;
  res.status(httpStatus.CREATED).send({ ok: "ok", subsystem, timeScale });
});

module.exports = {
  getHistoric
};