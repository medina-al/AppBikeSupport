const assists = require("./assists");
const maps = require("./maps");
const listsMaster = require("./listsMaster");
const sessions = require("./sessions");
const users = require("./users");

module.exports = {
  ...assists,
  ...maps,
  ...listsMaster,
  ...sessions,
  ...users,
};
