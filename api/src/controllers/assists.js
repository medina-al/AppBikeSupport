//Custom code
const {
  Allies,
  AllyRatings,
  AllyUsers,
  Assists,
  AssistImages,
  Bicycles,
  BicycleImages,
  ListsMaster,
  Users,
} = require("../db.js");
const response = require("../common/response");
const { conn } = require("../db.js");
//External libraries
const geolib = require("geolib");
const { Sequelize } = require('sequelize');

////////////////////////////////// ASSISTS //////////////////////////////////

//----------------------------- Get all or a single list -----------------------------//
async function getAssists(req) {
  try {
    let where = {};
    if (req.params.assistId != null) {
      where.id = req.params.assistId;
    }
    if (req.params.userType == "BICIUSUARIO") {
      where.user_id = req.params.userId;
    } else if (req.params.userType == "TÉCNICO") {
      where.user_tec_id = req.params.userId;
    } else if (req.params.userType == "ALIADO") {
      where.ally_id = req.params.userId;
    } else if (req.params.userType == "ADMINISTRADOR") {

    }

    let assists = await Assists.findAll({
      where,
      attributes: [
        "id",
        "title",
        "description",
        "latitude",
        "longitude",
        "open_time",
        "attention_time",
        "close_time",
        "total",
        "notes",
      ],
      order: [[{ model: ListsMaster, as: "StatusAssist" }, "secondValue"]],
      include: [
        {
          model: Users,
          attributes: [
            "username",
            "names",
            "lastnames",
            "mail",
            "image_url",
            "mobile",
          ],
          association: "UserAssist",
        },
        {
          model: Users,
          attributes: [
            "username",
            "names",
            "lastnames",
            "mail",
            "image_url",
            "mobile",
          ],
          association: "TechnicianAssist",
        },
        {
          model: Allies,
        },
        {
          model: AssistImages,
        },
        {
          model: ListsMaster,
          attributes: [
            "id",
            "global",
            "firstValue",
            "secondValue",
            "thirdValue",
          ],
          association: "StatusAssist",
        },
        {
          model: ListsMaster,
          attributes: ["id", "global", "firstValue", "secondValue"],
          association: "TypeAssist",
        },
        {
          model: AllyRatings,
          attributes: ["comment", "rate"],
        },
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
        },
      ],
    });

    return response(
      req.params,
      {
        title: "Assists",
        data: assists,
        status: 200,
      },
      "getAssists"
    );
  } catch (err) {
    return response(
      req.body,
      {
        title: "API Catched error",
        data: String(err),
        status: 500,
        success: false,
      },
      "getAssists"
    );
  }
}
//----------------------------- End get all or a single list -----------------------------//

//----------------------------- Get all assists close to an ally -----------------------------//
async function getOpenAssists(req) {
  try {
    const ally = await AllyUsers.findOne({
      where: { user_id: req.params.userId },
      include: [Allies]
    });
    const latitude=ally.Ally.latitude;
    const longitude=ally.Ally.longitude;

    const assists = await Assists.findAll({
      where: {
        status_id: 13,
      },
      attributes: ["id", "title", "description", "latitude", "longitude"],
    });

    const filteredAssists = assists.filter((assist) => {
      const distance = geolib.getDistance(
        { latitude: assist.latitude, longitude: assist.longitude },
        { latitude, longitude }
      );
      const distanceInKm = distance / 1000;
      assist.dataValues.distance=distanceInKm;
      return distanceInKm <= 5;
    });

    const data = filteredAssists.length > 0 ? filteredAssists[0] : null;

    return response(
      req.params,
      {
        title: "Assists",
        data: data,
        status: 200,
      },
      "getOpenAssists"
    );
  } catch (err) {
    return response(
      req.body,
      {
        title: "API Catched error",
        data: String(err),
        status: 500,
        success: false,
      },
      "getOpenAssists"
    );
  }
}
//----------------------------- End Get all assists close to an ally -----------------------------//

//----------------------------- Assign assist to technician -----------------------------//
async function assignAssist(req) {
  const t = await conn.transaction();
  try {
    const allyUser = await AllyUsers.findOne({
      where: { user_id: req.params.userId }
    });
    //Update row in database
    let assist = await Assists.findByPk(req.params.assistId);
    assist.user_tec_id=req.params.userId;
    assist.ally_id=allyUser.ally_id;
    assist.status_id=12;
    assist.attention_time= Sequelize.literal("CURRENT_TIMESTAMP");

    const updatedAssist = await assist.save();

    if (updatedAssist === null)
      throw { error: "Error updating assist", status: 400 };

    await t.commit();
    return response(
      req.body,
      {
        title: "Assist updated",
        data: assist,
        status: 200,
      },
      "assignAssist"
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
      "assignAssist"
    );
  }
}
//----------------------------- End assign assist to technician  -----------------------------//

