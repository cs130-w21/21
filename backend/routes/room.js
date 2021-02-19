let dbConn = require("../helpers/dbConnection");
let mongodb = require("mongodb");

var express = require('express');
const { route } = require(".");
var router = express.Router();


/* 
  POST /room to create a new room, returns the roomID/roomCode 
*/
router.post('/', async function(req, res, next) {
  let db = dbConn.getDb();
  let createRoomRes = await db.collection("Rooms").insertOne({
    "options": [],
    "members": []
  });

  if(createRoomRes["result"]["ok"] != 1)
  {
    res.status(500).send("500 Internal Server Error: database insert failed.");
  }

  let roomId = createRoomRes["insertedId"];
  res.json({
    "roomCode": roomId
  });
});


/* 
  DELETE /room to delete the room. 
  Request body required arguments: 
  - roomCode (string)
*/
router.delete('/', async function(req, res, next) {
  let roomCode = req.body.roomCode;
  if(!roomCode) 
  {
    res.status(400).send("400 Bad Request: please include roomCode in request body.");
  }
  
  let db = dbConn.getDb();
  let deleteRoomRes = await db.collection("Rooms").deleteOne({
    "_id": { $eq: mongodb.ObjectID(roomCode) }
  });

  if(deleteRoomRes["result"]["ok"] != 1)
  {
    res.status(500).send("500 Internal Server Error: database delete failed.");
  }

  res.status(200).send("200 OK: room deleted.");
});


/* 
  POST /room/join to join a room.
  Request body required arguments:
  - roomCode (string)
  - user (string)  
*/
router.post('/join', async function(req, res, next) {
  let user = req.body.user;
  if(!user)
  {
    res.status(400).send("400 Bad Request: please include user in request body.");
    return;
  }
  
  let roomCode = req.body.roomCode;
  if(!roomCode)
  {
    res.status(400).send("400 Bad Request: please include roomCode in request body.");
    return;
  }

  let db = dbConn.getDb();
  let joinRoomRes = await db.collection("Rooms").updateOne({
    "_id": { $eq: mongodb.ObjectID(roomCode) }
  }, {
    $push: {
      "members": "test"
    }
  });

  console.log(user)
  console.log(roomCode)

  if(joinRoomRes["result"]["ok"] != 1)
  {
    res.status(500).send("500 Internal Server Error: room join failed.");
    return;
  }

  res.send(`${user}`);
});

module.exports = router;
