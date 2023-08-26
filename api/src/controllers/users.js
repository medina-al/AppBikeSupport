//Custom code
const {
  Users,
  ListsMaster
} = require("../db.js");
const { createToken, verifyJWTToken } = require("../common/sessionToken");
const { conn } = require("../db.js");
const response = require("../common/response");
const sendEmail = require("../common/mailConfig");
//External libraries
const bcrypt = require("bcryptjs");
const fs = require("fs");

////////////////////////////////// USERS //////////////////////////////////

//----------------------------- Get all or a single user -----------------------------//
async function getUsers(req) {
  try {
    if (req.params.userId == null) {
      where = {};
    } else {
      where = { id: req.params.userId };
    }
    let users = await Users.findAll({
      where,
      include: [
        {
          model: UserSocialMedia,
          include: [ListsMaster],
        }
      ],
    });
    return response(
      req.params,
      {
        title: "Users requested",
        data: users,
        status: 200,
      },
      "getUsers"
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
      "getUsers"
    );
  }
}
//----------------------------- End get all or a single user -----------------------------//

module.exports = {
  getUsers,
};
