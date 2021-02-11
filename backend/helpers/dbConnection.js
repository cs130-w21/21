const DB_CLIENT = require('mongodb').MongoClient;
const DB_URI = "mongodb://127.0.0.1:27017/";
const logging= require("../helpers/logging");


let db;


function initializeDb() 
{
  let database;
  if(process.env.NODE_ENV === "test")
  {
    database = "test";
  }
  else
  {
    database = "pickr";
  }

  DB_CLIENT.connect(DB_URI, { useUnifiedTopology: true })
    .then((client) => {
      db = client.db(database);
      logging.logExceptOnTest("initialized db");
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