function validRoomCode(roomCode)
{
  if((roomCode.length != 12) && (roomCode.length != 24))
  {
    return false;
  }

  return true;
}

module.exports = {
  validRoomCode
}