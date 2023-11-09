//Custom code
const { Users, Bicycles } = require("../db.js");
const { createToken, verifyJWTToken } = require("../common/sessionToken");
const { conn } = require("../db.js");
const response = require("../common/response.js");
//External libraries
const { Op } = require('sequelize');
const bcrypt = require("bcryptjs");

////////////////////////////////// SESSIONS //////////////////////////////////

//----------------------------- Log in a user -----------------------------//

async function login(req) {
  try {
    //Validate if user exists
    const { username, password } = req.body;
    const user = await Users.findOne({
      where: {
        [Op.or]: [
          { username: username },
          { mail: username }
        ],
        status: {
          [Op.in]: ['ACTIVO', 'PENDIENTE']
        }
      },
      include: [Bicycles]
    });

    if (user === null)
      throw {
        error: "Usuario no encontrado, bloqueado o inactivo: " + username,
        status: 404,
      };

    //Validate if password it's correct
    const valid = await bcrypt.compare(password, user.password);
    if (valid) {
      const token = createToken(user.id);
      delete user.dataValues.password;
      return response(
        req.body,
        {
          title: "User logged in successfully",
          data: {
            user,
            token
          },
          status: 200,
        },
        "login"
      );
    } else {
      throw { error: "Contraseña invalida: " + username, status: 404 };
    }
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
      "login"
    );
  }
}
//----------------------------- End log in a user -----------------------------//

module.exports = {
    login,
};
