const config = require("../config/config");
const mongoConnect = require("../utils/MongoConnect");
const bcrypt = require("bcryptjs");
class User {
  constructor() {
    this.collection = mongoConnect.client
      .db(config.mongo.db)
      .collection("users");
  }

  /**
   * Create new document
   * @param {Object} doc
   * @returns {Promise<Document>}
   */
  async create(doc) {
    const { password, ...user } = doc;
    user.password = await bcrypt.hash(password, 8);
    user.status = "new";
    user.role = "user";
    return await this.collection.insertOne(user);
  }

  /**
   * Get user by id
   * @param {ObjectId} id
   * @returns {Promise<User>}
   */
  async findById(id, options = {}) {
    return await this.collection.findOne(
      { _id: mongoConnect.objectID(id) },
      options
    );
  }

  /**
   * Find one
   * @param {object} query
   * @param {object} options
   * @returns {Promise<Document>}
   */
  async findOne(query, options = {}) {
    const result = await this.collection.findOne(query, options);
    return result;
  }

  /**
   * Check if email is taken
   * @param {string} email - The user's email
   * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
   * @returns {Promise<boolean>}
   */
  async isEmailTaken(email, excludeUserId) {
    const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
    return !!user;
  }

  /**
   * Get user by email
   * @param {string} email
   * @returns {Promise<User>}
   */
  async getUserByEmail(email) {
    return this.findOne({ email });
  }
}

module.exports = new User();
