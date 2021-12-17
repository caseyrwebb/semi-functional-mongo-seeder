const config = require("../config/config");
const mongoConnect = require("../utils/MongoConnect");

class Dashboard {
  constructor() {
    this.collection = mongoConnect.client
      .db(config.mongo.db)
      .collection("dashboards");
  }

  async create(doc) {
    const { ...dashboard } = doc;
    return await this.collection.insertOne(dashboard);
  }

  async getAllDashboards() {
    const data = await this.collection.find({}).toArray();
    return data;
  }
}

module.exports = new Dashboard();
