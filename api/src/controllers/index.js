const allies = require("./allies");
const assists = require("./assists");
const bicycles = require("./bicycles");
const maps = require("./maps");
const listsMaster = require("./listsMaster");
const recommendations = require("./recommendations");
const sessions = require("./sessions");
const users = require("./users");

module.exports = {
  ...allies,
  ...assists,
  ...bicycles,
  ...maps,
  ...listsMaster,
  ...recommendations,
  ...sessions,
  ...users,
};
