const dbConn = require("../helpers/dbConnection");
const mongodb = require("mongodb");
const cookieHelper = require("../helpers/cookie");
const helper = require("../helpers/helper");

const express = require('express');
const router = express.Router();


/*
  POST /option to insert an option for a particular room.
  Required request body arguments:
  - roomCode (string)
  - option (string)
*/
router.post("/", async function(req, res, next) {
  let roomCode = req.body.roomCode;
  if(!roomCode || !helper.validRoomCode(roomCode))
  {
    res.status(400).send("400 Bad Request: please include roomCode in request body.");
    return;
  }

  let option = req.body.option;
  if(!option)
  {
    res.status(400).send("400 Bad Request: please include option in request body.");
    return;
  }

  let db = dbConn.getDb();
  let optionAddRes = await db.collection("Rooms").updateOne({
    "_id": mongodb.ObjectID(roomCode)
  }, {
    $addToSet: {
      "options": option
    }
  });

  if(optionAddRes["result"]["ok"] != 1)
  {
    res.status(500).send("500 Internal Server Error: option add failed.");
    return;
  }

  res.status(200).send("200 OK: successfully added option.");
});


/*
  DELETE /option to delete an option for a particular room.
  Required request body arguments:
  - roomCode (string)
  - option (string)
*/
router.delete("/", async function(req, res, next) {
  let roomCode = req.body.roomCode;
  if(!roomCode || !helper.validRoomCode(roomCode))
  {
    res.status(400).send("400 Bad Request: please include roomCode in request body.");
    return;
  }

  let option = req.body.option;
  if(!option)
  {
    res.status(400).send("400 Bad Request: please include a valid option in request body.");
    return;
  }

  let db = dbConn.getDb();
  let deleteOptionRes = await db.collection("Rooms").updateOne({
    "_id": { $eq: mongodb.ObjectID(roomCode) }
  }, {
    $pull: { "options": option }
  });

  if(deleteOptionRes["result"]["ok"] != 1)
  {
    res.status(500).send("500 Internal Server Error: option delete failed.");
    return;
  }

  res.status(200).send("200 OK: successfully deleted option.")
});

module.exports = router;