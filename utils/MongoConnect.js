const events = require('events');
const { MongoClient, ObjectId } = require('mongodb');

const EventEmitter = events.EventEmitter2 || events.EventEmitter;


class MongoConnect extends EventEmitter {

  async open(url, options) {
    if (this.client) return this.client

    this.url = url;
    this.options = options;

    this.client = await MongoClient.connect(this.url, this.options);
    this.emit("connected");
    return this.client
  }


  async close() {
    if (this.client) {
      await this.client.close();
      this.client = null;
    }
  }

  objectID(_id) {
    return new ObjectId(_id)
  }

}

console.log("NEW MONGO CONNECT");


module.exports = exports = new MongoConnect();