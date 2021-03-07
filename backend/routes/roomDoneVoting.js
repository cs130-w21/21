const dbConn = require("../helpers/dbConnection");
const mongodb = require("mongodb");
const cookieHelper = require("../helpers/cookie");
const helper = require("../helpers/helper");

const express = require('express');
const router = express.Router();


router.get('/', async function(req, res, next) {
  let cookie = req.cookies['pickrCookie'];
  let done = 0;
  let membersDone = true;
  let ownerDone = true;
  if(cookie)
  {
    let roomCode = cookieHelper.cookieDecode(cookie, cookieHelper.secretKey).roomCode;
    let db = dbConn.getDb();
    let res = await db.collection("Rooms").findOne({
      "_id": mongodb.ObjectID(roomCode)
    });

    res = JSON.parse(JSON.stringify(res));
    for(let i = 0; i < res.members.length; i++)
    {
      if(!res.members[i].doneVoting)
      {
        membersDone = false;
        break;
      }
    }

    if(!res.owner.doneVoting)
      ownerDone = false;
  }

  res.json({
    "done": (membersDone && ownerDone) ? 1 : 0,
    "o" : ownerDone,
    "m" : membersDone
  });
});


module.exports = router;