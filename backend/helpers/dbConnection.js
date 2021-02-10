const DB_CLIENT = require('mongodb').MongoClient;
const DB_URI = "mongodb://127.0.0.1:27017/";

let db;

function initializeDb() 
{
  DB_CLIENT.connect(DB_URI, { useUnifiedTopology: true })
    .then((client) => {
      db = client.db("pickr");
      console.log("initialized db");
    })
    .catch((err) => {
      console.error(`Error: ${err}`);
    });
}

function getDb()
{
  return db;
}

module.exports = {
  initializeDb,
  getDb
}