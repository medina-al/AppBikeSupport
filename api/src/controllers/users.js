//Custom code
const {
  Users,
  ListsMaster
} = require("../db.js");
const { conn } = require("../db.js");
const response = require("../common/response");
const sendEmail = require("../common/mailConfig");
const { randomString } = require("../common/strings.js")
//External libraries
const bcrypt = require("bcryptjs");
const fs = require("fs");
const { Op } = require("sequelize");

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

//----------------------------- Create user account -----------------------------//
async function createAccount(req) {
  const t = await conn.transaction();
  try {
    // Validations
    let conditions = [];
    if (req.body.mail) conditions.push({ mail: req.body.mail.toLowerCase() });
    if (req.body.username) conditions.push({ username: req.body.username.toLowerCase() });
    const alreadyExists = await Users.findOne({
      where: {
        [Op.or]: conditions,
      },
    });

    if (alreadyExists !== null) {
      //throw { error: "El usuario o correo ya existe", status: 400 };
    }

    //Create row in database
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const randomCode = randomString(8);
    const newUser = await Users.create({
      username: req.body.username.toLowerCase(),
      password: hashedPassword,
      mail: req.body.mail.toLowerCase(),
      names: req.body.names,
      lastnames: req.body.lastnames,
      bio: req.body.bio,
      mobile: req.body.mobile,
      status: "PENDIENTE",
      type: "BICIUSUARIO",
      image_url: req.file ? req.file.path : null,
      code: randomCode
    });

    if (newUser === null) throw { error: "Error creating user", status: 400 };

    //Send verification account email
    try {
      let username = newUser.username;
      email = await sendEmail(
        req.body.mail,
        "Verifica tu cuenta de Bike Support",
        "verificationAccount",
        {
          code: randomCode,
          username: username
        }
      );
    } catch (err) {
      throw err;
    }

    await t.commit();
    return response(
      req.body,
      {
        title: "New user created",
        data: newUser,
        status: 200,
      },
      "createAccount"
    );
  } catch (err) {
    //Rollback transactions
    await t.rollback();
    //Drop file - Single file
    if (req.file) fs.unlinkSync(req.file.path);
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
      "createAccount"
    );
  }
}
//----------------------------- End create user account  -----------------------------//

//----------------------------- Create user account -----------------------------//
async function verifyAccount(req) {
  const t = await conn.transaction();
  try {
    console.log(req.body);
    const user = await Users.findByPk(req.body.userId);
    if(user.code==req.body.code){
      user.code=null;
      user.status='ACTIVO';

      const editedUser = user.save()

      if (editedUser === null) throw { error: "Error editando el usuario", status: 400 };
    }else{
      throw { error: "Código inválido", status: 400 };
    }
    await t.commit();
    return response(
      req.body,
      {
        title: "Usuario activado",
        data: user,
        status: 200,
      },
      "verifyAccount"
    );
  } catch (err) {
    //Rollback transactions
    await t.rollback();
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
      "verifyAccount"
    );
  }
}

module.exports = {
  getUsers,
  createAccount,
  verifyAccount
};
