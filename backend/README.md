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
POST | /option/nomination | roomCode (string) | update nomination status of current user as completed to backend 

Results json should have the following format based on swipe result ("True" for yes swipe, "False" for no swipe):
    
    { "option_1" : "True", "option_2": "False" }


