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
      "options": { 
        "name": option,
        "yes": 0,
        "no": 0
      }
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
    $pull: { "options": { "name" : option } }
  });

  if(deleteOptionRes["result"]["ok"] != 1)
  {
    res.status(500).send("500 Internal Server Error: option delete failed.");
    return;
  }

  res.status(200).send("200 OK: successfully deleted option.")
});


/*
  POST /option/results to post results from card swiping to backend.
  Required request body arguments:
  - roomCode (string)
  - results (json)
*/
router.post("/results", async function(req, res, next) {
  let roomCode = req.body.roomCode;
  if(!roomCode || !helper.validRoomCode(roomCode))
  {
    res.status(400).send("400 Bad Request: please include roomCode in request body.");
    return;
  }

  let results = req.body.results;
  if(!results)
  {
    res.status(400).send("400 Bad Request: please include results in request body.");
    return;
  }
  let db = dbConn.getDb();
  for (let [name, result] of Object.entries(results)) {
    if (result == "True") {
      var optionAddRes = await db.collection("Rooms").updateOne({
        "options.name": name
      }, {
        $inc: {
          "options.$.yes": 1
        }
      });
    }
    else {
      var optionAddRes = await db.collection("Rooms").updateOne({
        "options.name": name
      }, {
        $inc: {
          "options.$.no": 1
        }
      });
    }
    
    if(optionAddRes["result"]["ok"] != 1)
    {
      res.status(500).send("500 Internal Server Error: results post failed for result: " + result[0]);
      return;
    }
  };

  // logic for setting user doneVoting to true, and
  // checking if all done voting
  let cookie = req.cookies["pickrCookie"];
  let res1 = await db.collection("Rooms").updateOne({
    "members.id": cookie
  }, {
    $set: {
      "members.$.doneVoting": true
    }
  });

  let res2 = await db.collection("Rooms").updateOne({
    "owner.id": cookie
  }, {
    $set: {
      "owner.doneVoting": true
    }
  });

  if(res1["result"]["ok"] != 1 || res2["result"]["ok"] != 1)
  {
    res.status(500).send("500 Internal Server Error: results post failed for result: " + result[0]);
    return;
  }

  res.status(200).send("200 OK: successfully processed results.");
});

/*
  POST /option/nomination to update a user's doneNominating field to backend.
*/
router.post("/nomination", async function(req, res, next) {
  let db = dbConn.getDb();

  // logic for setting user doneNominating to true
  let cookie = req.cookies["pickrCookie"];
  let res1 = await db.collection("Rooms").updateOne({
    "members.id": cookie
  }, {
    $set: {
      "members.$.doneNominating": true
    }
  });

  let res2 = await db.collection("Rooms").updateOne({
    "owner.id": cookie
  }, {
    $set: {
      "owner.doneNominating": true
    }
  });

  if(res1["result"]["ok"] != 1 || res2["result"]["ok"] != 1)
  {
    res.status(500).send("500 Internal Server Error: nomination failure");
    return;
  }

  res.status(200).send("200 OK: successfully processed nomination.");
});

module.exports = router;