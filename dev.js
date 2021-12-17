const { MongoClient } = require('mongodb');
const config = require("./config/config");
const easyRandomData = require('easy-random-data');


async function main(db = "wv_dev", col = "test2") {
  const client = new MongoClient(config.mongo.url, config.mongo.options);
  //let colName = easyRandomData.pickOne(["test2", "test3", "test4"]);
  let colName = "test4";
  try {
    await client.connect();
    await client.db(db).collection(colName).insertOne({ prop1: easyRandomData.fullName(), prop2: easyRandomData.phone() });
  } finally {
    await client.close();
  }
}



(() => {
  setInterval(() => { main().catch(console.error) }, [1000]);
})();