const config = require("../config/config");
const mongoConnect = require("../utils/MongoConnect");
class Token {
  constructor() {
    this.collection = mongoConnect.client.db(config.mongo.db).collection("tokens")
  }

  /**
   * Create new document
   * @param {Object} doc
   * @returns {Promise<Document>}
   */
  async create(doc) {
    const { user, ...usertoken } = doc;
    usertoken.user = mongoConnect.objectID(user);
    const savedDoc = await this.collection.insertOne(usertoken);
    return savedDoc;
  }

  /**
   * Create or update a document
   * @param {string} userId 
   * @param {object} doc 
   * @returns {Promise<Document>}
   */
  async createOrUpdate(doc) {
    const { user, ...usertoken } = doc;
    if (user) {
      usertoken.user = mongoConnect.objectID(user);
    }
    const { value } = await this.collection.findOneAndUpdate({ user: usertoken.user, type: usertoken.type }, { $set: usertoken }, { upsert: true, returnDocument: "after" });
    return value;
  }
  /**
   * Find by id
   * @param {string} id
   * @returns {Promise<Document>}
   */
  async findById(id, options = {}) {
    return await this.collection.findOne({ _id: mongoConnect.objectID(id) }, options);
  };

  /**
   * Find one
   * @param {object} query
   * @param {object} options
   * @returns {Promise<Document>}
   */
  async findOne(query, options = {}) {
    const { user, ...token } = query;
    if (user) {
      token.user = mongoConnect.objectID(user);
    }
    return await this.collection.findOne({ token: token.token }, options);
  }

  /**
   * Remove one document
   * @param {object} query 
   * @param {object} options 
   * @returns {Promise<integer>}
   */
  async remove(query, options = {}) {
    const { deletedCount } = await this.collection.deleteOne(query, options);
    return deletedCount
  }

  /**
   * Remove many documents
   * @param {object} query 
   * @param {object} options 
   * @returns {Promise<integer>}
   */
  async removeAll(query, options = {}) {
    const { user, ...token } = query;
    if (user) {
      token.user = mongoConnect.objectID(user);
    }
    const { deletedCount } = await this.collection.deleteMany(token, options);
    return deletedCount
  }
}

module.exports = new Token();