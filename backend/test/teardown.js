const dbConn = require("../helpers/dbConnection");


after((done) => {
  // drop the test database once all test cases run
  let db = dbConn.getDb();
  db.dropDatabase(function(err, res) {
    done();
  });
});