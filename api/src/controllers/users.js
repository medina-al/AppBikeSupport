//Custom code
const { Users, ListsMaster, Bicycles, BicycleImages } = require("../db.js");
const { conn } = require("../db.js");
const response = require("../common/response");
const sendEmail = require("../common/mailConfig");
const { randomString } = require("../common/strings.js");
//External libraries
const bcrypt = require("bcryptjs");
const fs = require("fs");
const { Op } = require("sequelize");

////////////////////////////////// USERS //////////////////////////////////

//----------------------------- Get all or a single user -----------------------------//
async function getUsers(req) {
  try {
    console.log(req.query);
    let where = {};
    let whereBikes = {};
    if (req.params.userId != null) where.id = req.params.userId;
    if (req.query.type != null) where.type = req.query.type;
    if (req.query.status != null) where.status = req.query.status;
    if (req.query.publicAccount != null)
      where.public = req.query.publicAccount == 1 ? true : false;
    if (req.query.publicBike != null)
      whereBikes.public = req.query.publicBike == 1 ? true : false;

    console.log(whereBikes);
    let users = await Users.findAll({
      where,
      attributes: {
        exclude: ["password"],
      },
      include: [
        {
          model: Bicycles,
          where: whereBikes,
          include: [
            {
              model: BicycleImages,
            },
            {
              model: ListsMaster,
              attributes: ["id", "global", "firstValue", "secondValue"],
              association: "Material",
            },
            {
              model: ListsMaster,
              attributes: ["id", "global", "firstValue", "secondValue"],
              association: "Type",
            },
            {
              model: ListsMaster,
              attributes: ["id", "global", "firstValue", "secondValue"],
              association: "Brakes",
            },
          ],
          required: false,
        },
      ],
    });
    console.log(users);
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
    if (req.body.username)
      conditions.push({ username: req.body.username.toLowerCase() });
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
      mobile: req.body.mobile ? req.body.mobile : null,
      status: "PENDIENTE",
      type: "BICIUSUARIO",
      image_url: req.file ? req.file.path : null,
      code: randomCode,
      public: req.body.public,
    });

    if (newUser === null) throw { error: "Error creating user", status: 400 };

    newUser.password = null;

    //Send verification account email
    try {
      let username = newUser.username;
      email = await sendEmail(
        req.body.mail,
        "Verifica tu cuenta de Bike Support",
        "verificationAccount",
        {
          code: randomCode,
          username: username,
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

//----------------------------- Edit user account -----------------------------//
async function editAccount(req) {
  const t = await conn.transaction();
  try {
    console.log(req.body);
    console.log(req.params);
    // Validations
    let conditions = [];
    if (req.body.username)
      conditions.push({ username: req.body.username.toLowerCase() });
    const alreadyExists = await Users.findOne({
      where: {
        [Op.or]: conditions,
      },
    });

    if (alreadyExists !== null) {
      //throw { error: "El usuario ya existe", status: 400 };
    }

    //Edit row in database
    let user = await Users.findByPk(req.params.userId);
    if (req.body.password != "") {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      user.password = hashedPassword;
    }
    user.username = req.body.username.toLowerCase();
    user.names = req.body.names;
    user.lastnames = req.body.lastnames;
    user.bio = req.body.bio;
    user.mobile = req.body.mobile;
    user.status = req.body.status;
    user.public = req.body.public;
    user.image_url = req.file ? req.file.path : null;

    const editedUser = await user.save();

    if (editedUser === null) throw { error: "Error editing user", status: 400 };

    let userUpdated = await Users.findByPk(req.params.userId, {
      include: [
        {
          model: Bicycles,
          include: [
            {
              model: BicycleImages,
            },
            {
              model: ListsMaster,
              attributes: ["id", "global", "firstValue", "secondValue"],
              association: "Material",
            },
            {
              model: ListsMaster,
              attributes: ["id", "global", "firstValue", "secondValue"],
              association: "Type",
            },
            {
              model: ListsMaster,
              attributes: ["id", "global", "firstValue", "secondValue"],
              association: "Brakes",
            },
          ],
          required: false,
        },
      ],
    });

    userUpdated.password=null;

    await t.commit();
    return response(
      req.body,
      {
        title: "User edited",
        data: userUpdated,
        status: 200,
      },
      "editAccount"
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
      "editAccount"
    );
  }
}
//----------------------------- End edit user account  -----------------------------//

//----------------------------- Verify user account -----------------------------//
async function verifyAccount(req) {
  const t = await conn.transaction();
  try {
    console.log(req.body);
    const user = await Users.findByPk(req.body.userId);
    if (user.code == req.body.code) {
      user.code = null;
      user.status = "ACTIVO";

      const editedUser = user.save();

      if (editedUser === null)
        throw { error: "Error editando el usuario", status: 400 };
    } else {
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
  editAccount,
  verifyAccount,
};
