let dbConn = require("../helpers/dbConnection");

var express = require('express');
var router = express.Router();

/* POST room to create a new room, returns the roomID/roomCode */
router.post('/', async function(req, res, next) {
  let db = dbConn.getDb();
  let createRoomRes = await db.collection("Groups").insertOne({
    "test": "test"
  });

  if(createRoomRes["result"]["ok"] != 1)
  {
    res.status(500).send("500 Internal Server Error: database insert failed");
  }

  let roomId = createRoomRes["insertedId"];
  res.json({
    "roomCode": roomId
  });
});

module.exports = router;
