const dbConn = require("../helpers/dbConnection");
const mongodb = require("mongodb");
const cookieHelper = require("../helpers/cookie");
const helper = require("../helpers/helper");

var express = require('express');
const { route } = require(".");
var router = express.Router();


/*
  GET /room to get the user's room, if they are part of one.
  Returns:
  - room object or empty (json)
*/
router.get('/', async function(req, res, next) {
  let cookie = req.cookies["pickrCookie"];
  if(!cookie)
  {
    res.json({});
  }

  let decoded = cookieHelper.cookieDecode(cookie, cookieHelper.secretKey);
  let db = dbConn.getDb();
  let roomObj = await db.collection("Rooms").findOne({
    "_id": {$eq: mongodb.ObjectID(decoded.roomCode)}
  });

  if(!roomObj)
  {
    res.json({});
  }

  roomObj["members"] = roomObj["members"].map(x => 
    cookieHelper.cookieDecode(x, cookieHelper.secretKey).user
  );
  
  roomObj["owner"] = cookieHelper.cookieDecode(roomObj["owner"], cookieHelper.secretKey).user;
  res.json(roomObj);
});


/* 
  POST /room to create a new room.
  Request body required arguments:
  - user (string) 
  Returns:
  - roomCode (string)
*/
router.post('/', async function(req, res, next) {
  let user = req.body.user;
  if(!user)
  {
    res.status(400).send("400 Bad Request: please include user in request body.");
    return;
  }

  let db = dbConn.getDb();
  let createRoomRes = await db.collection("Rooms").insertOne({
    "options": [],
    "members": []
  });

  if(createRoomRes["result"]["ok"] != 1)
  {
    res.status(500).send("500 Internal Server Error: database insert failed.");
    return;
  }

  let roomCode = createRoomRes["insertedId"];
  let cookie = cookieHelper.generateCookie(user, roomCode);
  let addOwnerRes = await db.collection("Rooms").updateOne({
    "_id": {$eq: mongodb.ObjectID(roomCode)}
  }, {
    $set: {"owner": cookie}
  });

  if(addOwnerRes["result"]["ok"] != 1)
  {
    res.status(500).send("500 Internal Server Error: database insert failed.");
    return;
  }
  res.cookie("pickrCookie", cookie, {});
  res.json({
    "roomCode": roomCode
  });
});


/* 
  DELETE /room to delete the room. 
  Request body required arguments: 
  - roomCode (string)
*/
router.delete('/', async function(req, res, next) {
  let roomCode = req.body.roomCode;
  if(!roomCode || !helper.validRoomCode(roomCode)) 
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
  if(!roomCode || !helper.validRoomCode(roomCode))
  {
    res.status(400).send("400 Bad Request: please enter a valid roomCode in request body.");
    return;
  }

  let cookie = cookieHelper.generateCookie(user, roomCode);

  let db = dbConn.getDb();

  let joinRoomRes = await db.collection("Rooms").updateOne({
    "_id": { $eq: mongodb.ObjectID(roomCode) }
  }, {
    $addToSet: {
      "members": cookie
    }
  });

  if(joinRoomRes["result"]["ok"] != 1)
  {
    res.status(500).send("500 Internal Server Error: room join failed.");
    return;
  }

  res.cookie("pickrCookie", cookie, {});
  res.status(200).send("200 OK: successfully joined room.");
});

module.exports = router;
