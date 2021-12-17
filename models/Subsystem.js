const config = require("../config/config");
const mongoConnect = require("../utils/MongoConnect");

class Subsystem {
  constructor() {
    this.client = mongoConnect.client;
  }

  db(name) {
    this.db = name;
    return this;
  }

  collection(subsystem) {
    this.collection = subsystem;
    return this;
  }

  async findBySubsystem(subsystem, options = {}) {
    const result = await this.client
      .db(config.mongo.schemaDb)
      .collection(subsystem)
      .findOne({}, options);
    return result;
  }

  async insertMessage(doc) {
    const { ...message } = doc;
    return await this.client
      .db(config.mongo.testDb)
      .collection("ublox")
      .insertOne(message);
  }

  async seedCollection(collectionName, doc) {
    const { ...message } = doc;
    const data = await this.client
      .db(config.mongo.db)
      .collection(collectionName)
      .insertOne(message);
    return data;
  }

  async returnAllSubsystems() {
    let collectionNames = [];
    const arr = await this.client
      .db(config.mongo.schemaDb)
      .listCollections()
      .toArray();

    arr.forEach((el) => {
      collectionNames.push(el.name);
    });
    return collectionNames.sort();
  }

  async subsystemHistoricData(subsystem, timeScale) {
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

    const max = await this.client
      .db(config.mongo.archiveDb)
      .collection(subsystem)
      .find()
      .sort({ "timestamp.deciseconds": -1 })
      .limit(1)
      .toArray();

    const limit =
      max[0]["timestamp"]["deciseconds"] - timeScaleSwitch(timeScale);

    const arr = await this.client
      .db(config.mongo.archiveDb)
      .collection(subsystem)
      .find({
        "timestamp.deciseconds": { $gte: limit },
      })
      .sort({ "timestamp.deciseconds": 1 })
      .toArray();

    const records = arr.filter((el) => arr.indexOf(el) % 100 === 0);

    return records;
  }

  async getSubsystemByDataType(dataType) {
    const subsystemQuery = async (dataType) => {
      let searchValue = dataType;
      let tempList = [];
      const arr = await this.client
        .db(config.mongo.archiveDb)
        .listCollections()
        .toArray();
      let collectionNames = await arr.reduce(
        (acc, el) => (el.name && acc.push(el.name), acc),
        []
      );

      for (let i = 0; i < collectionNames.length; i++) {
        const currentCollection = await this.client
          .db(config.mongo.archiveDb)
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

    const subsystemsList = await subsystemQuery(dataType);
    return subsystemsList;
  }
}

module.exports = new Subsystem();
