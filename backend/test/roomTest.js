const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const app = require("../app");
const dbConn = require("../helpers/dbConnection");
const cookieHelper = require("../helpers/cookie");


chai.use(chaiHttp);


describe("Rooms", function () {
  beforeEach((done) => {  
    done();
  });

  afterEach((done) => {
    // clear the collection after each test case
    let db = dbConn.getDb();
    db.collection("Rooms").deleteMany();
    done();
  });

  describe("GET /room - valid request, no existing room", () => {
    it("should get an empty object", function(done) {
      chai.request(app)
        .get("/room")
        .end((err, res) => {
          expect(res.body).to.deep.equal({});
          expect(res.status).to.equal(200);
          done();
        });
    });
  });

  describe("GET /room - valid request, existing room found", () => {
    it("should get the user's current room", function(done) {
      let user = "someUser";
      // create a room
      chai.request(app)
        .post("/room")
        .send({ user: user })
        .end((err, res) => {
          // generate the cookie and get the created room
          let roomCode = res.body.roomCode;
          let cookie = cookieHelper.generateCookie(user, roomCode);
          chai.request(app)
            .get("/room")
            .set("Cookie", `pickrCookie=${cookie}`)
            .end((err, res) => {
              expect(res.body).to.deep.equal({
                "_id": roomCode,
                "options": [],
                "members": [],
                "owner": "someUser"
              });
              expect(res.status).to.equal(200);
              done();
            });
        });
    });
  });

  describe("POST /room - valid request", () => {
    it('should create a room properly', function(done) {
      chai.request(app)
        .post("/room")
        .send({ user: "someUser" })
        .end((err, res) => {
          expect(res.body.roomCode).to.not.be.null;
          expect(res.body.roomCode).to.not.be.undefined;
          done();
        });
    });
  });

  describe("DELETE /room - valid request", () => {
    it("should delete the specified room", function(done) {
      chai.request(app)
        .post("/room")
        .send({ user: "someUser" })
        .end((err, res) => {
          let roomCode = res.body.roomCode;
          chai.request(app)
            .delete("/room")
            .send({ roomCode: roomCode })
            .end((err, res) => {
              expect(res.status).to.equal(200);
              done();
            });
        });
    });
  });

  describe("DELETE /room - no roomCode in request body", () => {
    it("should throw a 'no roomCode' error", function(done) {
      chai.request(app)
        .delete("/room")
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
    });
  });

  describe("POST /room/join - valid request", () => {
    it("should add a member to a group", async function() {
      let owner = "ownerUser";
      // create a room, as the owner 
      let createRoomRes = await chai.request(app)
        .post("/room")
        .send({ user: owner });

      // join a room, as a member
      let roomCode = createRoomRes.body.roomCode;
      let member = "memberUser";
      let joinRoomRes = await chai.request(app)
        .post("/room/join")
        .send({ roomCode: roomCode, user: member });
      
      expect(joinRoomRes.status).to.equal(200);

      // generate a cookie and use it to retrieve the room
      let cookie = cookieHelper.generateCookie(member, roomCode);
      let getRoomRes = await chai.request(app)
        .get("/room")
        .set("Cookie", `pickrCookie=${cookie}`)
        .send({ user: member });

      // room should have the member in it
      expect(getRoomRes.body).to.deep.equal({
        "_id": roomCode,
        "options": [],
        "members": [
          "memberUser"
        ],
        "owner": "ownerUser"
      });
    });
  })
});
