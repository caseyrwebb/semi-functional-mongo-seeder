const mongoConnect = require("./utils/MongoConnect");

const config = require("./config/config");

const {
  acsvdata,
  crownmaxondata,
  pumpmsgfb,
  ublox,
  deltappressure,
} = require("./subsystemTemplates");

mongoConnect.open(config.mongo.url, config.mongo.options);

mongoConnect.on("connected", async () => {
  const { Subsystem } = require("./models");
  const app = require("./app");
  const httpServer = require("http").createServer(app);
  httpServer.listen(config.port, () =>
    console.log(
      `${process.pid} - Mongo Connected - Listening on port ${config.port}`
    )
  );
  /* Stop app if servers die */
  const exitHandler = () => {
    if (httpServer) {
      httpServer.close(() => {
        console.log("Server closed");
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  };

  // const data = {
  //   id: null,
  //   _created: Date.now(),
  //   time: null,
  //   _mission: null,
  //   _source: null,
  //   _raw: null,
  //   hw_deltap_1: null,
  //   hw_deltap_2: null,
  //   rs_deltap: null,
  //   timestamp_mission_days: null,
  //   timestamp_deciseconds: null,
  // };

  // const data = {
  //   id: null,
  //   _created: Date.now(),
  //   time: null,
  //   _mission: null,
  //   _source: null,
  //   _raw: null,
  //   temp1_c: null,
  //   temp2_c: null,
  //   temp3_c: null,
  //   temp4_c: null,
  //   crc_failures: null,
  //   heater_on: null,
  //   can_bus_message_loss: null,
  //   can_bus_error_flag: null,
  //   heater_duty_cycle: null,
  //   timestamp_mission_days: null,
  //   timestamp_deciseconds: null,
  // };

  function randomWithLimits(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; // max & min both included
  }

  // let time = null;

  const timer = (ms) => new Promise((res) => setTimeout(res, ms));

  for (let i = 0; i < 1000; i++) {
    // let datum = data;

    // if (time) {
    //   datum["_created"] = time + 60000;
    // } else {
    //   datum["_created"] = data["_created"] + 60000;
    // }

    // datum.temp1_c = randomWithLimits(0, 500);
    // datum.temp2_c = randomWithLimits(0, 500);
    // datum.temp3_c = randomWithLimits(0, 500);

    // datum.temp1_c = 1;
    // datum.temp2_c = 1;
    // datum.temp3_c = 1;

    // time = datum["_created"];

    await Subsystem.seedCollection("acsvdata", acsvdata());

    await Subsystem.seedCollection("crownmaxondata", crownmaxondata());

    await Subsystem.seedCollection("pumpmsgfb", pumpmsgfb());

    await Subsystem.seedCollection("ublox", ublox());

    await Subsystem.seedCollection("deltappressure", deltappressure());

    await timer(1000);
    console.log("data seeded");
  }

  /* Catch unexpected errors */
  const unexpectedErrorHandler = (error) => {
    console.error(error);
    exitHandler();
  };
  process.on("uncaughtException", unexpectedErrorHandler);
  process.on("unhandledRejection", unexpectedErrorHandler);

  /* Try to free up port on termination */
  process.on("SIGTERM", () => {
    console.log("SIGTERM received");
    if (httpServer) {
      httpServer.close();
    }
  });
});
