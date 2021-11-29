const bcrypt = require("bcryptjs");

const passwordCheck = (enteredPass, result) => {
  // will compare encrypted function against entered password
  if (bcrypt.compareSync(enteredPass, result)) {
    return true;
  } else {
    return false;
  }
};

module.exports = passwordCheck;
