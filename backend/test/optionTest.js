const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const app = require("../app");
const dbConn = require("../helpers/dbConnection");
const cookieHelper = require("../helpers/cookie");


chai.use(chaiHttp);


describe("Options", function() {
  afterEach((done) => {
    // clear the collection after each test case
    let db = dbConn.getDb();
    db.collection("Rooms").deleteMany();
    done();
  });

  describe("POST /option - valid request", () => {
    it("should add an option to the specified room", async function() {
      // create a room
      let user = "someUser";
      let createRoomRes  = await chai.request(app)
        .post("/room")
        .send({ user: user });

      // add an option to that room
      let roomCode = createRoomRes.body.roomCode;
      let addOptionRes = await chai.request(app)
        .post("/option")
        .send({ option: "option1", roomCode: roomCode });

      expect(addOptionRes.status).to.equal(200);

      // check to see if that option is present
      let cookie = cookieHelper.generateCookie(user, roomCode);
      let getRoomRes = await chai.request(app)
        .get("/room")
        .set("Cookie", `pickrCookie=${cookie}`);

      expect(getRoomRes.body).to.deep.equal({
        "_id": roomCode,
        "options": [
          {"name" : "option1", "yes": 0, "no": 0}
        ],
        "members": [],
        "owner": "someUser"
      });
    });
  });

  describe("DELETE /option - valid request", () => {
    it("should delete an option from the specified room", async function() {
      // create a room
      let user = "someUser";
      let createRoomRes = await chai.request(app)
        .post("/room")
        .send({ user: user });

      // add an option to that room
      let roomCode = createRoomRes.body.roomCode;
      let addOptionRes = await chai.request(app)
        .post("/option")
        .send({ option: "option1", roomCode: roomCode });

      expect(addOptionRes.status).to.equal(200);

      // delete an option from the room
      let deleteOptionRes = await chai.request(app)
        .delete("/option")
        .send({ roomCode: roomCode, option: "option1" });

      // check to see if option is present
      let cookie = cookieHelper.generateCookie(user, roomCode);
      let getRoomRes = await chai.request(app)
        .get("/room")
        .set("Cookie", `pickrCookie=${cookie}`);

      expect(getRoomRes.body).to.deep.equal({
        "_id": roomCode,
        "options": [],
        "members": [],
        "owner": "someUser"
      });
    });
  });

  describe("POST /option/results - valid request", () => {
    it("should increment the yes/no values of each option accordingly", async function() {
      // create a room
      let user = "someUser";
      let createRoomRes = await chai.request(app)
        .post("/room")
        .send({ user: user });

      // add an option to that room
      let roomCode = createRoomRes.body.roomCode;
      let addOptionRes1 = await chai.request(app)
        .post("/option")
        .send({ option: "option1", roomCode: roomCode });

      expect(addOptionRes1.status).to.equal(200);

      let addOptionRes2 = await chai.request(app)
        .post("/option")
        .send({ option: "option2", roomCode: roomCode });

      expect(addOptionRes2.status).to.equal(200);

      // edit results from options
      let resultsOptionRes = await chai.request(app)
        .post("/option/results")
        .send({ roomCode: roomCode, results: { "option1": "True", "option2": "False" } });

      // check to see if option is present
      let cookie = cookieHelper.generateCookie(user, roomCode);
      let getRoomRes = await chai.request(app)
        .get("/room")
        .set("Cookie", `pickrCookie=${cookie}`);

      expect(getRoomRes.body).to.deep.equal({
        "_id": roomCode,
        "options": [
          {"name" : "option1", "yes": 1, "no": 0},
          {"name" : "option2", "yes": 0, "no": 1}
        ],
        "members": [],
        "owner": "someUser"
      });
    });
  });
});