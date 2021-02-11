const chai = require("chai");
const chaiHttp = require("chai-http");
const expect = chai.expect;
const app = require("../app");
const dbConn = require("../helpers/dbConnection");


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

  describe("/POST room - success", () => {
    it('should create a room properly', function(done) {
      chai.request(app)
        .post("/room")
        .end((err, res) => {
          expect(res.body.roomCode).to.not.be.null;
          expect(res.body.roomCode).to.not.be.undefined;
          done();
        });
    });
  });

  describe("/DELETE room - success", () => {
    it("should delete the specified room", function(done) {
      chai.request(app)
        .post("/room")
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

  describe("/DELETE room - no roomCode in request body", () => {
    it("should throw a 'no roomCode' error", function(done) {
      chai.request(app)
        .delete("/room")
        .end((err, res) => {
          expect(res.status).to.equal(400);
          done();
        });
    });
  });

});
