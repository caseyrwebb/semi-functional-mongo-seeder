const Joi = require('joi');


const getSubsystem = {
  params: Joi.object().keys({
    subsystem: Joi.string(),
  }),
};

module.exports = {
  getSubsystem
};