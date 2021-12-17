const express = require("express");
const auth = require("../middlewares/auth");
const validate = require("../middlewares/validate");
const dashboardController = require("../controllers/dashboard.controller");

const router = express.Router();

router.post("/create", dashboardController.createDashboard);
router.get("/get-all", dashboardController.getAllDashboards);

module.exports = router;