//----------------------------- Close assist -----------------------------//
async function closeAssist(req) {
  const t = await conn.transaction();
  try {
    //Update row in database
    let assist = await Assists.findByPk(req.params.assistId);
    assist.status_id=14;
    assist.total=req.body.total;
    assist.notes=req.body.notes;
    assist.close_time= Sequelize.literal("CURRENT_TIMESTAMP");

    const updatedAssist = await assist.save();

    if (updatedAssist === null)
      throw { error: "Error updating assist", status: 400 };

    await t.commit();
    return response(
      req.body,
      {
        title: "Assist updated",
        data: assist,
        status: 200,
      },
      "closeAssist"
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
      "closeAssist"
    );
  }
}
//----------------------------- End Close assist -----------------------------//

//----------------------------- Cancel assist -----------------------------//
async function cancelAssist(req) {
  const t = await conn.transaction();
  try {
    let status;
    if(req.body.userType=='BICIUSUARIO'){
      status=15;
    }else if (req.body.userType=='TÉCNICO'){
      status=16;
    }else if(req.body.userType=='ADMINISTRADOR'){
      status=17;
    }

    //Update row in database
    let assist = await Assists.findByPk(req.params.assistId);
    assist.status_id=status;
    assist.notes=req.body.notes;
    assist.close_time= Sequelize.literal("CURRENT_TIMESTAMP");

    const updatedAssist = await assist.save();

    if (updatedAssist === null)
      throw { error: "Error updating assist", status: 400 };

    await t.commit();
    return response(
      req.body,
      {
        title: "Assist updated",
        data: assist,
        status: 200,
      },
      "cancelAssist"
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
      "cancelAssist"
    );
  }
}
//----------------------------- End Close assist -----------------------------//

//----------------------------- Create assist -----------------------------//
async function createAssist(req) {
  const t = await conn.transaction();
  try {
    console.log(req.body);
    console.log(req.files);
    //Create row in database
    const newAssist = await Assists.create({
      title: req.body.title,
      description: req.body.description,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      user_id: req.body.user_id,
      status_id: 13,
      type_id: req.body.type_id,
      bicycle_id: req.body.bicycle_id,
    });

    if (newAssist === null)
      throw { error: "Error creating assist", status: 400 };

    await Promise.all(
      req.files.map(async (image) => {
        try {
          await AssistImages.create({
            url: image.path,
            assist_id: newAssist.id,
          });
        } catch (err) {
          throw err;
        }
      })
    );

    await t.commit();
    return response(
      req.body,
      {
        title: "New assist created",
        data: newAssist,
        status: 200,
      },
      "createAssist"
    );
  } catch (err) {
    //Rollback transactions
    await t.rollback();
    //Drop file - Single file
    if (req.files) {
      req.files.forEach((file) => {
        fs.unlinkSync(file.path);
      });
    }
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
      "createAssist"
    );
  }
}
//----------------------------- End create assist  -----------------------------//

//----------------------------- Rate assist -----------------------------//
async function rateAssist(req) {
  const t = await conn.transaction();
  try {
    const allyRate = await AllyRatings.create({
      comment: req.body.comment,
      rate: req.body.rate,
      ally_id: req.body.ally_id
    })

    if (allyRate === null)
      throw { error: "Error creating rate", status: 400 };

    //Update row in database
    let assist = await Assists.findByPk(req.params.assistId);
    assist.rating_id=allyRate.id;
    const updatedAssist = await assist.save();

    if (updatedAssist === null)
      throw { error: "Error updating assist", status: 400 };

    await t.commit();
    return response(
      req.body,
      {
        title: "Assist updated",
        data: assist,
        status: 200,
      },
      "rateAssist"
    );
  } catch (err) {
    //Rollback transactions
    await t.rollback();
    //Drop file - Single file
    if (req.files) {
      req.files.forEach((file) => {
        fs.unlinkSync(file.path);
      });
    }
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
      "rateAssist"
    );
  }
}
//----------------------------- End rate assist  -----------------------------//

module.exports = {
  getAssists,
  getOpenAssists,
  assignAssist,
  createAssist,
  closeAssist,
  cancelAssist,
  rateAssist
};
