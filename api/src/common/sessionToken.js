const jwt = require("jsonwebtoken");

// Create token
function createToken(id) {
  const expiresIn = "30d";
  const token = jwt.sign({ id }, process.env.LOGIN_SECRET, { expiresIn });
  return token;
}

//Verify token middleware
function verifyJWTToken(token) {
  try {
    const verify = jwt.verify(token, process.env.LOGIN_SECRET);
    return verify;
  } catch (err) {
    return {
      error: err,
    };
  }
}

module.exports = { createToken, verifyJWTToken };
