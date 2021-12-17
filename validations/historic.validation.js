const Joi = require('joi');


const getHistoric = {
  query: Joi.object().keys({
    subsystem: Joi.string().required(),
    timeScale: Joi.string().required(),
  }),
};

module.exports = {
  getHistoric
};