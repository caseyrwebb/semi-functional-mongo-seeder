const app = require("./app");
const http = require("http");
const { MongoClient } = require("mongodb");
const bcrypt = require("bcrypt");
const randomstring = require("randomstring");
const jwt = require("jwt-simple");

const config = require("./config");

const CONNECTION_URL = "mongodb://localhost:27001";
// const client = new MongoClient(url);

// Get port from environment and store in Express.
const port = normalizePort(process.env.PORT || "3002");
app.set("port", port);

// Create HTTP server.
const server = http.createServer(app);

// Listen on provided port, on all network interfaces.
server.listen(port, () => {
  MongoClient.connect(
    CONNECTION_URL,
    { useNewUrlParser: true },
    (error, client) => {
      if (error) {
        throw error;
      }
      wvTelemetry = client.db("wv_telemetry");
      wvTelemetryArchive = client.db("wv_telemetry_archive");
      console.log("Connected to mongodb!");
    }
  );
});

server.on("error", onError);
server.on("listening", onListening);

// Depe
app.get("/telemetry/:subsystem", (request, response) => {
  const subsystem = request.params.subsystem;
  wvTelemetry
    .collection(subsystem)
    .find()
    .limit(1)
    .sort({ $natural: -1 })
    .toArray((error, result) => {
      if (error) {
        return response.status(500).send(error);
      }
      response.send(result[0]);
    });
});

// Returns options for dropdown
app.get("/subsystems", (request, response) => {
  let collectionNames = [];

  wvTelemetryArchive.listCollections().toArray((error, result) => {
    if (error) {
      return response.status(500).send(error);
    }
    result.forEach((el) => {
      collectionNames.push(el.name);
    });
    response.send(collectionNames.sort());
  });
});

const subsystemQuery = async (dataType) => {
  let searchValue = dataType;
  let tempList = [];
  const arr = await wvTelemetry.listCollections().toArray();
  let collectionNames = await arr.reduce(
    (acc, el) => (el.name && acc.push(el.name), acc),
    []
  );

  for (let i = 0; i < collectionNames.length; i++) {
    const currentCollection = await wvTelemetry
      .collection(collectionNames[i])
      .find({})
      .limit(5)
      .toArray();

    const currentCollectionKeys = currentCollection.reduce(
      (acc, el) => (Object.keys(el) && acc.push(Object.keys(el)), acc),
      []
    );

    const result = currentCollectionKeys.some((el) => {
      return el.some((x) => {
        return x.includes(searchValue);
      });
    });

    if (result) {
      tempList.push(collectionNames[i]);
    }
  }
  return tempList;
};

// Options for dropdown
app.get("/subsystem/:dataType", async (request, response) => {
  const dataType = request.params.dataType;
  try {
    const subsystemsList = await subsystemQuery(dataType);
    response.send(subsystemsList);
  } catch (error) {
    response.send(error);
  }
});

// Dep
app.get("/sensor/:subsystem", (request, response) => {
  const subsystem = request.params.subsystem;
  wvTelemetryArchive
    .collection(subsystem)
    .find()
    .limit(1)
    .sort({ $natural: -1 })
    .toArray((error, result) => {
      if (error) {
        return response.status(500).send(error);
      }
      response.send(result[0]);
    });
});

// This is the dumb way v
// Trying to query all records from greatest timestamp.decisecond value to ($max: timestamp)
// Also trying to return one object with fields of arrays containing values from all objects of grouped field. (reduce array of objects to one object of arrays)
app.get("/historic", async (request, response) => {
  const { subSystem, timeScale } = request.query;

  const timeScaleSwitch = (time) => {
    let value;

    switch (time) {
      case "1Hr":
        value = 36000;
        break;
      case "30Min":
        value = 18000;
        break;
      case "15Min":
        value = 9000;
        break;
      case "10Min":
        value = 6000;
        break;
      default:
        value = 3000;
        break;
    }
    return value;
  };

  try {
    const max = await wvTelemetryArchive
      .collection(subSystem)
      .find()
      .sort({ "timestamp.deciseconds": -1 })
      .limit(1)
      .toArray();

    const limit =
      max[0]["timestamp"]["deciseconds"] - timeScaleSwitch(timeScale);

    const arr = await wvTelemetryArchive
      .collection(subSystem)
      .find({
        "timestamp.deciseconds": { $gte: limit },
      })
      .sort({ "timestamp.deciseconds": 1 })
      .toArray();

    const result = arr.filter((el) => arr.indexOf(el) % 100 === 0);

    response.send(result);
  } catch (error) {
    response.send(error);
  }
});

app.get("/auth/login", async (request, response) => {
  const { email, password } = request.query;

  const tokenForUser = (userId) => {
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: userId, iat: timestamp }, config.secret);
  };

  try {
    const user = await wvTelemetry
      .collection("users")
      .findOne({ email: email });

    if (!user) {
      response.status(400).send("ERROR LOGGING IN");
    } else {
      const passwordToCompare = user.password;

      const passwordBool = bcrypt.compareSync(password, passwordToCompare);

      if (!passwordBool) {
        response.status(400).send("ERROR LOGGING IN");
      } else {
        const token = tokenForUser(email);

        const updatedUser = await wvTelemetry
          .collection("users")
          .findOneAndUpdate(
            { email: email },
            {
              $set: {
                token: token,
              },
            }
          );

        response.send(updatedUser);
      }
    }
  } catch (error) {
    response.send(error);
  }
});

app.post("/auth/register", async (request, response) => {
  const user = {
    email: request.body.email,
    role: request.body.role,
    password: request.body.password,
  };

  const generateId = () => {
    return randomstring.generate({
      length: 17,
      charset: "23456789ABCDEFGHJKLMNPQRSTWXYZabcdefghijkmnopqrstuvwxyz",
    });
  };

  const tokenForUser = (userId) => {
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: userId, iat: timestamp }, config.secret);
  };

  try {
    const existingUser = await wvTelemetry
      .collection("users")
      .findOne({ email: user.email });
    if (existingUser) {
      response.status(400).send("USER ALREADY EXISTS");
    } else {
      const saltedPassword = bcrypt.hashSync(user.password, 10);

      const token = tokenForUser(user.email);
      const singleId = generateId();

      const newUser = await wvTelemetry.collection("users").insertOne({
        _id: singleId,
        createdAt: new Date(),
        email: user.email,
        role: user.role,
        password: saltedPassword,
        token: token,
      });

      response.send(newUser);
    }
  } catch (error) {
    response.send(error);
  }
});

app.post("/updateLayout", async (request, response) => {
  const updates = {
    layout: request.body.layout,
    widgets: request.body.widgets,
  };

  try {
    const updatedDoc = await wvTelemetry
      .collection("users")
      .updateOne(
        { username: request.body.username },
        { $set: updates },
        { upsert: true }
      );

    response.send(updatedDoc);
  } catch (error) {
    response.send(error);
  }
});

app.get("/getLayout", async (request, response) => {
  const { username } = request.query;

  try {
    const user = await wvTelemetry
      .collection("users")
      .findOne({ username: username });

    response.send(user);
  } catch (error) {
    response.send(error);
  }
});

// Normalize a port into a number, string, or false.
function normalizePort(val) {
  let port = parseInt(val, 10);
  if (isNaN(port)) {
    // named pipe
    return val;
  }
  if (port >= 0) {
    // port number
    return port;
  }
  return false;
}

// Event listener for HTTP server "error" event.
function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  let bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "PORT " + addr.port;
  console.log("LISTENING ON " + bind);
}
