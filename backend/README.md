## How to run it locally
1. Navigate to the repo
2. Install dependencies `npm install`
3. Run `npm start`. (Optional) Install `nodemon` and run the server using `nodemon npm start`. This lets you edit the code, and it will automatically restart the 
server whenever it detects changes.
4. Then you can access any endpoint. For example `localhost:3000/room`


## Endpoints
### /room

HTTP Method | Endpoint | Required Arguments (in request body) | Description
--- | --- | --- | --- 
GET | /room | N/A | get a particular user's room if it exists. If not, returns empty JSON
POST | /room | user (string) | create a room and return the roomCode of the newly created room
DELETE | /room | roomCode (string) | delete the specified room 
POST | /room/join | roomCode (string), user (string) | join the specified room
POST | /room/study | user (string) | create a room with preset study locations and return the roomCode and options of the newly created room
POST | /room/food | user (string) | create a room with preset food locations and return the roomCode and options of the newly created room

### /option

HTTP Method | Endpoint | Required Arguments (in request body) | Description
--- | --- | --- | --- 
POST | /option | roomCode (string), option (string) | insert an option for a particular room
DELETE | /option | roomCode (string), option (string) | delete the specified option for a particular room
POST | /option/results | roomCode (string), results (json) | pass results from card swiping to backend, updating room + option info

Results json should have the following format based on swipe result ("True" for yes swipe, "False" for no swipe):
    
    { "option_1" : "True", "option_2": "False" }


## User Persistence without Sign-up, using Cookies
I thought there might be an issue if a group is in the voting stage, and one of the group members closes their browser. Then, they would have no way to rejoin the voting room. 
The room gets stuck too, because they are waiting for the member to join back.

I thought maybe we could use cookies to solve this problem. Here's how it works. 

Each time we create a room (POST /room) or join a room (POST /room/join), the response will contain a new cookie. That the client browser will save. This cookie will 
be sent to the backend on every subsequent request to the server.

If the user has no cookie, we can be sure that they are a new user. No problem here.

If the user has a cookie, the frontend should check to see if the cookie is already associated with a room. Please GET /room to see if there is an associated room. That way, 
the user can join back to their existing room, if they were part of one and just closed their browser/disconnected.

This implementation isn't fully fleshed out, and there are many edge cases that it doesn't cover. Please lmk if you have a better implementation.
