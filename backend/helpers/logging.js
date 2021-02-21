function logExceptOnTest(string) {
  if (process.env.NODE_ENV !== 'test') {
    console.log(string);
  }
}

module.exports = {
  logExceptOnTest
}