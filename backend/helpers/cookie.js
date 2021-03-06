const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');


const secretKey = "randomkey";
const twentyYears = Math.floor(Date.now() / 1000) + (20 * 365 * 24 * 60 * 60);


function generateCookie(user, roomCode)
{
  return jwt.sign(
    {"exp": twentyYears, "user": user, "roomCode": roomCode},
    secretKey,
    {algorithm: "HS256"}
  );
}

function cookieDecode(cookie, secretKey)
{
  console.log(cookie)
  return jwt.verify(cookie, secretKey, { algorithms: ["HS256"]});
}

module.exports = {
  generateCookie,
  cookieDecode,
  secretKey
}