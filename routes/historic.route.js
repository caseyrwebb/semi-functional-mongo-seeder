const express = require('express');
const auth = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const historicValidation = require('../validations/historic.validation');
const historicController = require('../controllers/historic.controller');


const router = express.Router();

router.get('/', auth('getHistoric'), validate(historicValidation.getHistoric), historicController.getHistoric);


module.exports = router;