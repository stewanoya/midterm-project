// -- generateRandomString.js -- //

// generate a string that is 8 char long
const generateRandomString = function() {
  return (Math.random() + 1).toString(36).substring(4);
};


module.exports = generateRandomString;
