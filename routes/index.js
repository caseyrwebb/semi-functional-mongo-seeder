const express = require("express");
const authRoute = require("./auth.route");
const subsystemRoute = require("./subsystem.route");
const historicRoute = require("./historic.route");
const dashboardRoute = require("./dashboard.route");

const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/subsystem",
    route: subsystemRoute,
  },
  {
    path: "/historic",
    route: historicRoute,
  },
  {
    path: "/dashboard",
    route: dashboardRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
