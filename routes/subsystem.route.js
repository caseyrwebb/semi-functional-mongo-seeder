const express = require("express");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const subsystemValidation = require("../validations/subsystem.validation");
const subsystemController = require("../controllers/subsystem.controller");

const router = express.Router();

router.get("/", subsystemController.getAllSubsystems);
router.get("/historic", subsystemController.getHistoricData);
router.get("/:subsystem", subsystemController.getSubsystem);
router.get("/data-type/:dataType", subsystemController.getSubsystemByDataType);
router.post("/create", subsystemController.insertMessage);
router.post("/seed", subsystemController.seedCollection);

module.exports = router;
