const listsMaster = require("./listsMaster");
const users = require("./users");

module.exports = {
  ...listsMaster,
  ...users,
};
