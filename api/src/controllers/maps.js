//Custom code
const { Maps, MapPoints } = require("../db.js");
const { conn } = require("../db.js");
const response = require("../common/response.js");
//External libraries
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");

////////////////////////////////// SESSIONS //////////////////////////////////

//----------------------------- Log in a user -----------------------------//

async function getMaps(req) {
  try {
    if (req.params.mapId == null) {
        where = {};
      } else {
        where = { id: req.params.mapId };
      }
      console.log(where);
    const maps = await Maps.findAll({
      where,
      include: [
        {
            model: MapPoints
        }
      ]
    });
    console.log(maps);
    return response(
      req.body,
      {
        title: "Maps",
        data: maps,
        status: 200,
      },
      "getMaps"
    );
  } catch (err) {
    let error = err.error ? err.error : err;
    let status = err.error ? err.status : 500;
    return response(
      req.body,
      {
        title: "API Catched error",
        data: String(error),
        status: status,
        success: false,
      },
      "getMaps"
    );
  }
}
//----------------------------- End log in a user -----------------------------//

module.exports = {
    getMaps,
};
